// Deprecated. Uploads are handled by Express app under /api/recordings/upload
export default function handler(_req, res) {
    res.status(404).json({ error: 'Deprecated endpoint. Use /api/recordings/upload' });
}


