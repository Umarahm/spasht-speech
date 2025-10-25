export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { difficulty = 'intermediate', length = 'medium' } = req.body || {};
    // Simple deterministic passage
    const passage = difficulty === 'beginner'
        ? 'The sun rises in the morning. Birds sing sweet songs. We wake up and smile.'
        : difficulty === 'advanced'
            ? 'In the delicate interplay between intention and articulation, clarity emerges through deliberate cadence and mindful breath.'
            : 'The quick brown fox jumps over the lazy dog. Clear speech comes from calm breathing and steady pacing.';

    res.status(200).json({ passage, difficulty, wordCount: passage.split(/\s+/).length, estimatedReadTime: 15 });
}


