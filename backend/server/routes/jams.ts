import { RequestHandler } from "express";
import { db, storage, firestoreAvailable } from "../firebase.js";
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { JamTopic, JamSessionRequest, JamSessionResponse, JamTopicRequest, JamTopicResponse, SpeechAnalysisResult } from '../../shared/api.js';

// Simple audio format validation
const validateAudioFormat = (buffer: Buffer): { isValid: boolean; format: string; needsConversion: boolean } => {
    const firstBytes = buffer.slice(0, 4).toString('hex');

    if (firstBytes === '52494646') { // RIFF (WAV)
        return { isValid: true, format: 'wav', needsConversion: false };
    } else if (firstBytes === '1a45dfa3') { // WebM
        return { isValid: false, format: 'webm', needsConversion: true };
    } else if (firstBytes.startsWith('66747970')) { // MP4 (ftyp)
        return { isValid: false, format: 'mp4', needsConversion: true };
    } else {
        return { isValid: false, format: 'unknown', needsConversion: true };
    }
};


// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
});

// JAM Topics Manager - handles loading and managing topics
class JamTopicsManager {
    private topics: JamTopic[] = [];
    private topicsLoaded: boolean = false;
    private loadingPromise: Promise<void> | null = null;

    constructor() {
        // Don't auto-load in constructor, load on demand
    }

    private async loadTopics(): Promise<void> {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.doLoadTopics();
        return this.loadingPromise;
    }

    private async doLoadTopics(): Promise<void> {
        try {
            // Get the current file's directory
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            // Try different path strategies for finding jamtopics.js
            // Strategy 1: Relative to current file (for dev: backend/server/routes -> frontend/client/data)
            // Strategy 2: Relative to dist/server/routes (for production: dist/server/routes -> frontend/client/data)
            // Strategy 3: From project root (assuming we're in dist/server/routes or backend/server/routes)
            const possiblePaths = [
                // From backend/server/routes -> frontend/client/data/jamtopics.js
                path.resolve(__dirname, '../../../frontend/client/data/jamtopics.js'),
                // From dist/server/routes -> frontend/client/data/jamtopics.js (if copied)
                path.resolve(__dirname, '../../../frontend/client/data/jamtopics.js'),
                // From dist/server/routes -> dist/server/data/jamtopics.js (if copied during build)
                path.resolve(__dirname, '../data/jamtopics.js'),
                // Absolute path from project root (if we can detect it)
                path.resolve(process.cwd(), 'frontend/client/data/jamtopics.js'),
                // From dist/server -> project root -> frontend/client/data
                path.resolve(__dirname, '../../../../frontend/client/data/jamtopics.js'),
            ];

            let jamTopics: JamTopic[] | null = null;
            let loadedPath: string | null = null;

            // Try importing from each possible path
            for (const topicsPath of possiblePaths) {
                try {
                    // Convert to file:// URL for dynamic import
                    const fileUrl = pathToFileURL(topicsPath).href;
                    const module = await import(fileUrl);
                    jamTopics = module.jamTopics || module.default;
                    loadedPath = topicsPath;
                    break;
                } catch (importError: any) {
                    // Continue to next path
                    console.log(`  ⚠️  Tried path ${topicsPath}: ${importError.message}`);
                }
            }

            if (!jamTopics) {
                // Try using fs.readFileSync as fallback (for cases where dynamic import doesn't work)
                try {
                    const fs = await import('fs');
                    const { createRequire } = await import('module');
                    const require = createRequire(import.meta.url);

                    for (const topicsPath of possiblePaths) {
                        try {
                            if (fs.existsSync(topicsPath)) {
                                // Try using require as fallback for CommonJS-style files
                                try {
                                    const module = require(topicsPath);
                                    jamTopics = module.jamTopics || module.default;
                                    if (jamTopics) {
                                        loadedPath = topicsPath;
                                        break;
                                    }
                                } catch (requireError) {
                                    // If require fails, try reading and parsing the file
                                    const content = fs.readFileSync(topicsPath, 'utf-8');
                                    // For ES module files, we need to extract the export
                                    const match = content.match(/export\s+(const|let|var)\s+jamTopics\s*=\s*(\[[\s\S]*?\]);/);
                                    if (match) {
                                        jamTopics = eval(match[2]);
                                        if (jamTopics) {
                                            loadedPath = topicsPath;
                                            break;
                                        }
                                    }
                                }
                            }
                        } catch (fsError) {
                            // Continue to next path
                        }
                    }
                } catch (fsImportError) {
                    // fs not available, continue without fallback
                    console.log('  ⚠️  File system fallback not available');
                }
            }

            if (!jamTopics) {
                throw new Error(`JAM topics could not be loaded from any of the paths:\n${possiblePaths.map(p => `  - ${p}`).join('\n')}`);
            }

            if (!Array.isArray(jamTopics) || jamTopics.length === 0) {
                throw new Error('JAM topics is empty or invalid');
            }

            this.topics = jamTopics;
            this.topicsLoaded = true;
            console.log(`✅ JAM topics loaded: ${this.topics.length} topics from ${loadedPath || 'unknown path'}`);

        } catch (error) {
            console.error('❌ Failed to load JAM topics:', (error as Error).message);
            console.error('Current directory:', process.cwd());
            console.error('Module URL:', import.meta.url);
            this.topics = [];
            this.topicsLoaded = false;
        }
    }

    public async ensureLoaded(): Promise<void> {
        if (!this.topicsLoaded) {
            await this.loadTopics();
        }
    }

    public async getTopics(difficulty?: string): Promise<JamTopic[]> {
        await this.ensureLoaded();

        if (difficulty) {
            const filtered = this.topics.filter(topic => topic.difficulty === difficulty);
            return filtered.length > 0 ? filtered : this.topics;
        }

        return this.topics;
    }

    public async getTopicById(topicId: string): Promise<JamTopic | null> {
        await this.ensureLoaded();
        return this.topics.find(topic => topic.id === topicId) || null;
    }

    public async getRandomTopic(difficulty?: string): Promise<JamTopic | null> {
        const availableTopics = await this.getTopics(difficulty);
        if (availableTopics.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableTopics.length);
        return availableTopics[randomIndex];
    }

    public isLoaded(): boolean {
        return this.topicsLoaded;
    }
}

// Initialize the topics manager
const topicsManager = new JamTopicsManager();

/**
 * Get a random JAM topic based on difficulty
 */
export const getJamTopic: RequestHandler = async (req, res) => {
    try {
        // Ensure topics are loaded
        await topicsManager.ensureLoaded();

        const { difficulty, topicId }: JamTopicRequest = req.query as any;

        let selectedTopic: JamTopic | null = null;

        // If specific topicId is requested
        if (topicId) {
            selectedTopic = await topicsManager.getTopicById(topicId);
            if (!selectedTopic) {
                return res.status(404).json({
                    error: 'Topic not found',
                    message: `JAM topic with ID '${topicId}' not found.`
                });
            }
        } else {
            // Get random topic based on difficulty
            selectedTopic = await topicsManager.getRandomTopic(difficulty);
            if (!selectedTopic) {
                return res.status(404).json({
                    error: 'No topics available',
                    message: `No JAM topics available for difficulty level: ${difficulty || 'any'}.`
                });
            }
        }

        // Generate session ID
        const sessionId = uuidv4();

        const response: JamTopicResponse = {
            topic: selectedTopic,
            sessionId
        };

        console.log(`🎯 JAM topic selected: ${selectedTopic.topic} (${selectedTopic.difficulty})`);
        res.status(200).json(response);

    } catch (error) {
        console.error('❌ Error in getJamTopic:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to retrieve JAM topic. Please try again.'
        });
    }
};

/**
 * Create a JAM recording session
 */
export const createJamSession: RequestHandler = async (req, res) => {
    try {
        const { topicId }: JamSessionRequest = req.body;
        const { userId } = req.body;

        // Validate required fields
        if (!topicId) {
            return res.status(400).json({
                error: 'Missing topic ID',
                message: 'topicId is required to create a JAM session'
            });
        }

        if (!userId) {
            return res.status(400).json({
                error: 'Missing user ID',
                message: 'userId is required to create a JAM session'
            });
        }

        // Verify topic exists
        const topic = await topicsManager.getTopicById(topicId);
        if (!topic) {
            return res.status(404).json({
                error: 'Topic not found',
                message: `JAM topic with ID '${topicId}' does not exist`
            });
        }

        // Generate session ID
        const sessionId = `jam_${uuidv4()}`;

        const jamSession: JamSessionResponse = {
            sessionId,
            topic,
            userId,
            startedAt: new Date().toISOString(),
            status: 'ready'
        };

        // Store session in Firestore (optional - continue if Firestore fails)
        if (firestoreAvailable && db) {
            try {
                await db.collection('jam_sessions').doc(sessionId).set(jamSession);
            } catch (firestoreError) {
                console.warn('⚠️ Firestore operation failed for JAM session storage, continuing without persistence');
                // Continue without storing in Firestore - session will still work for recording
            }
        }

        console.log(`🎵 JAM session created: ${sessionId}`);
        res.status(201).json({
            success: true,
            session: jamSession
        });

    } catch (error) {
        console.error('❌ Error creating JAM session:', error);
        console.error('Error details:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
            name: (error as Error).name
        });
        res.status(500).json({
            error: 'Failed to create session',
            message: `JAM session creation failed: ${(error as Error).message}`,
            details: error instanceof Error ? error.name : 'Unknown error type'
        });
    }
};

/**
 * Upload JAM recording and complete session
 */
export const uploadJamRecording: RequestHandler[] = [
    upload.single('audio'),
    async (req: any, res: any) => {
        try {
            const { sessionId, userId } = req.body;
            const audioFile = req.file;

            // Validate required fields
            if (!sessionId) {
                return res.status(400).json({
                    error: 'Missing session ID',
                    message: 'sessionId is required to upload recording'
                });
            }

            if (!userId) {
                return res.status(400).json({
                    error: 'Missing user ID',
                    message: 'userId is required to upload recording'
                });
            }

            if (!audioFile) {
                return res.status(400).json({
                    error: 'No audio file provided',
                    message: 'Audio file is required for JAM recording upload'
                });
            }

            // Validate Firebase Storage is available
            if (!storage) {
                console.error('❌ Firebase Storage is not initialized');
                return res.status(500).json({
                    error: 'Storage not available',
                    message: 'Firebase Storage is not properly configured. Please check your environment variables.'
                });
            }

            // Try to verify session exists
            let session: JamSessionResponse | null = null;
            if (firestoreAvailable && db) {
                try {
                    const sessionRef = db.collection('jam_sessions').doc(sessionId);
                    const sessionDoc = await sessionRef.get();

                    if (sessionDoc.exists) {
                        session = sessionDoc.data() as JamSessionResponse;
                    }
                } catch (firestoreError) {
                    console.warn('⚠️ Firestore operation failed for JAM session retrieval, using temporary session');
                }
            }

            // Create a temporary session object if Firestore failed or session not found
            if (!session) {
                session = {
                    sessionId,
                    topic: { id: 'unknown', topic: 'Unknown Topic', description: '', difficulty: 'beginner', hints: [], estimatedWords: 0, timeLimit: 60 },
                    userId,
                    startedAt: new Date().toISOString(),
                    status: 'ready'
                };
            }

            // Verify user owns the session
            if (session.userId !== userId) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You can only upload recordings to your own JAM sessions'
                });
            }

            // Upload audio to Firebase Storage
            const fileName = `recordings/${userId}/${sessionId}.wav`;
            const file = storage.file(fileName);

            await file.save(audioFile.buffer, {
                metadata: {
                    contentType: audioFile.originalname?.toLowerCase().endsWith('.wav') ? 'audio/wav' : (audioFile.mimetype || 'audio/wav'),
                    metadata: {
                        sessionId,
                        userId,
                        sessionType: 'jam',
                        topicId: session.topic.id,
                        uploadedAt: new Date().toISOString(),
                        fileSize: audioFile.size
                    }
                }
            });

            // Get signed URL for audio access
            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
            });

            const audioUrl = signedUrl;

            // Try to update session in Firestore
            const updateData = {
                status: 'completed' as const,
                audioUrl,
                uploadedAt: new Date().toISOString(),
                fileSize: audioFile.size
            };

            if (firestoreAvailable && db) {
                try {
                    const sessionRef = db.collection('jam_sessions').doc(sessionId);
                    await sessionRef.update(updateData);
                } catch (updateError) {
                    console.warn('⚠️ Firestore operation failed for JAM session update, continuing without persistence');
                    // Continue without updating Firestore
                }
            }

            const updatedSession = {
                ...session,
                ...updateData
            };

            console.log(`📤 JAM recording uploaded: ${sessionId}`);
            res.status(200).json({
                success: true,
                session: updatedSession
            });

        } catch (error) {
            console.error('❌ Error uploading JAM recording:', error);
            console.error('Error details:', {
                message: (error as Error).message,
                stack: (error as Error).stack,
                name: (error as Error).name
            });
            res.status(500).json({
                error: 'Failed to upload recording',
                message: (error as Error).message || 'An error occurred while uploading the JAM audio recording. Please try again.'
            });
        }
    }
];


/**
 * Get all available JAM topics
 */
export const getJamTopics: RequestHandler = async (req, res) => {
    try {
        // Ensure topics are loaded
        await topicsManager.ensureLoaded();

        const topics = await topicsManager.getTopics();

        res.status(200).json({
            success: true,
            topics
        });

    } catch (error) {
        console.error('❌ Error fetching JAM topics:', error);
        res.status(500).json({
            error: 'Failed to fetch topics',
            message: 'An error occurred while fetching JAM topics.'
        });
    }
};

/**
 * Get JAM analysis results for a user (placeholder)
 */
export const getJamUserAnalysis: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                error: 'Missing user ID',
                message: 'userId is required'
            });
        }

        // Try to fetch from Firebase (optional)
        if (firestoreAvailable && db) {
            try {
                const analysisRef = db.collection('jam_sessions')
                    .where('userId', '==', userId)
                    .orderBy('startedAt', 'desc');

                const analysisSnapshot = await analysisRef.get();
                const analyses = [];

                analysisSnapshot.forEach(doc => {
                    analyses.push(doc.data());
                });

                res.status(200).json({
                    success: true,
                    analyses
                });
            } catch (firestoreError) {
                console.warn('⚠️ Firestore operation failed for JAM user analysis, returning empty results');
                res.status(200).json({
                    success: true,
                    analyses: []
                });
            }
        } else {
            res.status(200).json({
                success: true,
                analyses: []
            });
        }

    } catch (error) {
        console.error('❌ Error fetching JAM user analysis:', error);
        res.status(500).json({
            error: 'Failed to fetch analysis',
            message: 'An error occurred while fetching JAM user analysis results.'
        });
    }
};