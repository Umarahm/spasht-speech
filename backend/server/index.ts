import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createHttpServer } from "http";
import multer from "multer";

// Load environment variables FIRST
// Load from backend directory (go up one level from server directory)
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');

dotenv.config({ path: envPath });
console.log('🔍 Environment check - GEMINI_RECOMMENDATION_API_KEY:', process.env.GEMINI_RECOMMENDATION_API_KEY ? 'SET' : 'NOT SET');
console.log('📁 Loading .env from:', envPath);

// Initialize Firebase (import after dotenv.config)
import { db, storage, firestoreAvailable } from "./firebase.js";

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

import { handleGeneratePassage } from "./routes/passages.js";
import { handleSpeechRecognition } from "./routes/speech.js";
// Progress route doesn't use Firebase
import { handleProgressAnalytics } from "./routes/progress.js";
// JAM routes
import {
  getJamTopic,
  createJamSession,
  uploadJamRecording,
  getJamUserAnalysis,
  getJamTopics
} from "./routes/jams.js";
// Speech Analysis API
import { SpeechAnalysisResponse, AnalysisSegment, AnalysisSummary } from '../shared/api.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Mock recording functions (Firebase disabled for now)
const createRecordingSession = async (req: any, res: any) => {
  try {
    console.log('📝 Creating recording session:', {
      userId: req.body.userId,
      passageId: req.body.passageId,
      timestamp: new Date().toISOString()
    });

    const session = {
      sessionId: `session_${Date.now()}`,
      userId: req.body.userId,
      passageId: req.body.passageId,
      status: 'created',
      createdAt: new Date().toISOString()
    };

    console.log('✅ Session created successfully:', session);
    res.json({ session });
  } catch (error) {
    console.error('❌ Error creating recording session:', error);
    res.status(500).json({
      error: 'Failed to create session',
      message: 'Internal server error while creating recording session'
    });
  }
};

const uploadRecording = [
  upload.single('audio'),
  async (req: any, res: any) => {
    try {
      const { sessionId, userId } = req.body;
      const audioFile = req.file;

      if (!sessionId || !userId) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'sessionId and userId are required'
        });
      }

      if (!audioFile) {
        return res.status(400).json({
          error: 'No audio file provided',
          message: 'Audio file is required'
        });
      }

      console.log('📤 Uploading audio to Firebase Storage:', {
        userId,
        sessionId,
        fileName: audioFile.originalname,
        size: audioFile.size,
        mimeType: audioFile.mimetype
      });

      // Upload audio to Firebase Storage in user-specific folder
      const fileName = `recordings/${userId}/${sessionId}.wav`;
      const file = storage.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: audioFile.originalname?.toLowerCase().endsWith('.wav') ? 'audio/wav' : (audioFile.mimetype || 'audio/wav'),
          metadata: {
            userId,
            sessionId,
            uploadedAt: new Date().toISOString(),
            originalName: audioFile.originalname,
            size: audioFile.size.toString()
          }
        }
      });

      stream.on('error', (error) => {
        console.error('❌ Firebase upload stream error:', error);
        return res.status(500).json({
          error: 'Upload failed',
          message: 'Failed to upload audio to storage.'
        });
      });

      stream.on('finish', async () => {
        try {
          // Get the public URL
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
          });

          console.log('✅ Audio uploaded successfully to Firebase:', url);

          res.json({
            success: true,
            session: {
              sessionId: sessionId,
              status: 'completed',
              audioUrl: url,
              completedAt: new Date().toISOString()
            }
          });
        } catch (error) {
          console.error('❌ Error getting signed URL:', error);
          res.status(500).json({
            error: 'Upload verification failed',
            message: 'Audio uploaded but failed to get access URL.'
          });
        }
      });

      // Write the buffer to the stream
      stream.end(audioFile.buffer);

    } catch (error) {
      console.error('❌ Error uploading recording:', error);
      res.status(500).json({
        error: 'Failed to upload recording',
        message: 'An error occurred while uploading the audio recording.'
      });
    }
  }
];


/**
 * Get a single analysis by sessionId
 */
const getSingleAnalysis = async (req: any, res: any) => {
  try {
    const { userId, sessionId } = req.params;
    console.log('getSingleAnalysis called for userId:', userId, 'sessionId:', sessionId);

    if (!userId || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and sessionId are required'
      });
    }

    // Load specific analysis from Firebase Storage
    const analysisFileName = `recordings/${userId}/${sessionId}.json`;
    const analysisFile = storage.file(analysisFileName);

    let analysis: any;
    try {
      const [exists] = await analysisFile.exists();
      if (!exists) {
        return res.status(404).json({
          error: 'Analysis not found',
          message: 'Analysis results not found for this session.'
        });
      }

      const [content] = await analysisFile.download();
      analysis = JSON.parse(content.toString());
      console.log('✅ Analysis loaded from Firebase Storage');
    } catch (error) {
      console.error('❌ Failed to load analysis:', error);
      return res.status(404).json({
        error: 'Analysis not found',
        message: 'Analysis results not found for this session.'
      });
    }

    // Generate Firebase Storage URL for the audio file
    let audioUrl = null;
    try {
      const audioFileName = `recordings/${userId}/${sessionId}.wav`;
      const audioFile = storage.file(audioFileName);

      const [exists] = await audioFile.exists();
      if (exists) {
        const [signedUrl] = await audioFile.getSignedUrl({
          action: 'read',
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
        });
        audioUrl = signedUrl;
      }
    } catch (error) {
      console.warn(`Could not generate audio URL for session ${sessionId}:`, error);
    }

    // Get session data if available
    let sessionData = null;
    if (db && firestoreAvailable) {
      try {
        const sessionRef = db.collection('recording_sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();
        if (sessionDoc.exists) {
          sessionData = sessionDoc.data();
        }
      } catch (sessionError) {
        console.warn('Could not fetch session data:', sessionError);
      }
    }

    const enrichedAnalysis = {
      ...analysis,
      audioUrl,
      recordingDuration: sessionData?.duration || null,
      sessionData: sessionData || null
    };

    res.status(200).json({
      success: true,
      analysis: enrichedAnalysis
    });
  } catch (error) {
    console.error('Error fetching single analysis:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis',
      message: 'An error occurred while fetching the analysis result.'
    });
  }
};

/**
 * Get all audio files for pagination (without analysis data)
 */
const getAllAudioFiles = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    console.log('getAllAudioFiles called for userId:', userId);

    if (!userId) {
      return res.status(400).json({
        error: 'Missing user ID',
        message: 'userId is required'
      });
    }

    // Get all audio files from Firebase Storage
    const [files] = await storage.getFiles({
      prefix: `recordings/${userId}/`,
    });

    // Filter to only audio files (.wav)
    const audioFiles = files.filter(file => file.name.endsWith('.wav'));

    console.log(`Found ${audioFiles.length} audio files for user ${userId}`);

    // Process audio files to get basic info
    const allRecordings = await Promise.all(audioFiles.map(async (file) => {
      try {
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
        });

        // Extract sessionId from filename (remove .wav extension)
        const fileName = file.name.split('/').pop() || '';
        const sessionId = fileName.replace('.wav', '');

        // Get metadata
        const [metadata] = await file.getMetadata();
        const uploadedAt = metadata.timeCreated || metadata.updated;

        return {
          sessionId,
          fileName,
          audioUrl: signedUrl,
          uploadedAt,
          size: metadata.size
        };
      } catch (error) {
        console.warn(`Could not process file ${file.name}:`, error);
        return null;
      }
    })).then(results => results.filter(Boolean));

    // Sort by upload date (most recent first)
    allRecordings.sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      audioFiles: allRecordings,
      total: allRecordings.length
    });
  } catch (error) {
    console.error('Error fetching audio files:', error);
    res.status(500).json({
      error: 'Failed to fetch audio files',
      message: 'An error occurred while fetching audio files.'
    });
  }
};

const getUserAnalysis = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    console.log('getUserAnalysis called for userId:', userId);

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

    // List all files in the user's recordings directory from Firebase Storage
    const [files] = await storage.getFiles({
      prefix: `recordings/${userId}/`,
    });

    console.log('Found', files.length, 'files for user:', userId);

    const analyses: any[] = [];
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
          const analysis = JSON.parse(content.toString());

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

    // Get session data for audio URLs (if Firestore is available)
    const sessionsData: { [sessionId: string]: any } = {};
    if (sessionIds.length > 0 && db && firestoreAvailable) {
      try {
        const sessionsRef = db.collection('recording_sessions');
        const sessionsQuery = sessionsRef.where('sessionId', 'in', sessionIds.slice(0, 10)); // Firestore 'in' query limit
        const sessionsSnapshot = await sessionsQuery.get();

        sessionsSnapshot.forEach(doc => {
          const session = doc.data();
          sessionsData[session.sessionId] = session;
        });
      } catch (sessionError) {
        console.error('Error querying recording_sessions collection:', sessionError);
        // Continue without session data
      }
    }

    // Get all files from user's recordings folder (limited to audio files)
    let allRecordings = [];
    try {
      const [files] = await storage.getFiles({
        prefix: `recordings/${userId}/`
      });
      console.log(`Found ${files.length} files in recordings/${userId}/`);

      // Filter to only audio files (.wav) and limit the number
      const audioFiles = files
        .filter(file => file.name.endsWith('.wav'))
        .slice(0, maxAudioFiles); // Limit audio files

      console.log(`Processing ${audioFiles.length} audio files (limited to ${maxAudioFiles})`);

      allRecordings = await Promise.all(audioFiles.map(async (file) => {
        try {
          const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
          });

          // Extract sessionId from filename (remove .wav extension)
          const fileName = file.name.split('/').pop() || '';
          const sessionId = fileName.replace('.wav', '');

          // Get metadata
          const [metadata] = await file.getMetadata();
          const uploadedAt = metadata.timeCreated || metadata.updated;

          return {
            sessionId,
            fileName,
            audioUrl: signedUrl,
            uploadedAt,
            size: metadata.size,
            hasAnalysis: analyses.some(a => a.sessionId === sessionId)
          };
        } catch (error) {
          console.warn(`Could not process file ${file.name}:`, error);
          return null;
        }
      })).then(results => results.filter(Boolean));
    } catch (error) {
      console.warn('Could not fetch recordings from storage:', error);
      // allRecordings remains empty array
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

    res.status(200).json({
      success: true,
      analyses: enrichedAnalyses,
      allRecordings: allRecordings,
      summary: {
        totalAnalyses: enrichedAnalyses.length,
        totalRecordings: allRecordings.length,
        analyzedRecordings: allRecordings.filter(r => r.hasAnalysis).length
      }
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
 * Check if recommendations exist for a session
 */
const checkRecommendations = async (req: any, res: any) => {
  try {
    const { sessionId, userId } = req.params;

    if (!sessionId || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'sessionId and userId are required'
      });
    }

    const recommendationFileName = `recordings/${userId}/${sessionId}.md`;
    const recommendationFile = storage.file(recommendationFileName);

    const [exists] = await recommendationFile.exists();

    if (exists) {
      const [recommendationUrl] = await recommendationFile.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      });

      res.json({
        exists: true,
        recommendationUrl
      });
    } else {
      res.json({
        exists: false
      });
    }
  } catch (error: any) {
    console.error('❌ Error checking recommendations:', error);
    res.status(500).json({
      error: 'Failed to check recommendations',
      message: error.message || 'An error occurred while checking recommendations.'
    });
  }
};

/**
 * Fetch existing recommendations for a session
 */
const fetchRecommendations = async (req: any, res: any) => {
  try {
    const { sessionId, userId } = req.params;

    if (!sessionId || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'sessionId and userId are required'
      });
    }

    const recommendationFileName = `recordings/${userId}/${sessionId}.md`;
    const recommendationFile = storage.file(recommendationFileName);

    const [exists] = await recommendationFile.exists();

    if (!exists) {
      return res.status(404).json({
        error: 'Recommendations not found',
        message: 'No recommendations found for this session.'
      });
    }

    const [content] = await recommendationFile.download();
    const recommendations = content.toString();

    const [recommendationUrl] = await recommendationFile.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    res.json({
      success: true,
      recommendations,
      recommendationUrl
    });
  } catch (error: any) {
    console.error('❌ Error fetching recommendations:', error);
    res.status(500).json({
      error: 'Failed to fetch recommendations',
      message: error.message || 'An error occurred while fetching recommendations.'
    });
  }
};

/**
 * Get recommendations for a session
 */
const getRecommendations = async (req: any, res: any) => {
  try {
    const { sessionId, userId, userEmail } = req.body;

    if (!sessionId || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'sessionId and userId are required'
      });
    }

    console.log('🎯 Generating personalized recommendations for session:', sessionId, 'user:', userId);

    // Rate limiting: Check if user is tester (unlimited) or regular user (max 3)
    const TESTER_EMAIL = 'umarahmed1730300@gmail.com';
    const MAX_RECOMMENDATIONS = 3;

    if (userEmail !== TESTER_EMAIL && db && firestoreAvailable) {
      try {
        const usageRef = db.collection('recommendation_usage').doc(userId);
        const usageDoc = await usageRef.get();

        let usageCount = 0;
        if (usageDoc.exists) {
          const usageData = usageDoc.data();
          usageCount = usageData?.count || 0;
        }

        if (usageCount >= MAX_RECOMMENDATIONS) {
          return res.status(429).json({
            error: 'Rate limit exceeded',
            message: `You have reached the maximum limit of ${MAX_RECOMMENDATIONS} personalized recommendations. Please upgrade for unlimited access.`,
            remaining: 0
          });
        }
      } catch (rateLimitError) {
        console.warn('⚠️ Could not check rate limit, allowing request:', rateLimitError);
      }
    }

    // Load analysis from Firebase Storage
    const analysisFileName = `recordings/${userId}/${sessionId}.json`;
    const analysisFile = storage.file(analysisFileName);

    let analysis: any;
    try {
      const [content] = await analysisFile.download();
      analysis = JSON.parse(content.toString());
      console.log('✅ Analysis loaded from Firebase Storage');
    } catch (error) {
      console.error('❌ Failed to load analysis:', error);
      return res.status(404).json({
        error: 'Analysis not found',
        message: 'Analysis results not found. Please analyze the recording first.'
      });
    }

    // Generate recommendations using Gemini API
    let recommendationsMarkdown: string;
    try {
      recommendationsMarkdown = await generateRecommendations(analysis, sessionId);
    } catch (error: any) {
      console.error('❌ Error in generateRecommendations:', error);
      return res.status(500).json({
        error: 'Failed to generate recommendations',
        message: error.message || 'Could not generate recommendations. Please try again later.'
      });
    }

    if (!recommendationsMarkdown || recommendationsMarkdown.trim().length === 0) {
      return res.status(500).json({
        error: 'Failed to generate recommendations',
        message: 'Recommendations API returned empty response. Please try again later.'
      });
    }

    // Save recommendations to Firebase Storage as markdown file
    const recommendationFileName = `recordings/${userId}/${sessionId}.md`;
    const recommendationFile = storage.file(recommendationFileName);

    await recommendationFile.save(recommendationsMarkdown, {
      metadata: {
        contentType: 'text/markdown',
        metadata: {
          userId,
          sessionId,
          analyzedAt: analysis.analyzedAt || new Date().toISOString(),
          type: 'recommendations'
        }
      }
    });

    console.log('✅ Recommendations saved to Firebase Storage:', recommendationFileName);

    // Update usage count (only for non-testers)
    if (userEmail !== TESTER_EMAIL && db && firestoreAvailable) {
      try {
        const usageRef = db.collection('recommendation_usage').doc(userId);
        const usageDoc = await usageRef.get();

        if (usageDoc.exists) {
          await usageRef.update({
            count: (usageDoc.data()?.count || 0) + 1,
            lastUsed: new Date().toISOString()
          });
        } else {
          await usageRef.set({
            userId,
            count: 1,
            lastUsed: new Date().toISOString(),
            createdAt: new Date().toISOString()
          });
        }
      } catch (usageError) {
        console.warn('⚠️ Could not update usage count:', usageError);
      }
    }

    // Get the recommendation file URL
    const [recommendationUrl] = await recommendationFile.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Get remaining count
    let remaining = MAX_RECOMMENDATIONS;
    if (userEmail !== TESTER_EMAIL && db && firestoreAvailable) {
      try {
        const usageRef = db.collection('recommendation_usage').doc(userId);
        const usageDoc = await usageRef.get();
        if (usageDoc.exists) {
          const currentCount = usageDoc.data()?.count || 0;
          remaining = Math.max(0, MAX_RECOMMENDATIONS - currentCount);
        }
      } catch (error) {
        // Ignore error
      }
    } else if (userEmail === TESTER_EMAIL) {
      remaining = -1; // Unlimited
    }

    res.json({
      success: true,
      recommendationUrl,
      recommendations: recommendationsMarkdown,
      remaining
    });

  } catch (error: any) {
    console.error('❌ Error getting recommendations:', error);
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: error.message || 'An error occurred while generating recommendations.'
    });
  }
};

/**
 * Generate personalized recommendations using Gemini API
 */
const generateRecommendations = async (analysis: any, sessionId: string): Promise<string> => {
  try {
    // Use the same API key as passages (GEMINI_API_KEY) for testing
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_RECOMMENDATION_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not configured, skipping recommendations');
      throw new Error('GEMINI_API_KEY not configured');
    }

    console.log('🤖 Generating recommendations with Gemini API...');
    console.log('🔑 API Key configured:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');

    // Initialize Gemini - use the same model as passages (gemini-2.5-flash-lite)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    console.log('✅ Gemini model initialized');

    // Prepare analytics data for the prompt
    const analyticsData = {
      summary: analysis.summary,
      segments: analysis.segments?.slice(0, 10), // Limit segments for prompt size
      sessionId: analysis.sessionId,
      analyzedAt: analysis.analyzedAt
    };

    const prompt = `You are a speech therapy expert. Based on the following speech analysis analytics, provide personalized recommendations for the user.

Analytics Data:
${JSON.stringify(analyticsData, null, 2)}

Please provide:
1. **Exercises**: Specific exercises to help improve speech patterns based on the analysis
2. **Recommendations**: Practical recommendations for daily practice
3. **Real-life Examples**: Examples of how to apply these exercises in real situations
4. **How to Deal**: Strategies for dealing with identified speech patterns
5. **Conclusion**: End your response with "SPASHT 2025"

Format your response in markdown format with clear sections and headings.`;

    console.log('📤 Sending prompt to Gemini API...');
    console.log('📝 Prompt length:', prompt.length, 'characters');

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;

      console.log('📥 Received response from Gemini API');
      console.log('📊 Response structure:', {
        hasText: typeof response.text === 'function',
        hasCandidates: !!response.candidates,
        candidatesLength: response.candidates?.length || 0
      });

      // Handle different response formats
      let recommendations: string;
      if (typeof response.text === 'function') {
        recommendations = response.text();
        console.log('✅ Using response.text() method');
      } else if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        recommendations = candidate.content?.parts?.[0]?.text || '';
        console.log('✅ Using candidates[0].content.parts[0].text');
      } else {
        console.warn('⚠️ Unexpected response format:', JSON.stringify(response).substring(0, 200));
        recommendations = JSON.stringify(response);
      }

      if (!recommendations || recommendations.trim().length === 0) {
        console.error('❌ Empty recommendations received');
        console.error('Full response:', JSON.stringify(response, null, 2));
        throw new Error('Gemini API returned empty response. Please check API key and model availability.');
      }

      console.log('✅ Recommendations generated successfully');
      console.log('📏 Recommendations length:', recommendations.length, 'characters');
      console.log('📄 First 200 chars:', recommendations.substring(0, 200));
      return recommendations;
    } catch (apiError: any) {
      console.error('❌ Gemini API call failed:', apiError);
      console.error('API Error details:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        statusCode: apiError.statusCode,
        stack: apiError.stack?.substring(0, 500)
      });
      throw new Error(`Gemini API error: ${apiError.message || 'Unknown error'}`);
    }

  } catch (error: any) {
    console.error('❌ Error generating recommendations:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      status: error.status,
      stack: error.stack
    });
    // Throw error instead of returning empty string so we can see what went wrong
    throw new Error(`Failed to generate recommendations: ${error.message || 'Unknown error'}`);
  }
};

// New Speech Analysis API endpoint
const analyzeSpeechRecording = async (req: any, res: any) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'sessionId and userId are required'
      });
    }

    console.log('🎯 Starting new speech analysis for session:', sessionId, 'user:', userId);

    // Fetch audio file from Firebase Storage (user-specific folder)
    const fileName = `recordings/${userId}/${sessionId}.wav`;
    const file = storage.file(fileName);

    let audioBuffer: Buffer;
    try {
      console.log('📥 Fetching audio from Firebase Storage:', fileName);
      const [audioData] = await file.download();
      audioBuffer = audioData;
      console.log('✅ Audio fetched from Firebase, size:', audioBuffer.length, 'bytes');
    } catch (error) {
      console.error('❌ Failed to fetch audio from Firebase:', error);
      return res.status(404).json({
        error: 'Audio not found',
        message: 'Recording not found in storage. Please upload the recording first.'
      });
    }

    // Prefer request-provided Colab/Ngrok URL, fallback to environment
    const requestColabUrl = req.body?.colabUrl?.toString()?.trim();
    const ngrokUrl = requestColabUrl || process.env.NGROK_URL;
    if (!ngrokUrl) {
      console.error('❌ NGROK_URL not configured');
      return res.status(500).json({
        error: 'Analysis service not configured',
        message: 'NGROK_URL environment variable is missing'
      });
    }

    console.log('🔗 Calling external analysis service:', ngrokUrl);

    // Create FormData for the external API
    const formData = new FormData();
    formData.append('audio', new Blob([new Uint8Array(audioBuffer)]), `${sessionId}.wav`);

    console.log('📤 Sending audio to analysis service...');

    // Call external analysis API
    const response = await fetch(`${ngrokUrl}/predict`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.error('❌ External analysis service error:', response.status, response.statusText);
      return res.status(response.status).json({
        error: 'Analysis service error',
        message: `External analysis service returned ${response.status}: ${response.statusText}`
      });
    }

    const analysisResult: SpeechAnalysisResponse = await response.json();
    console.log('✅ External analysis response received');
    console.log('📦 Segments count:', analysisResult.segments?.length || 0);
    console.log('📊 Summary:', analysisResult.summary);

    // Get the audio file URL
    let audioUrl = null;
    try {
      const audioFileName = `recordings/${userId}/${sessionId}.wav`;
      const audioFile = storage.file(audioFileName);

      const [signedUrl] = await audioFile.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      });
      audioUrl = signedUrl;
      console.log('✅ Audio URL generated:', audioUrl);
    } catch (audioError) {
      console.warn('⚠️ Could not generate audio URL:', audioError);
    }

    // Create analysis result
    const analysis = {
      sessionId,
      userId,
      segments: analysisResult.segments,
      summary: analysisResult.summary,
      rawResponse: analysisResult,
      audioUrl,
      analyzedAt: new Date().toISOString()
    };

    // Save analysis results to Firebase Storage as JSON
    try {
      const analysisFileName = `recordings/${userId}/${sessionId}.json`;
      const analysisFile = storage.file(analysisFileName);

      const analysisJson = JSON.stringify(analysis, null, 2);
      await analysisFile.save(analysisJson, {
        metadata: {
          contentType: 'application/json',
          metadata: {
            userId,
            sessionId,
            analyzedAt: analysis.analyzedAt,
            analysisType: 'speech-analysis-external'
          }
        }
      });

      console.log('✅ Analysis results saved to Firebase Storage:', analysisFileName);

      // Add the analysis file URL to the response
      const [analysisUrl] = await analysisFile.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      });

      (analysis as any).analysisUrl = analysisUrl;

    } catch (storageError) {
      console.error('⚠️ Failed to save analysis to Firebase Storage:', storageError);
      // Don't fail the request if storage fails, just log it
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('❌ Error analyzing speech recording:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Failed to analyze recording',
      message: error.message || 'An error occurred while analyzing the audio recording.',
      details: error.code || 'Unknown error'
    });
  }
};

// Debug endpoint to check Firebase data
const debugFirebase = async (req: any, res: any) => {
  try {
    console.log('Testing Firebase connection...');

    // Test Firestore availability
    if (!firestoreAvailable) {
      console.log('Firestore is not available');
      res.json({
        firebaseConnected: false,
        firestoreAvailable: false,
        message: 'Firestore is not configured or available'
      });
      return;
    }

    // Test basic Firestore connection by trying to list collections
    let collections = [];
    try {
      const snapshot = await db!.listCollections();
      collections = snapshot.map(col => col.id);
      console.log('Available collections:', collections);
    } catch (listError) {
      console.error('Error listing collections:', listError);
    }

    // Test basic Firestore connection
    try {
      const testDoc = await db!.collection('test').doc('connection_test').get();
      console.log('Firestore basic connection test passed');
    } catch (testError) {
      console.error('Firestore basic connection test failed:', testError);
    }

    // Get all analysis documents
    let analysisSnapshot;
    try {
      analysisSnapshot = await db!.collection('speech_analysis').get();
      console.log('speech_analysis collection query successful');
    } catch (analysisError) {
      console.error('speech_analysis collection error:', analysisError);
      analysisSnapshot = { size: 0, empty: true, forEach: () => { } };
    }

    // Get all session documents
    let sessionSnapshot;
    try {
      sessionSnapshot = await db!.collection('recording_sessions').get();
      console.log('recording_sessions collection query successful');
    } catch (sessionError) {
      console.error('recording_sessions collection error:', sessionError);
      sessionSnapshot = { size: 0, empty: true, forEach: () => { } };
    }

    const allAnalyses = [];
    if (analysisSnapshot && !analysisSnapshot.empty) {
      analysisSnapshot.forEach(doc => {
        allAnalyses.push({
          id: doc.id,
          data: doc.data()
        });
      });
    }

    const allSessions = [];
    if (sessionSnapshot && !sessionSnapshot.empty) {
      sessionSnapshot.forEach(doc => {
        allSessions.push({
          id: doc.id,
          data: doc.data()
        });
      });
    }

    res.json({
      firebaseConnected: true,
      analysisCount: allAnalyses.length,
      analyses: allAnalyses.slice(0, 5), // Show first 5
      sessionCount: allSessions.length,
      sessions: allSessions.slice(0, 5) // Show first 5
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      firebaseConnected: false,
      error: error.message
    });
  }
};

const app = express();
const server = createHttpServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3001",
  "https://spasht-speech.vercel.app",
  "https://spasht.netlify.app",
  "https://*.netlify.app"
];

console.log('🔧 Setting up CORS for origins:', allowedOrigins);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any Netlify subdomain
    if (origin.includes("netlify.app") || origin.includes("netlify.com")) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend info page - shown when backend is accessed directly
app.get("/", (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SPASHT Speech - Backend</title>
    </head>
    <body>
        <h1>You're Lost</h1>
        <p>This is backend for spasht speech</p>
        <p>Pls visit <a href="https://spasht.netlify.app">spasht.netlify.app</a> or <a href="https://spasht-speech.vercel.app">spasht-speech.vercel.app</a></p>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Speech App Backend is running",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get("/api/user/profile", (req, res) => {
  // This would typically require authentication middleware
  res.json({
    message: "User profile endpoint - authentication required",
    authenticated: false
  });
});

// Passage generation endpoint
app.post("/api/generate-passage", handleGeneratePassage);

// Speech recognition endpoint
app.post("/api/speech-recognition", handleSpeechRecognition);

// Progress analytics endpoint
app.get("/api/progress", handleProgressAnalytics);

// Recording session endpoints
app.post("/api/recording-sessions", createRecordingSession);
app.post("/api/recordings/upload", uploadRecording);
app.post("/api/recordings/analyze-new", analyzeSpeechRecording);
app.post("/api/recordings/get-recommendations", getRecommendations);
app.get("/api/users/:userId/analysis", getUserAnalysis);
app.get("/api/users/:userId/analysis/:sessionId", getSingleAnalysis);
app.get("/api/users/:userId/audio-files", getAllAudioFiles);
app.get("/api/users/:userId/recommendations/:sessionId", fetchRecommendations);
app.get("/api/users/:userId/recommendations/:sessionId/check", checkRecommendations);
app.get("/api/debug/firebase", debugFirebase);

// JAM (JustAMinute) endpoints
app.get("/api/jam/topics", getJamTopics);
app.get("/api/jam/topic", getJamTopic);
app.post("/api/jam/sessions", createJamSession);
app.post("/api/jam/recordings/upload", uploadJamRecording);
app.get("/api/jam/users/:userId/analysis", getJamUserAnalysis);

// VAPI endpoints removed

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.path
  });
});

// Export the app for production builds
export const createServer = () => app;

// Start the server
// Check if this file is run directly (not imported)
const isMainModule = process.argv[1]?.endsWith('index.ts') ||
  process.argv[1]?.endsWith('index.js') ||
  !process.argv[1]?.includes('tsx') ||
  process.env.NODE_ENV === 'production';

if (isMainModule) {
  console.log(`🔄 Starting backend server on port ${PORT}...`);
  server.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
    console.log(`🔗 Frontend proxy configured for http://localhost:5173`);
  }).on('error', (err: any) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
} else {
  console.log('📦 Server module loaded (not starting automatically)');
}
