export const API_BASE_URL = "http://localhost:5000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

/**
 * Reusable API client for Zabaku.
 *
 * - Automatically attaches `Authorization: Bearer <token>` from localStorage.
 * - Always sends `Content-Type: application/json`.
 * - Throws a descriptive `Error` for non-2xx responses, using the backend
 *   error message when available.
 * - Returns a fully-typed response via the `TResponse` generic.
 *
 * @example
 * const user = await api<User>("/auth/me");
 * const session = await api<Session>("/auth/login", { method: "POST", body: { email, password } });
 */
export async function api<TResponse = unknown, TBody = unknown>(
  path: string,
  options: ApiOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers: extraHeaders = {} } = options;

  // --- Build headers ---
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // --- Build request init ---
  const init: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined && method !== "GET") {
    init.body = JSON.stringify(body);
  }

  // --- Execute request ---
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, init);

  // --- Handle non-2xx responses ---
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      // Prefer the backend's own error message if present
      errorMessage =
        errorBody?.message ??
        errorBody?.error ??
        JSON.stringify(errorBody) ??
        errorMessage;
    } catch {
      // Body was not JSON — fall back to status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  // --- Parse and return response ---
  // Handle 204 No Content or empty bodies gracefully
  const contentType = response.headers.get("Content-Type") ?? "";
  if (
    response.status === 204 ||
    !contentType.includes("application/json")
  ) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}
