export const config = { api: { bodyParser: false } };

import Busboy from 'busboy';
import { bucket } from '../_lib/firebaseAdmin.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        const url = new URL(req.url, 'http://localhost');
        let sessionId = url.searchParams.get('sessionId') || String(req.headers['x-session-id'] || '');
        let userId = url.searchParams.get('userId') || String(req.headers['x-user-id'] || '');
        let filename = url.searchParams.get('filename') || 'recording.wav';

        const bb = Busboy({ headers: req.headers });
        let fileBuffer = null;
        let mimeType = 'audio/wav';

        bb.on('file', (_name, file, info) => {
            const { filename: fn, mimeType: mt } = info;
            if (fn) filename = fn;
            if (mt) mimeType = mt;
            const chunks = [];
            file.on('data', (d) => chunks.push(d));
            file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
        });

        bb.on('field', (name, val) => {
            if (name === 'sessionId') sessionId = val;
            if (name === 'userId') userId = val;
            if (name === 'filename') filename = val;
        });

        bb.on('finish', async () => {
            try {
                if (!sessionId) sessionId = `session_${Date.now()}`;
                if (!userId) userId = 'anonymous';
                if (!fileBuffer || !fileBuffer.length) {
                    res.status(400).json({ error: 'No file content received' });
                    return;
                }

                const objectPath = `recordings/${userId}/${sessionId}.wav`;
                const file = bucket.file(objectPath);
                await file.save(fileBuffer, {
                    contentType: mimeType || 'audio/wav',
                    metadata: {
                        metadata: { userId: String(userId), sessionId: String(sessionId), filename }
                    }
                });

                const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 365 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ success: true, session: { sessionId, userId, status: 'completed', audioUrl: signedUrl } });
            } catch (err) {
                res.status(500).json({ error: 'Upload failed', message: err.message });
            }
        });

        req.pipe(bb);
    } catch (err) {
        res.status(500).json({ error: 'Upload failed', message: err.message });
    }
}


