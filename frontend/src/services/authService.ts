import { api } from "./api";
import { post } from "./remote";

export type AuthPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type AuthResponse = {
  token: string;
  email: string;
};

export function login(payload: AuthPayload) {
  return post<AuthResponse>(api.auth.login, JSON.stringify(payload), { skipAuth: true });
}

export function register(payload: AuthPayload) {
  return post<AuthResponse>(api.auth.register, JSON.stringify(payload), { skipAuth: true });
}
