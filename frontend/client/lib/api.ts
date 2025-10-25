const DEFAULT_LOCAL_API = "http://localhost:3001";

export function getApiBaseUrl(): string {
    // Prefer explicit env, else infer from window.location for same-origin deployments,
    // else fallback to known production domain, else localhost.
    const envUrl = import.meta.env?.VITE_API_URL as string | undefined;
    if (envUrl && envUrl.trim().length > 0) return envUrl.trim();

    if (typeof window !== "undefined") {
        // If app is hosted at production domain, use that origin for API (same origin)
        const { origin } = window.location;
        // Check for Netlify deployments (any Netlify subdomain or custom domain)
        if (origin.includes("netlify.app") || origin.includes("netlify.com")) {
            return origin;
        }
        // Check for Vercel deployments
        if (origin.includes("spasht-speech.vercel.app") || origin.includes("vercel.app")) {
            return origin;
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


