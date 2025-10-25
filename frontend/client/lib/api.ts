const DEFAULT_LOCAL_API = "http://localhost:3001";

export function getApiBaseUrl(): string {
    // Prefer explicit env, else use same-origin in browser, else localhost
    const envUrl = import.meta.env?.VITE_API_URL as string | undefined;
    if (envUrl && envUrl.trim().length > 0) return envUrl.trim();

    if (typeof window !== "undefined") {
        // Always use same-origin in deployed environments
        return window.location.origin;
    }

    // Fallback to localhost API during development/SSR
    return DEFAULT_LOCAL_API;
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
    const base = getApiBaseUrl();
    const url = input.startsWith("/") ? `${base}${input}` : `${base}/${input}`;
    return fetch(url, init);
}


