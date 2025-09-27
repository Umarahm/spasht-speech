import { RequestHandler } from "express";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'));
        }
    }
});

interface SpeechRecognitionRequest {
    expectedText?: string;
    language?: 'english' | 'hindi';
}

interface SpeechRecognitionResponse {
    success: boolean;
    transcript: string;
    confidence: number;
    isCorrect?: boolean;
    accuracy: 'correct' | 'close' | 'wrong';
    message: string;
}


export const handleSpeechRecognition = [
    upload.single('audio'),
    async (req: any, res: any) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No audio file provided'
                });
            }

            const { expectedText, language = 'english' }: SpeechRecognitionRequest = req.body;
            const apiKey = process.env.GOOGLE_SPEECH_API_KEY;

            console.log('🔍 Speech Recognition Request:');
            console.log('Expected Text:', expectedText);
            console.log('Language:', language);
            console.log('Audio file size:', req.file?.size, 'bytes');
            console.log('Audio mimetype:', req.file?.mimetype);

            if (!apiKey) {
                console.error('❌ Google Speech API key not configured');
                return res.status(500).json({
                    success: false,
                    message: 'Google Speech API key not configured'
                });
            }

            if (apiKey.length < 20) {
                console.error('❌ API key seems too short, might be invalid');
                return res.status(500).json({
                    success: false,
                    message: 'Google Speech API key appears to be invalid'
                });
            }

            console.log('✅ Using Google Speech API key:', apiKey.substring(0, 10) + '...');

            // Try different encodings - Google Speech API supports multiple formats
            const encodings = ['WEBM_OPUS', 'LINEAR16', 'FLAC', 'MULAW', 'AMR', 'AMR_WB'];
            let requestBody;
            let apiUrl;

            // Try WebM first (what browsers typically produce), then fall back to LINEAR16
            try {
                requestBody = {
                    config: {
                        encoding: 'WEBM_OPUS', // Browser default
                        sampleRateHertz: 48000, // Browser default sample rate
                        languageCode: language === 'hindi' ? 'hi-IN' : 'en-US',
                        enableAutomaticPunctuation: false,
                        enableWordTimeOffsets: false,
                    },
                    audio: {
                        content: req.file.buffer.toString('base64'),
                    },
                };

                // Use the regular recognize endpoint
                apiUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;
                console.log('🎵 Using regular recognize endpoint with WebM_OPUS...');

            } catch (error) {
                console.log('⚠️ WebM setup failed, this should not happen');
                throw error;
            }

            console.log('📤 Sending request to Google Speech API...');
            console.log('Request config:', JSON.stringify(requestBody.config, null, 2));

            // Call Google Speech-to-Text REST API
            console.log('🌐 Making API call to Google Speech-to-Text...');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log('📥 API Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Google Speech API error response:', errorText);
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { error: { message: errorText } };
                }
                return res.status(400).json({
                    success: false,
                    message: 'Speech recognition failed. Please try again.',
                    error: errorData.error?.message || 'API request failed'
                });
            }

            const data = await response.json();
            console.log('📦 Google Speech API response:', JSON.stringify(data, null, 2));

            if (!data.results || data.results.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No speech detected. Please try speaking louder and clearer.',
                });
            }

            const transcript = data.results
                .map((result: any) => result.alternatives?.[0]?.transcript || '')
                .join(' ')
                .trim()
                .toLowerCase();

            const confidence = data.results[0]?.alternatives?.[0]?.confidence || 0;

            console.log('🎤 Recognized transcript:', `"${transcript}"`);
            console.log('📊 Confidence score:', confidence);

            let isCorrect = false;
            let accuracy: 'correct' | 'close' | 'wrong' = 'wrong';
            let message = 'Speech recognized successfully';

            // If expected text is provided, check accuracy
            if (expectedText) {
                const expected = expectedText.toLowerCase().trim();
                const similarity = calculateSimilarity(transcript, expected);
                isCorrect = similarity > 0.8; // 80% similarity threshold for correct

                console.log('🔍 Similarity Analysis:');
                console.log('Expected:', `"${expected}"`);
                console.log('Got:', `"${transcript}"`);
                console.log('Similarity score:', similarity.toFixed(3));
                console.log('Is correct:', isCorrect);

                // Determine accuracy level
                if (isCorrect) {
                    accuracy = 'correct';
                    message = 'Perfect pronunciation!';
                } else if (similarity > 0.5 || confidence > 0.6) {
                    accuracy = 'close';
                    message = 'Close! Keep trying!';
                } else {
                    accuracy = 'wrong';
                    message = `Not quite right. You said: "${transcript}"`;
                }
            } else {
                // No expected text provided, just base on confidence
                if (confidence > 0.8) {
                    accuracy = 'correct';
                } else if (confidence > 0.5) {
                    accuracy = 'close';
                } else {
                    accuracy = 'wrong';
                }
                console.log('📝 No expected text provided, using confidence-based scoring');
            }

            const speechResponse: SpeechRecognitionResponse = {
                success: true,
                transcript,
                confidence,
                isCorrect,
                accuracy,
                message
            };

            res.status(200).json(speechResponse);

        } catch (error: any) {
            console.error('Speech recognition error:', error);
            res.status(500).json({
                success: false,
                message: 'Speech recognition failed. Please try again.',
                error: error.message
            });
        }
    }
];

// Simple text similarity calculation (Levenshtein distance based)
function calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}
