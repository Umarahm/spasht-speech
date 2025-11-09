// Service Worker for Spasht PWA
// Update this version number when deploying a new version
const APP_VERSION = '1.0.0';
const CACHE_NAME = `spasht-v${APP_VERSION}`;
const urlsToCache = [
    '/',
    '/dashboard',
    '/speech-analysis',
    '/progress',
    '/Logo.png',
    '/favicon.ico',
    '/main.tsx',
    '/global.css'
];

// Install event - cache resources and skip waiting
self.addEventListener('install', (event) => {
    console.log('Service Worker installing, version:', APP_VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache:', CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating, version:', APP_VERSION);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            // Claim all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: APP_VERSION });
    }
});
