// Simple ping service to keep Render backend awake
// Run this every 5 minutes to prevent auto-sleep

const pingInterval = 5 * 60 * 1000; // 5 minutes
const backendUrl = process.env.BACKEND_URL || 'https://spasht-speech-backend.onrender.com';

console.log(`🔄 Starting ping service for ${backendUrl}`);
console.log(`⏰ Ping interval: ${pingInterval / 1000} seconds`);

const pingBackend = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/health`);
        const data = await response.json();
        console.log(`✅ Ping successful at ${new Date().toISOString()}:`, data);
    } catch (error) {
        console.error(`❌ Ping failed at ${new Date().toISOString()}:`, error.message);
    }
};

// Ping immediately on start
pingBackend();

// Then ping every 5 minutes
setInterval(pingBackend, pingInterval);

console.log('🚀 Ping service started');

