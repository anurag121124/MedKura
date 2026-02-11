const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  return localStorage.getItem("medkura_token");
}

export function setToken(token: string) {
  localStorage.setItem("medkura_token", token);
}

export function clearToken() {
  localStorage.removeItem("medkura_token");
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !options.skipAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || data.message || "Request failed";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export function get<T>(path: string, options: RequestOptions = {}) {
  return request<T>(path, { ...options, method: "GET" });
}

export function post<T>(path: string, body?: BodyInit | null, options: RequestOptions = {}) {
  return request<T>(path, { ...options, method: "POST", body });
}

export function patch<T>(path: string, body?: BodyInit | null, options: RequestOptions = {}) {
  return request<T>(path, { ...options, method: "PATCH", body });
}

export function put<T>(path: string, body?: BodyInit | null, options: RequestOptions = {}) {
  return request<T>(path, { ...options, method: "PUT", body });
}

export function del<T>(path: string, options: RequestOptions = {}) {
  return request<T>(path, { ...options, method: "DELETE" });
}
