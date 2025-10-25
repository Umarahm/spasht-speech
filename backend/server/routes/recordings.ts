import { RequestHandler } from "express";
import { db, storage } from "../firebase.js";
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { RecordingSession, SpeechAnalysisResult } from '../../shared/api.js';


// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
});

/**
 * Create a new recording session
 */
export const createRecordingSession: RequestHandler = async (req, res) => {
    try {
        const { userId, passageId } = req.body;

        if (!userId || !passageId) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'userId and passageId are required'
            });
        }

        const sessionId = uuidv4();
        const session: RecordingSession = {
            sessionId,
            userId,
            passageId,
            startedAt: new Date().toISOString(),
            status: 'recording'
        };

        // Store session in Firestore
        await db.collection('recording_sessions').doc(sessionId).set(session);

        res.status(201).json({
            success: true,
            session
        });
    } catch (error) {
        console.error('Error creating recording session:', error);
        res.status(500).json({
            error: 'Failed to create session',
            message: 'An error occurred while creating the recording session.'
        });
    }
};

/**
 * Upload audio recording and complete session
 */
export const uploadRecording = [
    upload.single('audio'),
    async (req: any, res: any) => {
        try {
            const { sessionId } = req.body;
            const audioFile = req.file;

            if (!sessionId) {
                return res.status(400).json({
                    error: 'Missing session ID',
                    message: 'sessionId is required'
                });
            }

            if (!audioFile) {
                return res.status(400).json({
                    error: 'No audio file provided',
                    message: 'Audio file is required'
                });
            }

            // Get session from Firestore
            const sessionRef = db.collection('recording_sessions').doc(sessionId);
            const sessionDoc = await sessionRef.get();

            if (!sessionDoc.exists) {
                return res.status(404).json({
                    error: 'Session not found',
                    message: 'Recording session not found'
                });
            }

            const session = sessionDoc.data() as RecordingSession;

            // Upload audio to Firebase Storage
            const fileName = `recordings/${session.userId}/${sessionId}.wav`;
            const file = storage.file(fileName);

            await file.save(audioFile.buffer, {
                metadata: {
                    contentType: 'audio/wav',
                    metadata: {
                        sessionId,
                        userId: session.userId,
                        uploadedAt: new Date().toISOString()
                    }
                }
            });

            // Get public URL
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
            });

            // Update session in Firestore
            await sessionRef.update({
                completedAt: new Date().toISOString(),
                audioUrl: url,
                duration: audioFile.size, // We'll calculate proper duration later
                status: 'completed'
            });

            const updatedSession = {
                ...session,
                completedAt: new Date().toISOString(),
                audioUrl: url,
                status: 'completed' as const
            };

            res.status(200).json({
                success: true,
                session: updatedSession
            });
        } catch (error) {
            console.error('Error uploading recording:', error);
            res.status(500).json({
                error: 'Failed to upload recording',
                message: 'An error occurred while uploading the audio recording.'
            });
        }
    }
];


/**
 * Get analysis results for a user with session data
 */
export const getUserAnalysis: RequestHandler = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('getUserAnalysis called with userId:', userId);

        if (!userId) {
            console.log('No userId provided');
            return res.status(400).json({
                error: 'Missing user ID',
                message: 'userId is required'
            });
        }

        // Get performance limits from environment variables
        const maxAnalysisFiles = parseInt(process.env.MAX_ANALYSIS_FILES || '10', 10);
        const maxAudioFiles = parseInt(process.env.MAX_AUDIO_FILES || '10', 10);

        // List all files in the user's recordings directory
        const [files] = await storage.getFiles({
            prefix: `recordings/${userId}/`,
        });

        console.log('Found', files.length, 'files for user:', userId);

        const analyses: SpeechAnalysisResult[] = [];
        const sessionIds: string[] = [];
        let analysisFilesProcessed = 0;

        // Process each file to find JSON analysis files (with limit)
        for (const file of files) {
            const fileName = file.name;
            console.log('Processing file:', fileName);

            // Check if this is an analysis JSON file and we haven't reached the limit
            if (fileName.endsWith('.json') && analysisFilesProcessed < maxAnalysisFiles) {
                try {
                    const [content] = await file.download();
                    const analysis = JSON.parse(content.toString()) as SpeechAnalysisResult;

                    console.log('Analysis file:', fileName, analysis);
                    analyses.push(analysis);
                    sessionIds.push(analysis.sessionId);
                    analysisFilesProcessed++;
                } catch (error) {
                    console.warn('Error parsing analysis file:', fileName, error);
                }
            }
        }

        console.log('Total analyses found (limited to', maxAnalysisFiles, '):', analyses.length);

        // Sort analyses by analyzedAt date (most recent first)
        analyses.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());

        // Get session data for audio URLs
        const sessionsData: { [sessionId: string]: any } = {};
        if (sessionIds.length > 0 && db) {
            try {
                const sessionsRef = db.collection('recording_sessions');
                const sessionsQuery = sessionsRef.where('sessionId', 'in', sessionIds.slice(0, 10)); // Firestore 'in' query limit
                const sessionsSnapshot = await sessionsQuery.get();

                sessionsSnapshot.forEach(doc => {
                    const session = doc.data();
                    sessionsData[session.sessionId] = session;
                });
            } catch (error) {
                console.warn('Could not fetch session data from Firestore:', error);
            }
        }

        // Combine analysis with session data and generate audio URLs
        const enrichedAnalyses = await Promise.all(analyses.map(async (analysis) => {
            let audioUrl = null;
            try {
                // Generate Firebase Storage URL for the audio file
                const fileName = `recordings/${analysis.userId}/${analysis.sessionId}.wav`;
                const file = storage.file(fileName);

                // Check if file exists and get signed URL
                const [exists] = await file.exists();
                if (exists) {
                    const [signedUrl] = await file.getSignedUrl({
                        action: 'read',
                        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
                    });
                    audioUrl = signedUrl;
                }
            } catch (error) {
                console.warn(`Could not generate audio URL for session ${analysis.sessionId}:`, error);
            }

            return {
                ...analysis,
                audioUrl,
                recordingDuration: sessionsData[analysis.sessionId]?.duration || null,
                sessionData: sessionsData[analysis.sessionId] || null
            };
        }));

        console.log('Returning', enrichedAnalyses.length, 'enriched analyses');

        res.status(200).json({
            success: true,
            analyses: enrichedAnalyses
        });
    } catch (error) {
        console.error('Error fetching user analysis:', error);
        res.status(500).json({
            error: 'Failed to fetch analysis',
            message: 'An error occurred while fetching user analysis results.'
        });
    }
};

/**
 * Debug endpoint to check Firebase data
 */
export const debugFirebase: RequestHandler = async (req, res) => {
    try {
        console.log('Debug: Checking Firebase data');

        // Get all analysis documents
        const analysisSnapshot = await db.collection('speech_analysis').get();
        console.log('Total analysis documents:', analysisSnapshot.size);

        const allAnalyses = [];
        analysisSnapshot.forEach(doc => {
            allAnalyses.push({
                id: doc.id,
                data: doc.data()
            });
        });

        // Get all session documents
        const sessionSnapshot = await db.collection('recording_sessions').get();
        console.log('Total session documents:', sessionSnapshot.size);

        const allSessions = [];
        sessionSnapshot.forEach(doc => {
            allSessions.push({
                id: doc.id,
                data: doc.data()
            });
        });

        res.json({
            analysisCount: analysisSnapshot.size,
            analyses: allAnalyses.slice(0, 5), // Show first 5
            sessionCount: sessionSnapshot.size,
            sessions: allSessions.slice(0, 5) // Show first 5
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ error: error.message });
    }
};
