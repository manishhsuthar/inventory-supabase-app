const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:5000";

type ApiError = { message: string };

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    });

    const body = (await response.json().catch(() => null)) as T | { error?: string } | null;

    if (!response.ok) {
      const message = (body && typeof body === "object" && "error" in body && body.error) || `Request failed (${response.status})`;
      return { data: null, error: { message } };
    }

    return { data: body as T, error: null };
  } catch {
    return { data: null, error: { message: "Network error" } };
  }
}
