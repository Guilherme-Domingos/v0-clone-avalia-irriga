export class AuthTokenError extends Error {
  constructor(message: string = 'Erro de autenticação') {
    super(message);
    this.name = 'AuthTokenError';
  }
}