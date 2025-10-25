import { bucket } from '../_lib/firebaseAdmin.js';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        const { sessionId, userId, colabUrl } = req.body || {};
        if (!sessionId || !userId) {
            res.status(400).json({ error: 'Missing required fields', message: 'sessionId and userId are required' });
            return;
        }

        const externalUrl = (colabUrl || process.env.NGROK_URL || '').toString().trim();
        if (!externalUrl) {
            res.status(500).json({ error: 'Analysis service not configured', message: 'Missing colabUrl or NGROK_URL' });
            return;
        }

        // Fetch audio from Firebase Storage
        const objectPath = `recordings/${userId}/${sessionId}.wav`;
        const file = bucket.file(objectPath);
        const [exists] = await file.exists();
        if (!exists) {
            res.status(404).json({ error: 'Audio not found', message: `Missing ${objectPath}` });
            return;
        }

        const [audioBuffer] = await file.download();

        // Prepare multipart form for external analysis service
        const form = new FormData();
        const blob = new Blob([audioBuffer], { type: 'audio/wav' });
        form.append('audio', blob, `${sessionId}.wav`);

        // Call external analysis endpoint
        const response = await fetch(`${externalUrl.replace(/\/$/, '')}/predict`, {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            const text = await response.text();
            res.status(response.status).json({ error: 'Analysis service error', message: text || response.statusText });
            return;
        }

        const analysisResult = await response.json();

        // Signed URL for audio
        const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 365 * 24 * 60 * 60 * 1000 });

        res.status(200).json({
            success: true,
            analysis: {
                sessionId,
                userId,
                segments: analysisResult.segments || [],
                summary: analysisResult.summary || null,
                rawResponse: analysisResult,
                audioUrl: signedUrl,
                analyzedAt: new Date().toISOString()
            }
        });
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to analyze recording', message: err.message });
    }
}


