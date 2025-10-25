export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { userId, passageId } = req.body || {};
    if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
    }

    const session = {
        sessionId: `session_${Date.now()}`,
        userId,
        passageId: passageId || `passage_${Date.now()}`,
        status: 'created',
        createdAt: new Date().toISOString()
    };

    res.status(200).json({ session });
}


