export interface Auth {
    email: string,
    password: string,
    fullName?: string
}
export interface LoginResult {
  token: string;
  id: number;
  email: string;
  fullName: string
  role: string;
  authenticated: boolean;
}