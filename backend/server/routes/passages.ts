import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy Gemini initialization to avoid crashing when key is missing in serverless
let genAI: GoogleGenerativeAI | null = null;
const getGenAI = (): GoogleGenerativeAI | null => {
    if (genAI) return genAI;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY is missing; using fallback passages.");
        return null;
    }
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        return genAI;
    } catch (error: any) {
        console.error("Failed to initialize GoogleGenerativeAI:", error?.message || error);
        return null;
    }
};

interface PassageRequest {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topic?: string;
    length?: 'short' | 'medium' | 'long';
}

interface PassageResponse {
    passage: string;
    difficulty: string;
    wordCount: number;
    estimatedReadTime: number; // in seconds
}

const generatePassage = async (difficulty: string, topic?: string): Promise<string> => {
    try {
        const client = getGenAI();
        if (!client) throw new Error('Gemini not configured');
        const model = client.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompts = {
            beginner: `Generate a simple reading passage suitable for beginner speech therapy students. The passage should be 50-75 words long, use basic vocabulary, and focus on everyday topics. Make it engaging and natural to read aloud. ${topic ? `Topic: ${topic}` : ''}`,
            intermediate: `Generate a reading passage suitable for intermediate speech therapy students. The passage should be 50-75 words long, use moderately complex vocabulary, and discuss interesting concepts. Make it suitable for practicing articulation and fluency. ${topic ? `Topic: ${topic}` : ''}`,
            advanced: `Generate a reading passage suitable for advanced speech therapy students. The passage should be 50-75 words long, use sophisticated vocabulary, and explore complex ideas. Make it challenging for pronunciation and expression practice. ${topic ? `Topic: ${topic}` : ''}`
        };

        const prompt = prompts[difficulty as keyof typeof prompts] || prompts.intermediate;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const passage = response.text().trim();

        // Ensure the passage is within word limits
        const words = passage.split(' ');
        if (words.length < 50) {
            // If too short, generate again with emphasis on length
            const extendedPrompt = `${prompt} Please make sure the passage is at least 50 words long.`;
            const extendedResult = await model.generateContent(extendedPrompt);
            const extendedResponse = await extendedResult.response;
            return extendedResponse.text().trim();
        } else if (words.length > 75) {
            // If too long, truncate to approximately 75 words
            return words.slice(0, 75).join(' ') + '...';
        }

        return passage;
    } catch (error) {
        console.error('Error generating passage with Gemini:', (error as Error).message);
        // Fallback to static passages if API fails
        const fallbackPassages = {
            beginner: "The cat sat on the mat. The dog ran in the park. The sun is shining bright. I like to eat ice cream. My friend likes to play games. We have fun together every day. The birds sing in the trees. The flowers are blooming now.",
            intermediate: "Digital auditory feedback is a technique used in speech therapy to help individuals improve their communication skills. By providing real-time audio feedback, speakers can become more aware of their speech patterns and make necessary adjustments to improve clarity and fluency.",
            advanced: "Neuroplasticity refers to the brain's remarkable ability to reorganize itself by forming new neural connections throughout life. This phenomenon underlies the effectiveness of speech therapy interventions, as repeated practice strengthens specific neural pathways associated with speech production and comprehension."
        };
        return fallbackPassages[difficulty as keyof typeof fallbackPassages] || fallbackPassages.intermediate;
    }
};

export const handleGeneratePassage: RequestHandler = async (req, res) => {
    try {
        const { difficulty = 'intermediate', topic, length = 'medium' }: PassageRequest = req.body;

        const passage = await generatePassage(difficulty, topic);
        const wordCount = passage.split(' ').length;
        const estimatedReadTime = Math.ceil(wordCount / 200 * 60); // Assuming 200 words per minute

        const response: PassageResponse = {
            passage,
            difficulty,
            wordCount,
            estimatedReadTime
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error generating passage:', error);
        res.status(500).json({
            error: 'Failed to generate passage',
            message: 'An error occurred while generating the reading passage.'
        });
    }
};
