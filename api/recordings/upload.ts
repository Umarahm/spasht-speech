// Handles multipart/form-data upload and writes to Firebase Storage
export const config = { api: { bodyParser: false } };

import type { IncomingMessage } from 'http';
import type { Readable } from 'stream';
import { bucket } from '../_lib/firebaseAdmin.js';

function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // Accept raw body with query params so we avoid heavy multipart parsing on serverless.
        const url = new URL(req.url, 'http://localhost');
        const sessionId = url.searchParams.get('sessionId') || req.headers['x-session-id'] || `session_${Date.now()}`;
        const userId = url.searchParams.get('userId') || req.headers['x-user-id'] || 'anonymous';
        const filename = url.searchParams.get('filename') || 'recording.wav';

        // If the client can’t send multipart, allow raw body upload as fallback
        let buffer: Buffer;
        if (req.readable) {
            buffer = await streamToBuffer(req as unknown as Readable);
        } else {
            buffer = Buffer.from([]);
        }

        if (!buffer.length) {
            res.status(400).json({ error: 'No file content received. Send the audio blob as the request body.' });
            return;
        }

        const objectPath = `recordings/${userId}/${sessionId}.wav`;
        const file = bucket.file(objectPath);
        await file.save(buffer, {
            contentType: 'audio/wav',
            metadata: {
                metadata: { userId: String(userId), sessionId: String(sessionId), filename }
            }
        });

        const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 365 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ success: true, session: { sessionId, userId, status: 'completed', audioUrl: signedUrl } });
    } catch (err: any) {
        res.status(500).json({ error: 'Upload failed', message: err.message });
    }
}


