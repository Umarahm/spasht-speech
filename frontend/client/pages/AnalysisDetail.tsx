import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from '../components/auth/AuthProvider';
import { TrendingUp, BarChart3, Activity, Mic, Clock, Target, Play, Pause, Volume2, Calendar, ArrowLeft, Zap, Clock as ClockIcon } from "lucide-react";
import { SpeechAnalysisResult } from '../../../backend/shared/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function AnalysisDetail() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState<SpeechAnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [playingAudio, setPlayingAudio] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Initialize AudioContext
        const initAudioContext = () => {
            try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                setAudioContext(ctx);
            } catch (error) {
                console.warn('Web Audio API not supported');
            }
        };

        initAudioContext();

        if (sessionId) {
            fetchAnalysisDetail();
        }

        return () => {
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [user, sessionId, navigate]);

    const fetchAnalysisDetail = async () => {
        if (!user || !sessionId) return;

        try {
            const response = await fetch(`/api/users/${user.uid}/analysis`);
            if (!response.ok) {
                throw new Error(`Failed to fetch analyses: ${response.status}`);
            }

            const data = await response.json();
            const foundAnalysis = data.analyses?.find((a: SpeechAnalysisResult) => a.sessionId === sessionId);

            if (foundAnalysis) {
                setAnalysis(foundAnalysis);
            } else {
                console.warn('Analysis not found for sessionId:', sessionId);
            }
        } catch (error) {
            console.error('Error fetching analysis detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateWaveform = async (audioUrl: string) => {
        if (!audioContext) {
            console.warn('AudioContext not available');
            return;
        }

        try {
            // First, try to load the audio through an HTML Audio element to handle CORS
            const audio = new Audio(audioUrl);
            await new Promise((resolve, reject) => {
                audio.addEventListener('loadeddata', resolve);
                audio.addEventListener('error', reject);
                audio.load();
            });

            // Fetch the audio file with CORS handling
            const response = await fetch(audioUrl, {
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            // Decode the audio data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Get the raw audio data (using the first channel)
            const channelData = audioBuffer.getChannelData(0);

            // Downsample to create waveform bars (aim for ~100 bars)
            const samplesPerBar = Math.floor(channelData.length / 100);
            const waveformBars: number[] = [];

            for (let i = 0; i < 100; i++) {
                const start = i * samplesPerBar;
                const end = Math.min(start + samplesPerBar, channelData.length);

                // Calculate RMS (Root Mean Square) for this segment
                let sum = 0;
                for (let j = start; j < end; j++) {
                    sum += channelData[j] * channelData[j];
                }
                const rms = Math.sqrt(sum / (end - start));

                // Convert to a height value (0-100) and apply some smoothing
                const height = Math.min(100, Math.max(5, rms * 300));
                waveformBars.push(height);
            }

            setWaveformData(waveformBars);
            console.log('Waveform generated successfully:', waveformBars.length, 'bars');
        } catch (error) {
            console.warn('Error generating waveform:', error);
            // Fallback to a more realistic-looking waveform based on typical audio patterns
            const fallbackWaveform = [];
            for (let i = 0; i < 100; i++) {
                // Create a more realistic waveform pattern with some variation
                const baseHeight = 20 + Math.sin(i * 0.1) * 10;
                const variation = Math.random() * 30;
                fallbackWaveform.push(Math.max(5, baseHeight + variation));
            }
            setWaveformData(fallbackWaveform);
        }
    };

    // Generate waveform and load audio metadata when analysis is ready
    useEffect(() => {
        if (analysis?.audioUrl && audioContext && waveformData.length === 0) {
            generateWaveform(analysis.audioUrl);
        }

        // Also try to load audio metadata if not already loaded
        if (analysis?.audioUrl && audioRef.current && duration === 0) {
            audioRef.current.src = analysis.audioUrl;
            audioRef.current.load();
        }
    }, [analysis?.audioUrl, audioContext, waveformData.length, duration]);

    const playAudio = async () => {
        if (!analysis?.audioUrl) return;

        try {
            if (audioRef.current) {
                if (playingAudio) {
                    audioRef.current.pause();
                    setPlayingAudio(false);
                } else {
                    if (!audioRef.current.src) {
                        audioRef.current.src = analysis.audioUrl;
                    }
                    await audioRef.current.play();
                    setPlayingAudio(true);
                }
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setPlayingAudio(false);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            const audioDuration = audioRef.current.duration;
            console.log('Audio duration loaded:', audioDuration);
            setDuration(audioDuration);
        }
    };

    const handleCanPlay = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAnalysisData = () => {
        if (!analysis) return null;

        // Use segments data for detailed analysis
        if (analysis.segments && analysis.segments.length > 0) {
            const segmentStats = {
                normal: 0,
                blocking: 0,
                prolongation: 0,
                soundRep: 0,
                wordRep: 0,
                interjection: 0,
                total: analysis.segments.length
            };

            analysis.segments.forEach(segment => {
                const label = segment.label.toLowerCase();
                const confidence = segment.confidence;

                if (label.includes('nostutter') || label.includes('normal')) {
                    segmentStats.normal += confidence;
                } else if (label.includes('block')) {
                    segmentStats.blocking += confidence;
                } else if (label.includes('prolong')) {
                    segmentStats.prolongation += confidence;
                } else if (label.includes('sound') && label.includes('rep')) {
                    segmentStats.soundRep += confidence;
                } else if (label.includes('word') && label.includes('rep')) {
                    segmentStats.wordRep += confidence;
                } else if (label.includes('interject')) {
                    segmentStats.interjection += confidence;
                }
            });

            const percentages = {
                normal: Math.max(0, Math.min(100, (segmentStats.normal / segmentStats.total) * 100)),
                blocking: Math.max(0, Math.min(100, (segmentStats.blocking / segmentStats.total) * 100)),
                prolongation: Math.max(0, Math.min(100, (segmentStats.prolongation / segmentStats.total) * 100)),
                soundRep: Math.max(0, Math.min(100, (segmentStats.soundRep / segmentStats.total) * 100)),
                wordRep: Math.max(0, Math.min(100, (segmentStats.wordRep / segmentStats.total) * 100)),
                interjection: Math.max(0, Math.min(100, (segmentStats.interjection / segmentStats.total) * 100))
            };

            console.log('Analysis data calculated:', { percentages, totalSegments: segmentStats.total });

            return {
                percentages,
                totalSegments: segmentStats.total,
                timelineData: analysis.segments.map((segment, index) => ({
                    time: segment.start_sec,
                    endTime: segment.end_sec,
                    confidence: segment.confidence * 100,
                    label: segment.label,
                    segment: index + 1
                }))
            };
        }

        // Fallback to summary data if available
        if (analysis.summary) {
            const totalSegments = Object.values(analysis.summary).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
            const percentages = {
                normal: totalSegments > 0 ? Math.max(0, Math.min(100, (analysis.summary['NoStutteredWords'] || 0) / totalSegments * 100)) : 0,
                blocking: totalSegments > 0 ? Math.max(0, Math.min(100, (analysis.summary['Block'] || 0) / totalSegments * 100)) : 0,
                prolongation: totalSegments > 0 ? Math.max(0, Math.min(100, (analysis.summary['Prolongation'] || 0) / totalSegments * 100)) : 0,
                soundRep: totalSegments > 0 ? Math.max(0, Math.min(100, (analysis.summary['SoundRep'] || 0) / totalSegments * 100)) : 0,
                wordRep: totalSegments > 0 ? Math.max(0, Math.min(100, (analysis.summary['WordRep'] || 0) / totalSegments * 100)) : 0,
                interjection: totalSegments > 0 ? Math.max(0, Math.min(100, (analysis.summary['Interjection'] || 0) / totalSegments * 100)) : 0
            };

            console.log('Fallback analysis data from summary:', { percentages, totalSegments });

            return {
                percentages,
                totalSegments,
                timelineData: []
            };
        }

        // Last fallback to confidences
        if (analysis.confidences) {
            const percentages = {
                normal: Math.max(0, Math.min(100, (analysis.confidences.normal || 0) * 100)),
                blocking: Math.max(0, Math.min(100, (analysis.confidences.blocking || 0) * 100)),
                prolongation: Math.max(0, Math.min(100, (analysis.confidences.prolongation || 0) * 100)),
                soundRep: Math.max(0, Math.min(100, (analysis.confidences['sound-repetition'] || 0) * 100)),
                wordRep: Math.max(0, Math.min(100, (analysis.confidences['word-repetition'] || 0) * 100)),
                interjection: Math.max(0, Math.min(100, (analysis.confidences.interjection || 0) * 100))
            };

            console.log('Fallback analysis data from confidences:', percentages);

            return {
                percentages,
                totalSegments: 100, // Approximate
                timelineData: []
            };
        }

        return null;
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-speech-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="loader mx-auto mb-4"></div>
                    <p className="font-bricolage text-lg text-speech-green">Loading analysis details...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="min-h-screen bg-speech-bg">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="font-bricolage text-4xl font-bold text-speech-green mb-4">Analysis Not Found</h1>
                        <p className="font-bricolage text-lg text-speech-green/70 mb-8">
                            The requested analysis could not be found.
                        </p>
                        <Button
                            onClick={() => navigate('/speech-analysis')}
                            className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage"
                        >
                            ← Back to Speech Analysis
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const analysisData = getAnalysisData();
    const sessionType = analysis.sessionId.startsWith('jam') ? 'JAM' : analysis.sessionId.startsWith('session') ? 'Passage' : 'Unknown';

    return (
        <div className="min-h-screen bg-speech-bg">
            {/* Custom styles for audio slider */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #22c55e;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 4px rgba(34, 197, 94, 0.3);
                }
                .slider::-moz-range-thumb {
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #22c55e;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 4px rgba(34, 197, 94, 0.3);
                }
                `
            }} />
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={() => navigate('/speech-analysis')}
                        variant="outline"
                        className="mb-4 font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Speech Analysis
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="font-bricolage text-3xl md:text-4xl font-bold text-speech-green">
                                    {sessionType} Session Analysis
                                </h1>
                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${sessionType === 'JAM' ? 'bg-blue-100 text-blue-800' :
                                    sessionType === 'Passage' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {sessionType}
                                </span>
                            </div>
                            <p className="font-bricolage text-lg text-speech-green/70">
                                Analyzed on {formatDate(analysis.analyzedAt)}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Analysis Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pattern Distribution */}
                    {analysisData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                    <BarChart3 className="w-5 h-5" />
                                    Pattern Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'Normal', value: analysisData.percentages.normal, color: '#22c55e' },
                                            { name: 'Blocking', value: analysisData.percentages.blocking, color: '#ef4444' },
                                            { name: 'Prolongation', value: analysisData.percentages.prolongation, color: '#f97316' },
                                            { name: 'Sound Rep', value: analysisData.percentages.soundRep, color: '#eab308' },
                                            { name: 'Word Rep', value: analysisData.percentages.wordRep, color: '#3b82f6' },
                                            { name: 'Interjection', value: analysisData.percentages.interjection, color: '#8b5cf6' }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, 75]} />
                                            <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, '']} />
                                            <Bar dataKey="value" fill="#22c55e" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Radar Chart */}
                    {analysisData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                    <Activity className="w-5 h-5" />
                                    Pattern Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={[
                                            { pattern: 'Normal', value: analysisData.percentages.normal },
                                            { pattern: 'Blocking', value: analysisData.percentages.blocking },
                                            { pattern: 'Prolong', value: analysisData.percentages.prolongation },
                                            { pattern: 'Sound Rep', value: analysisData.percentages.soundRep },
                                            { pattern: 'Word Rep', value: analysisData.percentages.wordRep },
                                            { pattern: 'Interject', value: analysisData.percentages.interjection }
                                        ]}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="pattern" />
                                            <PolarRadiusAxis domain={[0, 75]} />
                                            <Radar
                                                name="Percentage"
                                                dataKey="value"
                                                stroke="#22c55e"
                                                fill="#22c55e"
                                                fillOpacity={0.3}
                                            />
                                            <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, '']} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Timeline Analysis */}
                {analysisData && analysisData.timelineData && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                <ClockIcon className="w-5 h-5" />
                                Speech Timeline Analysis
                            </CardTitle>
                            <p className="text-sm text-speech-green/70">
                                Color-coded stutter patterns over time ({analysisData.totalSegments} segments)
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Timeline Visualization */}
                                <div className="h-32 border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-end space-x-1 h-full">
                                        {analysisData.timelineData.map((segment, index) => {
                                            const getColor = (label: string) => {
                                                const lowerLabel = label.toLowerCase();
                                                if (lowerLabel.includes('block')) return '#ef4444'; // red
                                                if (lowerLabel.includes('prolong')) return '#f97316'; // orange
                                                if (lowerLabel.includes('sound') && lowerLabel.includes('rep')) return '#eab308'; // yellow
                                                if (lowerLabel.includes('word') && lowerLabel.includes('rep')) return '#3b82f6'; // blue
                                                if (lowerLabel.includes('interject')) return '#8b5cf6'; // purple
                                                if (lowerLabel.includes('normal') || lowerLabel.includes('nostutter')) return '#22c55e'; // green
                                                return '#6b7280'; // gray
                                            };

                                            const height = Math.max(20, (segment.confidence / 100) * 100); // Min 20% height

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex-1 rounded-sm transition-all duration-200 hover:opacity-80"
                                                    style={{
                                                        backgroundColor: getColor(segment.label),
                                                        height: `${height}%`,
                                                        minWidth: '4px'
                                                    }}
                                                    title={`${segment.label}: ${(segment.confidence).toFixed(1)}% (${segment.time.toFixed(1)}s)`}
                                                />
                                            );
                                        })}
                                    </div>
                                    {/* Time markers */}
                                    <div className="flex justify-between text-xs text-speech-green/60 mt-2">
                                        <span>0s</span>
                                        <span>{(analysisData.timelineData[analysisData.timelineData.length - 1]?.endTime || 0).toFixed(1)}s</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap gap-4 justify-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
                                        <span>Normal</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                                        <span>Blocking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
                                        <span>Prolongation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
                                        <span>Sound Rep</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                                        <span>Word Rep</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
                                        <span>Interjection</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Detailed Segments */}
                {analysis.segments && analysis.segments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                <Target className="w-5 h-5" />
                                Detailed Segment Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-96 overflow-y-auto">
                                <div className="space-y-2">
                                    {analysis.segments.slice(0, 50).map((segment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="text-sm font-medium text-speech-green">
                                                    {segment.start_sec.toFixed(1)}s - {segment.end_sec.toFixed(1)}s
                                                </div>
                                                <div className={`px-2 py-1 text-xs rounded-full font-medium ${segment.label.toLowerCase().includes('normal') || segment.label.toLowerCase().includes('nostutter')
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {segment.label}
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-speech-green">
                                                {(segment.confidence * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    ))}
                                    {analysis.segments.length > 50 && (
                                        <div className="text-center text-sm text-speech-green/70 py-2">
                                            ... and {analysis.segments.length - 50} more segments
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Audio Player */}
                {analysis.audioUrl && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                <Volume2 className="w-5 h-5" />
                                Audio Playback
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Progress Bar */}
                                <div className="flex items-center gap-4">
                                    <Button
                                        onClick={playAudio}
                                        className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage px-6"
                                        disabled={!analysis.audioUrl}
                                    >
                                        {playingAudio ? (
                                            <><Pause className="w-5 h-5 mr-2" /> Pause</>
                                        ) : (
                                            <><Play className="w-5 h-5 mr-2" /> Play</>
                                        )}
                                    </Button>

                                    <div className="flex-1">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            style={{
                                                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
                                            }}
                                        />
                                    </div>

                                    <div className="text-sm text-speech-green font-medium min-w-[80px] text-right">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>

                                {/* Real Audio Waveform Visualization */}
                                <div className="bg-gray-50 rounded-lg p-4 relative">
                                    <div className="flex items-end justify-center space-x-1 h-16">
                                        {waveformData.length > 0 ? waveformData.map((height, i) => {
                                            // Calculate progress position
                                            const progressPosition = duration > 0 ? (currentTime / duration) * waveformData.length : 0;
                                            const isPlayed = i <= progressPosition;
                                            const isPlaying = playingAudio && Math.abs(i - progressPosition) < 2;

                                            return (
                                                <div
                                                    key={i}
                                                    className="bg-speech-green rounded-sm transition-all duration-200 relative"
                                                    style={{
                                                        width: '2px',
                                                        height: `${Math.max(2, height)}%`,
                                                        opacity: isPlayed ? 0.9 : 0.4,
                                                        backgroundColor: isPlaying ? '#16a34a' : '#22c55e',
                                                        transform: isPlaying ? 'scaleY(1.2)' : 'scaleY(1)',
                                                        boxShadow: isPlaying ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none'
                                                    }}
                                                />
                                            );
                                        }) : (
                                            // Loading state
                                            Array.from({ length: 50 }, (_, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-gray-300 rounded-sm animate-pulse"
                                                    style={{
                                                        width: '2px',
                                                        height: `${Math.random() * 60 + 10}%`
                                                    }}
                                                />
                                            ))
                                        )}
                                    </div>

                                    {/* Progress indicator line */}
                                    {duration > 0 && (
                                        <div
                                            className="absolute top-4 bottom-4 w-0.5 bg-red-500 transition-all duration-100"
                                            style={{
                                                left: `${16 + (currentTime / duration) * (waveformData.length * 3)}px`
                                            }}
                                        />
                                    )}

                                    <p className="text-center text-xs text-speech-green/60 mt-2">
                                        {waveformData.length > 0 ? 'Audio waveform' : 'Loading waveform...'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Session Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-speech-green mb-1">
                                {analysisData ? Math.max(0, Math.min(100, analysisData.percentages.normal)).toFixed(1) : '0.0'}%
                            </div>
                            <div className="text-xs text-speech-green/70">Normal Speech</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 mb-1">
                                {analysisData ? Math.max(0, Math.min(100, 100 - analysisData.percentages.normal)).toFixed(1) : '0.0'}%
                            </div>
                            <div className="text-xs text-speech-green/70">Stutter Rate</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-speech-green mb-1">
                                {analysisData?.totalSegments || 0}
                            </div>
                            <div className="text-xs text-speech-green/70">Total Segments</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-speech-green mb-1">
                                {duration > 0 ? formatTime(duration) :
                                    analysis.recordingDuration ? formatTime(Math.max(1, analysis.recordingDuration / 16000)) : // Rough estimate: bytes / bitrate
                                        'Unknown'}
                            </div>
                            <div className="text-xs text-speech-green/70">Duration</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                onEnded={() => setPlayingAudio(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onPause={() => setPlayingAudio(false)}
                onPlay={() => setPlayingAudio(true)}
                preload="metadata"
            />

            <Footer />
        </div>
    );
}
