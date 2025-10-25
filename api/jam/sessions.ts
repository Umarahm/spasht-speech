export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { topicId, userId } = req.body || {};
    if (!topicId || !userId) {
        res.status(400).json({ error: 'Missing required fields', message: 'topicId and userId are required' });
        return;
    }

    const sessionId = `jam_${Date.now()}`;
    res.status(201).json({ success: true, session: { sessionId, userId, status: 'ready' } });
}


