/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Progress Analytics Types
 */
export interface User {
  id: number;
  access_key: string;
  created_at: string;
  last_active: string;
}

export interface Overview {
  total_levels_completed: number;
  current_level: number;
  total_coins: number;
  total_xp: number;
  current_streak: number;
  total_sessions: number;
  total_time_spent_seconds: string;
}

export interface Performance {
  average_score: string;
  average_accuracy: string;
  average_fluency: string;
  average_words_per_minute: string;
  best_streak: number;
}

export interface RecentActivity {
  session_key: string;
  level_id: number;
  completed_at: string;
  success: boolean;
  score: number;
  accuracy: string;
  fluency: string;
  words_per_minute: string;
  duration_seconds: string;
  transcription: string;
}

export interface LevelBreakdown {
  [levelId: string]: {
    level_id: number;
    attempts: number;
    successful_attempts: number;
    best_score: number;
    average_score: number;
    average_accuracy: number;
    average_fluency: number;
    average_words_per_minute: number;
    last_attempt: string;
  };
}

export interface SessionActivity {
  level_id: number;
  completed_at: string;
  success: boolean;
  score: number;
  accuracy: string;
  fluency: string;
  words_per_minute: string;
  duration_seconds: string;
  transcription: string;
}

export interface Session {
  session_key: string;
  start_time: string;
  levels_completed: number;
  total_score: number;
  average_accuracy: number;
  average_fluency: number;
  average_words_per_minute: number;
  total_coins_earned: number;
  total_xp_earned: number;
  activities: SessionActivity[];
}

export interface SessionBreakdown {
  [sessionKey: string]: Session;
}

export interface Sessions {
  session_breakdown: SessionBreakdown;
}

export interface DailyProgress {
  date: string;
  levels_completed: number;
  total_score: number;
  average_accuracy: string;
  average_fluency: string;
  unique_sessions: number;
}

export interface ProcessedDailyProgress extends DailyProgress {
  sessions: any; // Keeping flexible for now
}

export interface Improvement {
  score_improvement: number;
  accuracy_improvement: number;
  fluency_improvement: number;
}

export interface Trends {
  daily_progress: {
    [date: string]: DailyProgress;
  };
  processed_daily_progress: ProcessedDailyProgress[];
  improvement: Improvement;
}

export interface AnalyticsData {
  user: User;
  overview: Overview;
  performance: Performance;
  recent_activity: RecentActivity[];
  level_breakdown: LevelBreakdown;
  sessions: Sessions;
  trends: Trends;
}

export interface ProgressAnalyticsResponse {
  success: boolean;
  analytics: AnalyticsData | null;
  message: string;
}

/**
 * Passages API Types
 */
export interface PassageRequest {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface PassageResponse {
  passage: string;
  difficulty: string;
  wordCount: number;
  estimatedReadTime: number; // in seconds
}

export interface RecordingSession {
  sessionId: string;
  userId: string;
  passageId: string;
  startedAt: string;
  completedAt?: string;
  audioUrl?: string;
  duration?: number;
  status: 'recording' | 'completed' | 'analyzing' | 'analyzed';
}

/**
 * New Speech Analysis API Types (External Service)
 */
export interface AnalysisSegment {
  segment: number;
  start_sec: number;
  end_sec: number;
  label: string;
  confidence: number;
}

export interface AnalysisSummary {
  [label: string]: number; // e.g., { "Block": 37, "NoStutteredWords": 43, ... }
}

export interface SpeechAnalysisResponse {
  segments: AnalysisSegment[];
  summary: AnalysisSummary;
}

export interface SpeechAnalysisResult {
  sessionId: string;
  userId: string;
  // Legacy fields (for backward compatibility)
  top_class?: string;
  confidences?: {
    blocking?: number;
    prolongation?: number;
    'sound-repetition'?: number;
    'word-repetition'?: number;
    interjection?: number;
    normal?: number;
  };
  timeline?: Array<{
    start: number;
    end: number;
    confidences: number[];
    top: number;
  }>;
  // New analysis fields
  segments?: AnalysisSegment[];
  summary?: AnalysisSummary;
  detailed_feedback?: any;
  rawResponse?: any;
  analysisUrl?: string; // URL to the saved analysis JSON file
  analyzedAt: string;
  audioUrl?: string; // URL to the recorded audio file
  recordingDuration?: number; // Duration of the recording in seconds
  sessionData?: any; // Additional session information
}

/**
 * JAM (JustAMinute) API Types
 */
export interface JamTopic {
  id: string;
  topic: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hints: string[];
  estimatedWords: number;
  timeLimit: number; // in seconds
}

export interface JamSessionRequest {
  topicId: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface JamSessionResponse {
  sessionId: string;
  topic: JamTopic;
  userId: string;
  startedAt: string;
  status: 'preparing' | 'ready' | 'recording' | 'completed' | 'analyzing' | 'analyzed';
  audioUrl?: string;
  analysis?: SpeechAnalysisResult;
}

export interface JamTopicRequest {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  topicId?: string;
}

export interface JamTopicResponse {
  topic: JamTopic;
  sessionId: string;
}
