import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from '../components/auth/AuthProvider';
import { FileText, BookOpen, Mic, MicOff, Play, Square, Loader2, BarChart3, CheckCircle } from "lucide-react";
import { PassageResponse, RecordingSession, SpeechAnalysisResult } from '../../../backend/shared/api';
import { useToast } from '@/hooks/use-toast';
import SpeechAnalysisVisualizer from '../components/SpeechAnalysisVisualizer';
import { apiFetch } from '../lib/api';
import AnalysisSummaryChart from '../components/AnalysisSummaryChart';

interface RecordingState {
    isRecording: boolean;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
}

// Convert audio blob to WAV format using Web Audio API
const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Convert to WAV format
    const wavBuffer = audioBufferToWav(audioBuffer);
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

    audioContext.close();
    return wavBlob;
};

// Convert AudioBuffer to WAV format (PCM 16-bit)
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    const numChannels = buffer.numberOfChannels;

    // WAV header
    const arrayBuffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(arrayBuffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeString(view, 8, 'WAVE');

    // Format chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Chunk size
    view.setUint16(20, 1, true); // Audio format (PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true); // Byte rate
    view.setUint16(32, numChannels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample

    // Data chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length * numChannels * 2, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return arrayBuffer;
};


// Helper function to write strings to DataView
const writeString = (view: DataView, offset: number, string: string): void => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

export default function Passages() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Will redirect
    }

    const [passage, setPassage] = useState<PassageResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
    const [recordingState, setRecordingState] = useState<RecordingState>({
        isRecording: false,
        isPlaying: false,
        duration: 0,
        currentTime: 0
    });
    const [session, setSession] = useState<RecordingSession | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [hasUploaded, setHasUploaded] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SpeechAnalysisResult | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Generate new passage
    const generatePassage = async () => {
        setLoading(true);
        try {
            const response = await apiFetch('/api/generate-passage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    difficulty,
                    length: 'medium'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate passage');
            }

            const data: PassageResponse = await response.json();
            setPassage(data);
        } catch (error) {
            console.error('Error generating passage:', error);
            // Fallback passage
            setPassage({
                passage: "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is perfect for practicing clear speech. Take your time to articulate each word carefully.",
                difficulty: 'intermediate',
                wordCount: 45,
                estimatedReadTime: 15
            });
        } finally {
            setLoading(false);
        }
    };

    // Start recording session
    const startRecordingSession = async () => {
        if (!user || !passage) return;

        try {
            const response = await apiFetch('/api/recording-sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.uid,
                    passageId: `passage_${Date.now()}`
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create session');
            }

            const data = await response.json();
            setSession(data.session);
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Get supported audio formats (browsers typically support WebM variants)
            const supportedFormats = [
                'audio/wav',
                'audio/webm;codecs=pcm',
                'audio/webm;codecs=opus',
                'audio/mp4',
                'audio/mpeg'
            ];

            let mimeType = 'audio/webm;codecs=opus'; // Default fallback

            // Find the first supported format
            for (const format of supportedFormats) {
                if (MediaRecorder.isTypeSupported(format)) {
                    mimeType = format;
                    break;
                }
            }

            console.log('🎙️ Selected audio format:', mimeType);

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const originalBlob = new Blob(audioChunksRef.current, { type: mimeType });

                console.log('🎵 Audio recording completed:', {
                    size: originalBlob.size,
                    type: originalBlob.type,
                    format: mimeType
                });

                // Convert to WAV format
                try {
                    const wavBlob = await convertToWav(originalBlob);
                    console.log('✅ Converted to WAV:', {
                        originalSize: originalBlob.size,
                        wavSize: wavBlob.size,
                        wavType: wavBlob.type
                    });
                    setAudioBlob(wavBlob);
                } catch (conversionError) {
                    console.warn('⚠️  WAV conversion failed, using original format:', conversionError);
                    setAudioBlob(originalBlob);
                }

                setHasUploaded(false); // Reset upload flag for new recording

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setRecordingState(prev => ({ ...prev, isRecording: true }));

            // Start session if not already started
            if (!session) {
                await startRecordingSession();
            }
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingState.isRecording) {
            mediaRecorderRef.current.stop();
            setRecordingState(prev => ({ ...prev, isRecording: false }));
        }
    };

    // Upload recording
    const uploadRecording = async () => {
        if (!audioBlob || !session || hasUploaded) {
            console.log('⏭️ Skipping upload:', { hasAudio: !!audioBlob, hasSession: !!session, hasUploaded });
            return;
        }

        console.log('📤 Starting audio upload...');
        setHasUploaded(true); // Prevent multiple uploads

        // Show toast notification
        toast({
            variant: "speech",
            title: "Uploading to Firebase",
            description: "Saving your recording to the cloud...",
        });

        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');
            formData.append('sessionId', session.sessionId);
            formData.append('userId', user.uid);

            const response = await apiFetch('/api/recordings/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Upload failed:', errorData);
                throw new Error(errorData.message || 'Failed to upload recording');
            }

            const data = await response.json();
            console.log('✅ Audio uploaded successfully:', data.session.audioUrl);
            setSession(data.session);

            // Show success toast for upload
            toast({
                variant: "speech",
                title: "Upload Complete",
                description: "Your recording has been saved to Firebase.",
            });
        } catch (error: any) {
            console.error('❌ Error uploading recording:', error);
            console.error('Error details:', {
                message: error?.message,
                stack: error?.stack,
                name: error?.name
            });
            setHasUploaded(false); // Allow retry on error

            // Show error toast
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error?.message || "Failed to upload recording. Please try again.",
            });
        }
    };

    // Analyze recording
    const analyzeRecording = async () => {
        if (!session) return;

        setAnalyzing(true);
        try {
            console.log('🎯 Starting analysis for session:', session.sessionId);

            // Show toast notification
            toast({
                variant: "speech",
                title: "Analyzing by AI",
                description: "Processing your speech with advanced AI analysis...",
            });

            // Read Colab URL from saved settings
            let colabUrl = '';
            try {
                const raw = localStorage.getItem('speechAppSettings');
                if (raw) colabUrl = (JSON.parse(raw)?.colabUrl || '').toString();
            } catch { }

            const response = await apiFetch('/api/recordings/analyze-new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session.sessionId,
                    userId: user.uid,
                    colabUrl: colabUrl?.trim() || undefined
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Analysis error:', errorData);
                throw new Error(errorData.message || 'Failed to analyze recording');
            }

            const data = await response.json();
            console.log('✅ Analysis result:', data);
            setAnalysisResult(data.analysis);
            setSession(prev => prev ? { ...prev, status: 'analyzed' } : null);

            // Show success toast
            toast({
                variant: "speech",
                title: "Response Received",
                description: "AI analysis complete! Check your speech patterns below.",
            });
        } catch (error: any) {
            console.error('❌ Error analyzing recording:', error);

            // Provide specific error messages based on error type
            let errorMessage = 'Failed to analyze recording. Please try again.';

            if (error.message?.includes('Unsupported audio format')) {
                errorMessage = 'Audio format not supported. The speech analysis model requires WAV format. Please try a different browser or device that supports WAV recording.';
            } else if (error.message?.includes('ModelError')) {
                errorMessage = 'Speech analysis failed due to audio format incompatibility. Please ensure your recording is clear and in a supported format.';
            }

            alert(errorMessage);
        } finally {
            setAnalyzing(false);
        }
    };

    // Auto-upload when recording stops
    useEffect(() => {
        if (!recordingState.isRecording && audioBlob && session) {
            uploadRecording();
        }
    }, [recordingState.isRecording, audioBlob, session]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-speech-bg via-speech-bg to-speech-green/5">
            <Navigation />

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-speech-green/5 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-speech-green/3 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-speech-green/4 rounded-full blur-lg"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8 xl:px-12">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-full px-8 py-3 mb-8 border border-speech-green/20 shadow-lg">
                        <div className="p-2 bg-speech-green/20 rounded-full">
                            <FileText className="w-5 h-5 text-speech-green" />
                        </div>
                        <span className="font-bricolage text-sm font-semibold text-speech-green tracking-wider uppercase">
                            Reading Practice
                        </span>
                    </div>

                    <h1 className="font-bricolage text-5xl md:text-7xl font-bold bg-gradient-to-r from-speech-green to-speech-green/80 bg-clip-text text-transparent mb-6 tracking-wide">
                        Speech Passages
                    </h1>
                    <p className="text-lg text-speech-green/70 max-w-2xl mx-auto leading-relaxed">
                        Practice your speech with AI-generated passages tailored to your skill level.
                        Record yourself and get instant feedback on your pronunciation and fluency.
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-xl border border-speech-green/10">
                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-speech-green/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-speech-green" />
                            </div>
                            <div>
                                <label className="font-bricolage text-sm font-medium text-speech-green/80 mb-1 block">
                                    Difficulty Level
                                </label>
                                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                                    <SelectTrigger className="w-48 bg-white border-speech-green/20 shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner" className="font-bricolage">Beginner</SelectItem>
                                        <SelectItem value="intermediate" className="font-bricolage">Intermediate</SelectItem>
                                        <SelectItem value="advanced" className="font-bricolage">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-speech-green/20 hidden sm:block"></div>

                        <Button
                            onClick={generatePassage}
                            disabled={loading}
                            className="bg-gradient-to-r from-speech-green to-speech-green/90 hover:from-speech-green/90 hover:to-speech-green text-white font-bricolage px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <BookOpen className="w-5 h-5 mr-2" />}
                            {loading ? 'Generating...' : 'Generate New Passage'}
                        </Button>
                    </div>
                </div>

                {/* Placeholder for passage */}
                {!passage && !loading && (
                    <Card className="mb-12 bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden text-center">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-3 font-bricolage text-2xl text-speech-green font-bold">
                                <BookOpen className="w-6 h-6 text-speech-green" />
                                Your Passage Will Appear Here
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="font-bricolage text-xl leading-relaxed text-speech-green/90">
                                Please select a difficulty level and click the "Generate New Passage" button to start your practice session.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Loading Shimmer */}
                {loading && (
                    <Card className="mb-12 bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-speech-green/5 to-speech-green/10 pb-6">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-speech-green/20 rounded-lg animate-pulse"></div>
                                    <div className="h-8 w-48 bg-speech-green/20 rounded animate-pulse"></div>
                                </div>
                                <div className="h-8 w-32 bg-speech-green/20 rounded-full animate-pulse"></div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="bg-gradient-to-r from-speech-green/5 to-transparent p-6 rounded-xl mb-8 border-l-4 border-speech-green">
                                <div className="space-y-3">
                                    <div className="h-5 bg-speech-green/20 rounded animate-pulse w-full"></div>
                                    <div className="h-5 bg-speech-green/20 rounded animate-pulse w-11/12"></div>
                                    <div className="h-5 bg-speech-green/20 rounded animate-pulse w-full"></div>
                                    <div className="h-5 bg-speech-green/20 rounded animate-pulse w-10/12"></div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-block h-4 w-48 bg-speech-green/20 rounded animate-pulse mb-2"></div>
                                <div className="inline-block h-3 w-64 bg-speech-green/10 rounded animate-pulse"></div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Passage Card */}
                {passage && !loading && (
                    <Card className="mb-12 bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-speech-green/5 to-speech-green/10 pb-6">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-speech-green/20 rounded-lg">
                                        <FileText className="w-6 h-6 text-speech-green" />
                                    </div>
                                    <span className="font-bricolage text-2xl text-speech-green font-bold">
                                        {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)} Passage
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-speech-green/70 bg-white/50 px-4 py-2 rounded-full">
                                    <div className="flex items-center gap-1">
                                        {passage.wordCount} words
                                    </div>
                                    <div className="flex items-center gap-1">
                                        ~{passage.estimatedReadTime}s
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 lg:p-12">
                            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                                {/* Passage Text - Takes up 2/3 on desktop */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gradient-to-r from-speech-green/5 to-transparent p-6 lg:p-8 rounded-xl border-l-4 border-speech-green">
                                        <p className="font-bricolage text-xl lg:text-2xl leading-relaxed text-speech-green/90">
                                            {passage.passage}
                                        </p>
                                    </div>
                                </div>

                                {/* Recording Controls - Takes up 1/3 on desktop */}
                                <div className="lg:col-span-1">
                                    <div className="flex flex-col items-center gap-6 lg:sticky lg:top-8">
                                        <div className="text-center mb-4">
                                            <h3 className="font-bricolage text-lg font-semibold text-speech-green mb-2">
                                                Practice Your Reading
                                            </h3>
                                            <p className="text-speech-green/70 text-sm">
                                                Record yourself reading this passage aloud to get personalized feedback
                                            </p>
                                        </div>

                                        {!recordingState.isRecording ? (
                                            <Button
                                                onClick={startRecording}
                                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bricolage px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Mic className="w-6 h-6 mr-3" />
                                                Start Recording
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={stopRecording}
                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bricolage px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <Square className="w-6 h-6 mr-3" />
                                                Stop Recording
                                            </Button>
                                        )}

                                        {recordingState.isRecording && (
                                            <div className="flex items-center gap-3 bg-red-50 px-6 py-3 rounded-full border border-red-200">
                                                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="font-bricolage text-sm font-medium text-red-700">Recording in progress...</span>
                                                <div className="flex gap-1">
                                                    <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                                                    <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                                                    <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recording Status */}
                {session && (
                    <Card className="mb-12 bg-white/90 backdrop-blur-sm shadow-xl border-0">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
                            <CardTitle className="flex items-center gap-3 font-bricolage text-xl text-blue-700">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mic className="w-5 h-5 text-blue-600" />
                                </div>
                                Recording Session
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <span className="font-bricolage text-sm font-medium text-gray-700">Status:</span>
                                    <span className={`font-bricolage text-sm px-4 py-2 rounded-full font-medium ${session.status === 'recording' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                        session.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                            session.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                'bg-green-100 text-green-800 border border-green-200'
                                        }`}>
                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                    </span>
                                </div>

                                {session.status === 'completed' && !analyzing && !analysisResult && (
                                    <Button
                                        onClick={analyzeRecording}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bricolage py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <BarChart3 className="w-5 h-5 mr-2" />
                                        Analyze My Recording
                                    </Button>
                                )}

                                {analyzing && (
                                    <div className="flex items-center justify-center gap-3 py-6 bg-blue-50 rounded-xl border border-blue-200">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                        <span className="font-bricolage text-blue-700 font-medium">Analyzing your speech patterns...</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Analysis Results */}
                {analysisResult && (
                    <Card className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl border-0 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 pb-6">
                            <CardTitle className="flex items-center gap-3 font-bricolage text-2xl text-green-700">
                                <div className="p-3 bg-green-200 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                Speech Analysis Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-center text-green-700/80 mb-8 font-bricolage">
                                {analysisResult.top_class && analysisResult.confidences
                                    ? "Speech Pattern Analysis - Understanding your speech characteristics"
                                    : "Great job! Here's how you performed on this reading passage."
                                }
                            </p>

                            {/* Stutter Analysis Results */}
                            <div className="space-y-6">

                                {/* Primary Classification */}
                                {analysisResult.top_class && (
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-green-100">
                                        <div className="font-bricolage text-3xl font-bold text-orange-600 mb-2 capitalize">
                                            {analysisResult.top_class.replace('-', ' ')}
                                        </div>
                                        <div className="font-bricolage text-sm font-medium text-orange-700">
                                            Primary Pattern Detected
                                        </div>
                                        <div className="text-xs text-gray-600 mt-2">
                                            The most prominent speech pattern in your recording
                                        </div>
                                    </div>
                                )}

                                {/* Confidence Scores */}
                                {analysisResult.confidences && (
                                    <div>
                                        <h3 className="font-bricolage text-lg font-semibold text-blue-700 mb-4">
                                            Pattern Confidence Scores
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {Object.entries(analysisResult.confidences).map(([pattern, confidence]) => (
                                                <div key={pattern} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                                                    <div className="font-bricolage text-xl font-bold text-blue-600 mb-1">
                                                        {typeof confidence === 'number' ? (confidence * 100).toFixed(2) : '0.00'}%
                                                    </div>
                                                    <div className="font-bricolage text-xs font-medium text-blue-700 capitalize">
                                                        {pattern.replace('-', ' ')}
                                                    </div>
                                                    <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                                            style={{ width: `${Math.min(typeof confidence === 'number' ? confidence * 100 : 0, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Timeline Analysis with Progress Bars */}
                                {analysisResult.timeline && analysisResult.timeline.length > 0 && (
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                                        <h3 className="font-bricolage text-lg font-semibold text-green-700 mb-6">
                                            Speech Pattern Timeline Analysis
                                        </h3>

                                        {/* Legend */}
                                        <div className="flex flex-wrap gap-2 mb-6 text-xs">
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">Blocking</span>
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">Prolongation</span>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Sound Repetition</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Word Repetition</span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Interjection</span>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Normal</span>
                                        </div>

                                        {/* Timeline Progress Bars */}
                                        <div className="space-y-4">
                                            {analysisResult.timeline.map((segment, index) => {
                                                const duration = segment.end - segment.start;
                                                const totalConfidence = segment.confidences.reduce((sum, conf) => sum + (typeof conf === 'number' ? conf : 0), 0);

                                                return (
                                                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                        {/* Time Range Header */}
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="font-bricolage text-sm font-semibold text-gray-700">
                                                                {segment.start.toFixed(1)}s - {segment.end.toFixed(1)}s
                                                                <span className="text-gray-500 ml-2">({duration.toFixed(1)}s)</span>
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                                    Top: Pattern #{segment.top}
                                                                </span>
                                                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                                    Total: {(totalConfidence * 100).toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Stacked Progress Bar */}
                                                        <div className="relative mb-3">
                                                            <div className="flex h-8 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                                                                {segment.confidences.map((conf, i) => {
                                                                    const percentage = typeof conf === 'number' && !isNaN(conf) ? (conf / totalConfidence) * 100 : 0;
                                                                    const colors = [
                                                                        'bg-red-500',    // blocking
                                                                        'bg-orange-500', // prolongation
                                                                        'bg-yellow-500', // sound-repetition
                                                                        'bg-green-500',  // word-repetition
                                                                        'bg-blue-500',   // interjection
                                                                        'bg-purple-500'  // normal
                                                                    ];

                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className={`${colors[i]} transition-all duration-1000 ease-out relative group`}
                                                                            style={{ width: `${percentage}%` }}
                                                                        >
                                                                            {/* Hover tooltip */}
                                                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                                                Pattern {i + 1}: {typeof conf === 'number' && !isNaN(conf) ? (conf * 100).toFixed(1) : '0.0'}%
                                                                            </div>

                                                                            {/* Show percentage on bar if wide enough */}
                                                                            {percentage > 15 && (
                                                                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                                                                    {typeof conf === 'number' && !isNaN(conf) ? (conf * 100).toFixed(0) : '0'}%
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Individual Progress Bars */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {segment.confidences.map((conf, i) => {
                                                                const patternNames = ['Blocking', 'Prolongation', 'Sound Repetition', 'Word Repetition', 'Interjection', 'Normal'];
                                                                const colors = [
                                                                    'bg-red-500', 'bg-orange-500', 'bg-yellow-500',
                                                                    'bg-green-500', 'bg-blue-500', 'bg-purple-500'
                                                                ];

                                                                return (
                                                                    <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <span className="text-xs font-medium text-gray-700 truncate">
                                                                                {patternNames[i]}
                                                                            </span>
                                                                            <span className="text-xs font-bold text-gray-800">
                                                                                {typeof conf === 'number' && !isNaN(conf) ? (conf * 100).toFixed(1) : '0.0'}%
                                                                            </span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className={`${colors[i]} h-2 rounded-full transition-all duration-1000`}
                                                                                style={{
                                                                                    width: `${Math.min(typeof conf === 'number' && !isNaN(conf) ? conf * 100 : 0, 100)}%`
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Confidence Values Table */}
                                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                                            <div className="text-xs text-gray-600 font-medium mb-2">Detailed Confidences:</div>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                                                                {segment.confidences.map((conf, i) => {
                                                                    const patternNames = ['Block', 'Prolong', 'Sound-Rep', 'Word-Rep', 'Interject', 'Normal'];
                                                                    return (
                                                                        <div key={i} className="flex justify-between">
                                                                            <span className="text-gray-600">{patternNames[i]}:</span>
                                                                            <span className="font-semibold text-gray-800">
                                                                                {typeof conf === 'number' && !isNaN(conf) ? (conf * 100).toFixed(2) : '0.00'}%
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Summary Statistics */}
                                        <div className="mt-6 pt-4 border-t border-green-200">
                                            <h4 className="font-bricolage text-sm font-semibold text-green-700 mb-3">Analysis Summary</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                <div className="bg-green-50 rounded-lg p-3">
                                                    <div className="text-lg font-bold text-green-700">
                                                        {analysisResult.timeline.length}
                                                    </div>
                                                    <div className="text-xs text-green-600">Time Segments</div>
                                                </div>
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <div className="text-lg font-bold text-blue-700">
                                                        {analysisResult.top_class.replace('-', ' ')}
                                                    </div>
                                                    <div className="text-xs text-blue-600">Primary Pattern</div>
                                                </div>
                                                <div className="bg-purple-50 rounded-lg p-3">
                                                    <div className="text-lg font-bold text-purple-700">
                                                        {Math.max(...analysisResult.timeline.map(s => s.end)).toFixed(1)}s
                                                    </div>
                                                    <div className="text-xs text-purple-600">Total Duration</div>
                                                </div>
                                                <div className="bg-orange-50 rounded-lg p-3">
                                                    <div className="text-lg font-bold text-orange-700">
                                                        {((analysisResult.timeline.reduce((sum, s) => sum + s.confidences.reduce((confSum, conf) => confSum + (typeof conf === 'number' ? conf : 0), 0), 0) / analysisResult.timeline.length) * 100).toFixed(1)}%
                                                    </div>
                                                    <div className="text-xs text-orange-600">Avg Confidence</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* New Speech Analysis Visualizations */}
                            {analysisResult.segments && analysisResult.summary && (
                                <>
                                    <div className="mb-8">
                                        <SpeechAnalysisVisualizer
                                            segments={analysisResult.segments}
                                            summary={analysisResult.summary}
                                            audioUrl={analysisResult.audioUrl}
                                        />
                                    </div>

                                    <div className="mb-8">
                                        <AnalysisSummaryChart summary={analysisResult.summary} />
                                    </div>
                                </>
                            )}

                            <div className="mt-8 text-center">
                                <p className="text-green-700/70 text-sm font-bricolage">
                                    {analysisResult.top_class && analysisResult.confidences
                                        ? "This analysis helps identify speech patterns. Consider working with a speech therapist for personalized guidance."
                                        : "Keep practicing to improve your speech skills!"
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Back Button */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        className="font-bricolage border-2 border-speech-green text-speech-green hover:bg-speech-green hover:text-white transition-all duration-300 px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                        onClick={() => window.history.back()}
                    >
                        ← Back to Dashboard
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
