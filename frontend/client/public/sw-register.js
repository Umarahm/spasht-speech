// Register Service Worker with version checking and auto-refresh
if ('serviceWorker' in navigator) {
    let refreshing = false;
    
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
                
                // Check for updates every 60 seconds
                setInterval(() => {
                    registration.update();
                }, 60000);
                
                // Listen for service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker is available
                                console.log('New service worker available, reloading...');
                                
                                // Show a notification or prompt user (optional)
                                // For now, we'll force reload immediately
                                if (!refreshing) {
                                    refreshing = true;
                                    // Post message to skip waiting
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    // Reload the page after a short delay
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 100);
                                }
                            }
                        });
                    }
                });
                
                // Handle controller change (when new service worker takes control)
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (!refreshing) {
                        refreshing = true;
                        console.log('Service worker controller changed, reloading...');
                        window.location.reload();
                    }
                });
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
    
    // Also check for updates when the page becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration) {
                    registration.update();
                }
            });
        }
    });
}

