import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import api, { setBearerToken } from '@/services/api';
import { jwtDecode } from 'jwt-decode';

type LoginCredentials = {
  email: string;
  password: string;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  photo?: string;
  organization?: string;
};

interface Auth {
  isAuthenticated: boolean;
  role: string | null;
  userId: string | null;
  admin: boolean;
  loginSuccess: boolean | null;
  isLoading: boolean;
  userData: UserData | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | void>;
  checkSession: () => Promise<boolean>;
  getUserData: () => Promise<UserData | null>;
  // Funções para configuração direta do estado (para callbacks)
  setIsAuthenticated: (value: boolean) => void;
  setRole: (role: string | null) => void;
  setUserId: (userId: string | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

type AuthProviderProps = {
  children: ReactNode;
};

export type DecodedToken = {
  exp: number;
  iat: number;
  sub: string;
  role: string;
};

const AuthContext = createContext<Auth>({
  isAuthenticated: false,
  role: null,
  userId: null,
  admin: false,
  loginSuccess: null,
  isLoading: false,
  userData: null,
  login: async () => {},
  logout: async () => {},
  refreshToken: async () => {},
  checkSession: async () => false,
  getUserData: async () => null,
  setIsAuthenticated: () => {},
  setRole: () => {},
  setUserId: () => {},
  setIsAdmin: () => {},
});

const REFRESH_TOKEN_INTERVAL = 4 * 60 * 1000; // 4 minutos
const TOKEN_EXPIRY_MARGIN = 5 * 60; // 5 minutos em segundos

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout>();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Funções setter estáveis para evitar re-renders desnecessários
  const setAuthenticatedCallback = useCallback((value: boolean) => {
    setIsAuthenticated(value);
  }, []);

  const setRoleCallback = useCallback((roleValue: string | null) => {
    setRole(roleValue);
  }, []);

  const setUserIdCallback = useCallback((userIdValue: string | null) => {
    setUserId(userIdValue);
  }, []);

  const setIsAdminCallback = useCallback((adminValue: boolean) => {
    setIsAdmin(adminValue);
  }, []);

  const checkTokenValidity = async () => {
    try {
      const { 'irriga-ai.accessToken': currentToken } = parseCookies();
      if (!currentToken) {
        return false;
      }

      const decodedToken: DecodedToken = jwtDecode(currentToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decodedToken.exp - currentTime;

      if (timeUntilExpiry <= TOKEN_EXPIRY_MARGIN) {
        const newToken = await refreshToken();
        return !!newToken;
      }

      if (decodedToken.exp < currentTime) {
        const newToken = await refreshToken();
        return !!newToken;
      }

      return true;
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const { 'irriga-ai.refreshToken': currentRefreshToken } = parseCookies();

      if (!currentRefreshToken) {
        throw new Error('Nenhum token de atualização disponível');
      }

      const response = await api.post('/auth/refresh-token', {
        refreshToken: currentRefreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('Resposta de refresh inválida');
      }

      setCookie(undefined, 'irriga-ai.accessToken', newAccessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      setCookie(undefined, 'irriga-ai.refreshToken', newRefreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      setAccessToken(newAccessToken);
      setBearerToken(newAccessToken);

      const decodedToken: DecodedToken = jwtDecode(newAccessToken);
      setRole(decodedToken.role);
      setUserId(decodedToken.sub);
      setIsAdmin(decodedToken.role === 'ADMIN');
      setIsAuthenticated(true);

      return newAccessToken;
    } catch (error) {
      console.error('❌ Erro no refresh do token:', error);
      await logout();
      return undefined;
    }
  };

  const setupTokenMonitoring = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const interval = setInterval(async () => {
      const isValid = await checkTokenValidity();
      if (!isValid) {
        await logout();
      }
    }, REFRESH_TOKEN_INTERVAL);
    setRefreshInterval(interval);
  };

  const getUserData = async (): Promise<UserData | null> => {
    try {
      if (!isAuthenticated || !userId) {
        return null;
      }

      const response = await api.get('/auth/profile');
      const user: UserData = {
        id: response.data.id,
        name: response.data.name || response.data.nome,
        email: response.data.email,
        photo:
          response.data.image || response.data.foto || response.data.avatar,
        organization: response.data.organization || response.data.organizacao,
      };

      setUserData(user);
      return user;
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  const checkSession = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { 'irriga-ai.accessToken': token } = parseCookies();

      if (!token) {
        return false;
      }

      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp > currentTime) {
          ('Token válido, configurando estado de autenticação');
          setAccessToken(token);
          setBearerToken(token);
          setIsAuthenticated(true);
          setRole(decodedToken.role);
          setUserId(decodedToken.sub);
          setIsAdmin(decodedToken.role === 'ADMIN');
          setupTokenMonitoring();

          // Buscar dados do usuário após validar sessão
          await getUserData();

          return true;
        }
      } catch (error) {
        console.warn('Token inválido, tentando refresh');
      }

      const newToken = await refreshToken();
      return !!newToken;
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }: LoginCredentials) => {
    try {
      setIsLoading(true);
      setLoginSuccess(null);

      const response = await api.post('/auth/login', {
        email,
        password,
      });
      const { access_token, refresh_token } = response.data;

      // if (!accessToken || !newRefreshToken) {
      //   setLoginSuccess(false);
      //   throw new Error('Resposta de autenticação inválida');
      // }

      setCookie(undefined, 'irriga-ai.accessToken', access_token, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      setCookie(undefined, 'irriga-ai.refreshToken', refresh_token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      setAccessToken(access_token);
      setBearerToken(access_token);
      setIsAuthenticated(true);
      const decodedToken: DecodedToken = jwtDecode(access_token);
      const { role, sub } = decodedToken;
      setRole(role);
      setUserId(sub);
      setLoginSuccess(true);
      setIsAdmin(role === 'ADMIN');

      setupTokenMonitoring();

      // Buscar dados do usuário automaticamente após login
      await getUserData();

      localStorage.setItem('irriga-ai.session', 'active');
      localStorage.setItem('irriga-ai.session-role', role);

      if (role === 'ADMIN') {
        router.push('/admin');
        return;
      }
    } catch (error: any) {
      console.error('Erro durante login:', error);
      setAccessToken(null);
      setIsAuthenticated(false);
      setLoginSuccess(false);
      setRole(null);
      setUserId(null);
      setIsAdmin(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('🚪 Iniciando processo de logout...');

      // 1. Limpar interval de refresh primeiro
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(undefined);
      }

      // 2. Notificar backend do logout ANTES de limpar os cookies
      try {
        const { 'irriga-ai.refreshToken': refreshTokenValue } = parseCookies();
        if (refreshTokenValue) {
          await api.post('/auth/logout');
          console.log('✅ Backend notificado do logout');
        }
      } catch (error) {
        console.warn('⚠️ Erro ao notificar logout no backend:', error);
      }

      // 3. Limpar TODOS os cookies e localStorage de forma síncrona
      destroyCookie(undefined, 'irriga-ai.accessToken', { path: '/' });
      destroyCookie(undefined, 'irriga-ai.refreshToken', { path: '/' });

      // Limpar também com document.cookie para garantir
      if (typeof window !== 'undefined') {
        document.cookie =
          'irriga-ai.accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie =
          'irriga-ai.refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        localStorage.removeItem('irriga-ai.session');
        localStorage.removeItem('irriga-ai.session-role');
        sessionStorage.clear();
      }

      // 4. Limpar estado do React
      setAccessToken(null);
      setIsAuthenticated(false);
      setRole(null);
      setIsAdmin(false);
      setUserId(null);
      setUserData(null);
      setBearerToken('');
      setLoginSuccess(null);

      console.log('✅ Estado e cookies limpos');

      // 5. Aguardar um tick para garantir que tudo foi limpo
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error('❌ Erro durante logout:', error);
    } finally {
      setIsLoading(false);
      console.log('🔄 Redirecionando para login...');

      // 6. Usar window.location para forçar um reload completo e evitar middleware
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push('/login');
      }
    }
  };
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const sessionActive =
          localStorage.getItem('irriga-ai.session') === 'active';
        if (sessionActive) {
          const sessionValid = await checkSession();
          // getUserData já é chamado dentro do checkSession quando a sessão é válida
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        userId,
        login,
        admin: isAdmin,
        loginSuccess,
        isLoading,
        logout,
        refreshToken,
        checkSession,
        getUserData,
        userData,
        setIsAuthenticated: setAuthenticatedCallback,
        setRole: setRoleCallback,
        setUserId: setUserIdCallback,
        setIsAdmin: setIsAdminCallback,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): Auth => useContext(AuthContext);
