import { apiFetch, jsonBody } from "./api";

type UserResponse = { user: AuthUser };

export function login(email: string, password: string) {
  return apiFetch<UserResponse>("/auth/login", { method: "POST", ...jsonBody({ email, password }) });
}

export function register(email: string, password: string) {
  return apiFetch<UserResponse & { loggedIn: boolean }>("/auth/register", {
    method: "POST",
    ...jsonBody({ email, password }),
  });
}

export function logout() {
  return apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
}

/** Vem är inloggad? null om ingen (backend svarar 401). */
export async function getMe(): Promise<AuthUser | null> {
  const result = await apiFetch<UserResponse>("/auth/me");
  return result.ok ? result.data.user : null;
}
