const DEFAULT_LOCAL_API = "http://localhost:3001";
const RENDER_BACKEND_URL = "https://spasht-speech-backend.onrender.com";

export function getApiBaseUrl(): string {
    // Prefer explicit env, else infer from window.location for same-origin deployments,
    // else fallback to known production domain, else localhost.
    const envUrl = import.meta.env?.VITE_API_URL as string | undefined;
    if (envUrl && envUrl.trim().length > 0) {
        return envUrl.trim();
    }

    if (typeof window !== "undefined") {
        // If app is hosted at production domain, use Render backend
        const { origin } = window.location;

        // Check for Netlify or Vercel deployments - use Render backend
        if (origin.includes("netlify.app") || origin.includes("netlify.com") ||
            origin.includes("vercel.app")) {
            return RENDER_BACKEND_URL;
        }
    }

    // Fallback to localhost API during development
    return DEFAULT_LOCAL_API;
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
    const base = getApiBaseUrl();
    const url = input.startsWith("/") ? `${base}${input}` : `${base}/${input}`;
    return fetch(url, init);
}


