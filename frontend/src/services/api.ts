export const api = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register"
  },
  reports: {
    root: "/api/reports",
    detail: (id: string) => `/api/reports/${id}`,
    status: (id: string) => `/api/reports/${id}/status`,
    summary: (id: string) => `/api/reports/${id}/summary`
  }
};
