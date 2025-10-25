const DEFAULT_LOCAL_API = "http://localhost:3001";
const RENDER_BACKEND_URL = "https://spasht-speech-backend.onrender.com";

let cachedApiBaseUrl: string | null = null;

export function getApiBaseUrl(): string {
    // Return cached value if available
    if (cachedApiBaseUrl) {
        return cachedApiBaseUrl;
    }

    // Prefer explicit env
    const envUrl = import.meta.env?.VITE_API_URL as string | undefined;
    if (envUrl && envUrl.trim().length > 0) {
        console.log('🌐 Using explicit API URL from env:', envUrl);
        cachedApiBaseUrl = envUrl.trim();
        return cachedApiBaseUrl;
    }

    // Check if we're in production by looking at hostname
    if (typeof window !== "undefined" && window.location) {
        const hostname = window.location.hostname;
        const origin = window.location.origin;

        console.log('🌐 Current origin:', origin, 'hostname:', hostname);

        // Production hosts that should use Render backend
        const productionHosts = [
            "netlify.app",
            "netlify.com",
            "vercel.app",
            "vercel.com"
        ];

        const isProduction = productionHosts.some(host => hostname.includes(host));

        if (isProduction) {
            console.log('🌐 Detected production deployment, using Render backend:', RENDER_BACKEND_URL);
            cachedApiBaseUrl = RENDER_BACKEND_URL;
            return cachedApiBaseUrl;
        }
    }

    // Fallback to localhost API during development
    console.log('🌐 Using localhost API:', DEFAULT_LOCAL_API);
    cachedApiBaseUrl = DEFAULT_LOCAL_API;
    return cachedApiBaseUrl;
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
    const base = getApiBaseUrl();
    const url = input.startsWith("/") ? `${base}${input}` : `${base}/${input}`;
    console.log('📡 API Fetch:', url);
    return fetch(url, init);
}


