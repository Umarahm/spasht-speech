
type JamTopic = {
    id: string;
    topic: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    hints: string[];
    estimatedWords: number;
    timeLimit: number;
};

const defaultTopics: JamTopic[] = [
    {
        id: 'topic_001',
        topic: 'My Daily Routine',
        description: 'Describe your typical morning routine from waking up to leaving for work/school',
        difficulty: 'beginner',
        hints: [
            'What time do you wake up?',
            'What do you eat for breakfast?',
            'How do you get ready to leave?'
        ],
        estimatedWords: 150,
        timeLimit: 60
    },
    {
        id: 'topic_003',
        topic: 'A Memorable Vacation',
        description: 'Describe a vacation or trip that you remember fondly',
        difficulty: 'intermediate',
        hints: [
            'Where did you go?',
            'Who did you travel with?',
            'What made it special?'
        ],
        estimatedWords: 160,
        timeLimit: 60
    }
];

async function loadTopics(): Promise<JamTopic[]> {
    // Try to import the existing topics list from the client data (best effort)
    try {
        const mod = await import('../../frontend/client/data/jamtopics.js');
        const data = (mod as any).jamTopics || (mod as any).jamtopics || (mod as any).default || [];
        const arr = Array.isArray(data) ? data : [];
        return arr.length ? arr : defaultTopics;
    } catch {
        return defaultTopics;
    }
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { difficulty } = req.query as { difficulty?: string };
    const topics = await loadTopics();
    if (!topics.length) {
        res.status(500).json({ error: 'No topics available' });
        return;
    }

    const filtered = difficulty
        ? topics.filter(t => t.difficulty === difficulty)
        : topics;
    const source = filtered.length ? filtered : topics;
    const selected = source[Math.floor(Math.random() * source.length)];

    const sessionId = `session_${Date.now()}`;
    res.status(200).json({ topic: selected, sessionId });
}


