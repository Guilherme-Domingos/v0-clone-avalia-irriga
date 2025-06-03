'use client';

import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { ToastProvider } from './toast-provider';
import { ThemeProvider } from '@/components/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider attribute='class' defaultTheme='light'>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
