import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from '../components/auth/AuthProvider';
import {
    Mic,
    MicOff,
    Square,
    Loader2,
    BarChart3,
    CheckCircle,
    Clock,
    Lightbulb,
    Eye,
    EyeOff,
    Music,
    Timer,
    Zap,
    RefreshCw
} from "lucide-react";
import { JamTopic, JamSessionResponse, SpeechAnalysisResult } from '../../../backend/shared/api';
import { useToast } from '@/hooks/use-toast';
import SpeechAnalysisVisualizer from '../components/SpeechAnalysisVisualizer';
import AnalysisSummaryChart from '../components/AnalysisSummaryChart';

interface JamTopicResponse {
    topic: JamTopic;
    sessionId: string;
}

// Convert audio blob to WAV format
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
const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

export default function JAM() {
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

    // State management
    const [topic, setTopic] = useState<JamTopic | null>(null);
    const [session, setSession] = useState<JamSessionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [maxRecordingTime] = useState(60); // 60 seconds
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [hasUploaded, setHasUploaded] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SpeechAnalysisResult | null>(null);

    // UI state
    const [revealedHints, setRevealedHints] = useState<number[]>([]);

    // Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Get a new JAM topic
    const getJamTopic = async () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication Required",
                description: "Please log in to access JAM sessions.",
            });
            return;
        }

        setLoading(true);
        try {
            console.log('🎯 Getting JAM topic for difficulty:', difficulty);

            const response = await fetch(`/api/jam/topic?difficulty=${difficulty}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('📡 JAM topic API response status:', response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    console.error('❌ JAM topic API Error Details:', errorData);
                } catch (parseError) {
                    console.error('❌ Failed to parse JAM topic error response:', parseError);
                }
                throw new Error(errorMessage);
            }

            const data: JamTopicResponse = await response.json();
            console.log('✅ JAM topic received:', data.topic.topic);

            setTopic(data.topic);
            setSession(null);
            setAudioBlob(null);
            setRevealedHints([]);

            toast({
                title: "Topic Loaded",
                description: `Got a ${difficulty} level topic: "${data.topic.topic}"`,
            });

        } catch (error: any) {
            console.error('❌ Error getting JAM topic:', error);
            toast({
                variant: "destructive",
                title: "Failed to Load Topic",
                description: error.message || "Unable to load JAM topic. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Create a JAM session
    const createJamSession = async () => {
        if (!user || !topic) return;

        try {
            console.log('🎵 Creating JAM session for topic:', topic.id);
            console.log('📤 Request payload:', { topicId: topic.id, userId: user.uid });

            const response = await fetch('/api/jam/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topicId: topic.id,
                    userId: user.uid
                }),
            });

            console.log('📡 JAM session API response status:', response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    console.error('❌ JAM session API Error Details:', errorData);
                } catch (parseError) {
                    console.error('❌ Failed to parse JAM session error response:', parseError);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setSession(data.session);

            console.log('✅ JAM session created:', data.session.sessionId);

        } catch (error: any) {
            console.error('❌ Error creating JAM session:', error);
            toast({
                variant: "destructive",
                title: "Session Creation Failed",
                description: error.message || "Unable to create JAM session. Please try again.",
            });
        }
    };

    // Start recording
    const startRecording = async () => {
        try {
            console.log('🎙️ Starting JAM recording...');

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            streamRef.current = stream;
            audioChunksRef.current = [];

            // Prefer WAV format
            const mimeTypes = [
                'audio/wav',
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/mp4'
            ];

            let selectedMimeType = '';
            for (const mimeType of mimeTypes) {
                if (MediaRecorder.isTypeSupported(mimeType)) {
                    selectedMimeType = mimeType;
                    break;
                }
            }

            if (!selectedMimeType) {
                throw new Error('No supported audio format found');
            }

            console.log('🎵 Using audio format:', selectedMimeType);

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: selectedMimeType
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const originalBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });

                console.log('🎵 Audio recording completed:', {
                    size: originalBlob.size,
                    type: originalBlob.type,
                    format: selectedMimeType
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
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    const newTime = prev + 1;
                    if (newTime >= maxRecordingTime) {
                        stopRecording();
                        return maxRecordingTime;
                    }
                    return newTime;
                });
            }, 1000);

            // Create session if not already created
            if (!session) {
                await createJamSession();
            }

        } catch (error: any) {
            console.error('❌ Error starting recording:', error);
            toast({
                variant: "destructive",
                title: "Recording Failed",
                description: error.message || "Unable to start audio recording. Please check your microphone permissions.",
            });
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            console.log('🛑 Stopping JAM recording...');
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    // Upload recording
    const uploadRecording = async () => {
        if (!audioBlob || !session || uploading || hasUploaded) return;

        setUploading(true);
        setHasUploaded(true); // Prevent multiple uploads
        try {
            console.log('📤 Uploading JAM recording...');

            toast({
                title: "Uploading Recording",
                description: "Saving your JAM session to the cloud...",
            });

            const formData = new FormData();
            formData.append('audio', audioBlob, 'jam_recording.wav');
            formData.append('sessionId', session.sessionId);
            formData.append('userId', user?.uid || 'anonymous');

            const response = await fetch('/api/jam/recordings/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            setSession(data.session);

            toast({
                title: "Upload Complete",
                description: "Your JAM recording has been saved successfully!",
            });

            console.log('✅ Recording uploaded successfully');

        } catch (error: any) {
            console.error('❌ Error uploading recording:', error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message || "Failed to upload recording. Please try again.",
            });
        } finally {
            setUploading(false);
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

            const response = await fetch('/api/recordings/analyze-new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session.sessionId,
                    userId: user.uid
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

    // Reveal hint
    const revealHint = (hintIndex: number) => {
        if (!revealedHints.includes(hintIndex)) {
            setRevealedHints(prev => [...prev, hintIndex]);
        }
    };

    // Auto-upload when recording stops
    useEffect(() => {
        if (!isRecording && audioBlob && session && !hasUploaded) {
            uploadRecording();
        }
    }, [isRecording, audioBlob, session, hasUploaded]);

    // Load initial topic
    useEffect(() => {
        if (user) {
            getJamTopic();
        }
    }, [user]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);


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
                            <Timer className="w-5 h-5 text-speech-green" />
                        </div>
                        <span className="font-bricolage text-sm font-semibold text-speech-green tracking-wider uppercase">
                            Just A Minute
                        </span>
                    </div>

                    <h1 className="font-bricolage text-5xl md:text-7xl font-bold bg-gradient-to-r from-speech-green to-speech-green/80 bg-clip-text text-transparent mb-6 tracking-wide">
                        JAM Sessions
                    </h1>
                    <p className="text-lg text-speech-green/70 max-w-2xl mx-auto leading-relaxed">
                        Speak continuously for exactly one minute on the given topic. Get AI-powered feedback on your fluency and speech patterns.
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-xl border border-speech-green/10">
                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-speech-green/10 rounded-lg">
                                <Zap className="w-5 h-5 text-speech-green" />
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
                            onClick={getJamTopic}
                            disabled={loading}
                            className="bg-gradient-to-r from-speech-green to-speech-green/90 hover:from-speech-green/90 hover:to-speech-green text-white font-bricolage px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
                            {loading ? 'Loading...' : 'Get New Topic'}
                        </Button>
                    </div>
                </div>

                {/* Topic Card */}
                {topic && !loading && (
                    <Card className="mb-12 bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-speech-green/5 to-speech-green/10 pb-6">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-speech-green/20 rounded-lg">
                                        <Music className="w-6 h-6 text-speech-green" />
                                    </div>
                                    <span className="font-bricolage text-2xl text-speech-green font-bold">
                                        {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)} JAM Topic
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-speech-green/70 bg-white/50 px-4 py-2 rounded-full">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        1 minute
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 lg:p-12">
                            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                                {/* Topic Content - Takes up 2/3 on desktop */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gradient-to-r from-speech-green/5 to-transparent p-6 lg:p-8 rounded-xl mb-8 border-l-4 border-speech-green">
                                        <p className="font-bricolage text-xl lg:text-2xl leading-relaxed text-speech-green/90 mb-6">
                                            {topic.topic}
                                        </p>
                                        <p className="text-speech-green/70 text-sm lg:text-base italic">
                                            {topic.description}
                                        </p>
                                    </div>

                                    {/* Hints Section */}
                                    <div className="mb-8">
                                        <h3 className="font-bricolage text-lg font-semibold text-speech-green mb-4 flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5" />
                                            Need Help Getting Started?
                                        </h3>
                                        <div className="grid gap-3">
                                            {topic.hints.map((hint, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => revealHint(index)}
                                                        disabled={revealedHints.includes(index)}
                                                        className="flex items-center gap-2 min-w-[120px] border-speech-green/20 text-speech-green hover:bg-speech-green/5"
                                                    >
                                                        {revealedHints.includes(index) ? (
                                                            <>
                                                                <Eye className="w-4 h-4" />
                                                                Hint {index + 1}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-4 h-4" />
                                                                Reveal Hint {index + 1}
                                                            </>
                                                        )}
                                                    </Button>
                                                    {revealedHints.includes(index) && (
                                                        <div className="flex-1 bg-speech-green/5 p-3 rounded-lg border border-speech-green/10">
                                                            <p className="text-speech-green/80 text-sm">{hint}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recording Controls */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="text-center mb-4">
                                    <h3 className="font-bricolage text-lg font-semibold text-speech-green mb-2">
                                        Start Your JAM Session
                                    </h3>
                                    <p className="text-speech-green/70 text-sm">
                                        Speak continuously for exactly 1 minute. Use hints if you get stuck!
                                    </p>
                                </div>

                                {!isRecording ? (
                                    <Button
                                        onClick={startRecording}
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bricolage px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Mic className="w-6 h-6 mr-3" />
                                        Start JAM Session
                                    </Button>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <Button
                                            onClick={stopRecording}
                                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bricolage px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <Square className="w-6 h-6 mr-3" />
                                            Stop Recording
                                        </Button>

                                        {/* Timer Display */}
                                        <div className="bg-red-50 px-8 py-4 rounded-full border-2 border-red-200">
                                            <div className="flex items-center gap-4">
                                                <Timer className="w-6 h-6 text-red-600 animate-pulse" />
                                                <div className="text-center">
                                                    <div className="font-bricolage text-2xl font-bold text-red-700">
                                                        {recordingTime}s
                                                    </div>
                                                    <div className="text-sm text-red-600">elapsed</div>
                                                </div>
                                                <div className="w-20">
                                                    <Progress
                                                        value={(recordingTime / maxRecordingTime) * 100}
                                                        className="h-3"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-red-50 px-6 py-3 rounded-full border border-red-200">
                                            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="font-bricolage text-sm font-medium text-red-700">JAM session in progress...</span>
                                            <div className="flex gap-1">
                                                <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                                                <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Session Status */}
                {session && (
                    <Card className="mb-12 bg-white/90 backdrop-blur-sm shadow-xl border-0">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
                            <CardTitle className="flex items-center gap-3 font-bricolage text-xl text-blue-700">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mic className="w-5 h-5 text-blue-600" />
                                </div>
                                JAM Session
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <span className="font-bricolage text-sm font-medium text-gray-700">Status:</span>
                                    <span className={`font-bricolage text-sm px-4 py-2 rounded-full font-medium ${session.status === 'ready' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                        session.status === 'recording' ? 'bg-red-100 text-red-800 border border-red-200' :
                                            session.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                session.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                    'bg-green-100 text-green-800 border border-green-200'
                                        }`}>
                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                    </span>
                                </div>

                                {session.status === 'completed' && !analyzing && (
                                    <Button
                                        onClick={analyzeRecording}
                                        disabled={analyzing}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bricolage py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <BarChart3 className="w-5 h-5 mr-2" />}
                                        {analyzing ? 'Analyzing...' : 'Analyze My JAM Session'}
                                    </Button>
                                )}

                                {analyzing && (
                                    <div className="flex items-center justify-center gap-3 py-6 bg-blue-50 rounded-xl border border-blue-200">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                        <span className="font-bricolage text-blue-700 font-medium">Analyzing your JAM speech patterns...</span>
                                    </div>
                                )}

                                {session.status === 'analyzed' && (
                                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                            <span className="font-bricolage text-green-700 font-medium">Analysis Complete!</span>
                                        </div>
                                        <p className="text-green-700/80 text-sm">
                                            Your JAM session has been analyzed. Speech pattern insights will be available in your progress dashboard.
                                        </p>
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
                                JAM Speech Analysis Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-center text-green-700/80 mb-8 font-bricolage">
                                {analysisResult.top_class && analysisResult.confidences
                                    ? "Speech Pattern Analysis - Understanding your JAM speech characteristics"
                                    : "Great job! Here's your JAM speech analysis."
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
                                            The most prominent speech pattern in your JAM recording
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

                                {/* Timeline Analysis */}
                                {analysisResult.timeline && analysisResult.timeline.length > 0 && (
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                                        <h3 className="font-bricolage text-lg font-semibold text-green-700 mb-6">
                                            Speech Pattern Timeline Analysis
                                        </h3>
                                        <div className="space-y-3">
                                            {analysisResult.timeline.slice(0, 10).map((segment: any, index: number) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="text-sm font-medium text-gray-600 w-16">
                                                        {segment.start?.toFixed(1)}s
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-800 capitalize">
                                                            {segment.pattern?.replace('-', ' ') || 'Unknown'}
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{ width: `${Math.min((segment.confidence || 0) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {(segment.confidence * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

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