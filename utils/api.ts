import type { ApiErrorBody, ApiResult } from "@/types/api";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

/**
 * Gemensam fetch mot backend.
 * - credentials: "include" skickar med session-cookien (inloggningen).
 * - Svarar alltid med { ok, data } eller { ok: false, error } i stället för att kasta,
 *   så att komponenterna kan visa felet från API:t.
 * - Kastar bara om servern inte går att nå alls (nätverksfel).
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const text = await response.text();
  const body: unknown = text ? JSON.parse(text) : null;

  if (response.ok) {
    return { ok: true, status: response.status, data: body as T };
  }

  const error: ApiErrorBody =
    body && typeof body === "object" && "message" in body
      ? (body as ApiErrorBody)
      : { message: `Request failed (${response.status})` };
  return { ok: false, status: response.status, error };
}

export function jsonBody(data: unknown): Pick<RequestInit, "body"> {
  return { body: JSON.stringify(data) };
}
