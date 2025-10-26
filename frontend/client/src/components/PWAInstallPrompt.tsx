import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    if (!showInstallPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-bottom-4">
            <div className="bg-white rounded-2xl shadow-2xl border-4 border-speech-green/30 p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <img src="/Logo.png" alt="Spasht Logo" className="w-16 h-16 rounded-xl" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bricolage text-lg font-bold text-speech-green mb-2">
                            Install Spasht App
                        </h3>
                        <p className="font-bricolage text-sm text-gray-600 mb-4">
                            Add Spasht to your home screen for quick access and a better experience!
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 bg-speech-green hover:bg-speech-green/90 text-white font-bricolage font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Install
                            </button>
                            <button
                                onClick={() => setShowInstallPrompt(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bricolage font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

