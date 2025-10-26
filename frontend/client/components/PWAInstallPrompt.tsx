import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Check if device is mobile or tablet
const isMobileOrTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Also check screen width as fallback
  const isSmallScreen = window.innerWidth <= 1024;

  return (isMobile || isTablet || (isTouchDevice && isSmallScreen));
};

// Check if 24 hours have passed since dismissal
const canShowPrompt = () => {
  const dismissedValue = localStorage.getItem(DISMISSED_KEY);
  if (!dismissedValue) return true;

  // If permanently dismissed (installed), don't show again
  if (dismissedValue === 'installed') return false;

  const now = Date.now();
  const dismissedTime = parseInt(dismissedValue, 10);

  // Check if dismissedTime is a valid number
  if (isNaN(dismissedTime)) return true;

  const timeSinceDismissal = now - dismissedTime;

  return timeSinceDismissal >= DISMISS_TIMEOUT;
};

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile/tablet
    const checkMobile = isMobileOrTablet();
    setIsMobile(checkMobile);

    // Check if user has dismissed within the last 24 hours
    if (!canShowPrompt()) {
      return; // Don't show if dismissed recently
    }

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
      // Don't show again if user installs - store as permanent dismissal
      localStorage.setItem(DISMISSED_KEY, 'installed');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store current timestamp for 24-hour cooldown
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
  };

  // Don't show on desktop
  if (!isMobile) return null;

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-2xl shadow-2xl border-4 border-speech-green/30 p-6 relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-start gap-4 pr-8">
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
                onClick={handleDismiss}
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

