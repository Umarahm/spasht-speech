import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from '../components/auth/AuthProvider';
import { TrendingUp, BarChart3, Activity, Mic, Clock, Target, Play, Pause, Volume2, Calendar, ArrowUp, ArrowDown, TrendingDown, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { SpeechAnalysisResult } from '../../../backend/shared/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface RecordingData {
    sessionId: string;
    fileName: string;
    audioUrl: string;
    uploadedAt: string;
    size: number;
    hasAnalysis: boolean;
}

interface AnalysisResponse {
    success: boolean;
    analyses: SpeechAnalysisResult[];
    allRecordings: RecordingData[];
    summary: {
        totalAnalyses: number;
        totalRecordings: number;
        analyzedRecordings: number;
    };
}

export default function SpeechAnalysis() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState<SpeechAnalysisResult[]>([]);
    const [allRecordings, setAllRecordings] = useState<RecordingData[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Will redirect
    }

    useEffect(() => {
        fetchUserAnalyses();
    }, [user]);

    const fetchUserAnalyses = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/users/${user.uid}/analysis`);
            if (!response.ok) {
                throw new Error(`Failed to fetch analyses: ${response.status}`);
            }

            const data: AnalysisResponse = await response.json();
            setAnalyses(data.analyses || []);
            setAllRecordings(data.allRecordings || []);
            setSummary(data.summary || null);
        } catch (error) {
            console.error('Error fetching analyses:', error);
            setAnalyses([]);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = async (sessionId: string) => {
        try {
            // Stop current audio if playing
            if (audioRef.current) {
                audioRef.current.pause();
                setPlayingAudio(null);
            }

            // Find the recording with the matching session ID (check both analyses and allRecordings)
            let audioUrl = null;

            // First try to find in analyses
            const analysis = analyses.find(a => a.sessionId === sessionId);
            if (analysis?.audioUrl) {
                audioUrl = analysis.audioUrl;
            } else {
                // If not found in analyses, try allRecordings
                const recording = allRecordings.find(r => r.sessionId === sessionId);
                if (recording?.audioUrl) {
                    audioUrl = recording.audioUrl;
                }
            }

            if (!audioUrl) {
                console.error('No audio URL available for this session');
                return;
            }

            setPlayingAudio(sessionId);

            // Set audio source and play
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setPlayingAudio(null);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setPlayingAudio(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Data analysis functions
    const analyzeStutterPatterns = () => {
        if (analyses.length === 0) return null;

        // Aggregate all stutter counts from segments and summary data
        const totalCounts = {
            blocking: 0,
            prolongation: 0,
            'sound-repetition': 0,
            'word-repetition': 0,
            interjection: 0,
            normal: 0
        };

        let totalSegments = 0;

        analyses.forEach(analysis => {
            // Use segments data for detailed analysis (more accurate)
            if (analysis.segments && analysis.segments.length > 0) {
                analysis.segments.forEach(segment => {
                    const label = segment.label.toLowerCase();
                    totalSegments++;

                    // Map segment labels to our categories
                    if (label.includes('block')) {
                        totalCounts.blocking += segment.confidence;
                    } else if (label.includes('prolong')) {
                        totalCounts.prolongation += segment.confidence;
                    } else if (label.includes('sound') && label.includes('rep')) {
                        totalCounts['sound-repetition'] += segment.confidence;
                    } else if (label.includes('word') && label.includes('rep')) {
                        totalCounts['word-repetition'] += segment.confidence;
                    } else if (label.includes('interject')) {
                        totalCounts.interjection += segment.confidence;
                    } else if (label.includes('nostutter') || label.includes('normal')) {
                        totalCounts.normal += segment.confidence;
                    }
                });
            }
            // Fallback to summary data if segments not available
            else if (analysis.summary) {
                totalCounts.blocking += analysis.summary['Block'] || 0;
                totalCounts.prolongation += analysis.summary['Prolongation'] || 0;
                totalCounts['sound-repetition'] += analysis.summary['SoundRep'] || 0;
                totalCounts['word-repetition'] += analysis.summary['WordRep'] || 0;
                totalCounts.interjection += analysis.summary['Interjection'] || 0;
                totalCounts.normal += analysis.summary['NoStutteredWords'] || 0;
                totalSegments += Object.values(analysis.summary).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
            }
            // Last fallback to confidences
            else if (analysis.confidences) {
                totalCounts.blocking += (analysis.confidences.blocking || 0) * 100;
                totalCounts.prolongation += (analysis.confidences.prolongation || 0) * 100;
                totalCounts['sound-repetition'] += (analysis.confidences['sound-repetition'] || 0) * 100;
                totalCounts['word-repetition'] += (analysis.confidences['word-repetition'] || 0) * 100;
                totalCounts.interjection += (analysis.confidences.interjection || 0) * 100;
                totalCounts.normal += (analysis.confidences.normal || 0) * 100;
                totalSegments += 100; // Approximate
            }
        });

        // Convert confidence scores to percentages
        const percentages = Object.entries(totalCounts).map(([key, value]) => ({
            type: key,
            count: value,
            percentage: totalSegments > 0 ? (value / totalSegments) * 100 : 0
        }));

        return {
            totalCounts,
            percentages: percentages.sort((a, b) => b.count - a.count),
            totalSegments
        };
    };

    const getStutterTrend = (stutterType: string) => {
        if (analyses.length < 2) return null;

        const sortedAnalyses = [...analyses].sort((a, b) =>
            new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime()
        );

        const getValue = (analysis: SpeechAnalysisResult) => {
            // Use segments data for most accurate analysis
            if (analysis.segments && analysis.segments.length > 0) {
                let totalConfidence = 0;
                let segmentCount = 0;

                analysis.segments.forEach(segment => {
                    const label = segment.label.toLowerCase();
                    let matchesType = false;

                    // Map segment labels to our categories
                    if (stutterType === 'blocking' && label.includes('block')) matchesType = true;
                    else if (stutterType === 'prolongation' && label.includes('prolong')) matchesType = true;
                    else if (stutterType === 'sound-repetition' && label.includes('sound') && label.includes('rep')) matchesType = true;
                    else if (stutterType === 'word-repetition' && label.includes('word') && label.includes('rep')) matchesType = true;
                    else if (stutterType === 'interjection' && label.includes('interject')) matchesType = true;
                    else if (stutterType === 'normal' && (label.includes('nostutter') || label.includes('normal'))) matchesType = true;

                    if (matchesType) {
                        totalConfidence += segment.confidence;
                        segmentCount++;
                    }
                });

                return segmentCount > 0 ? (totalConfidence / segmentCount) * 100 : 0;
            }
            // Fallback to summary data
            else if (analysis.summary) {
                const mapping: { [key: string]: string } = {
                    blocking: 'Block',
                    prolongation: 'Prolongation',
                    'sound-repetition': 'SoundRep',
                    'word-repetition': 'WordRep',
                    interjection: 'Interjection',
                    normal: 'NoStutteredWords'
                };
                const totalSegments = Object.values(analysis.summary).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
                const stutterCount = analysis.summary[mapping[stutterType]] || 0;
                return totalSegments > 0 ? (stutterCount / totalSegments) * 100 : 0;
            }
            // Last fallback to confidences
            else if (analysis.confidences) {
                return (analysis.confidences[stutterType as keyof typeof analysis.confidences] || 0) * 100;
            }
            return 0;
        };

        const firstValue = getValue(sortedAnalyses[0]);
        const lastValue = getValue(sortedAnalyses[sortedAnalyses.length - 1]);
        const change = lastValue - firstValue;
        const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

        return {
            change,
            trend,
            percentage: firstValue > 0 ? Math.abs((change / firstValue) * 100) : 0,
            firstValue,
            lastValue
        };
    };

    const getProgressOverTime = () => {
        const sortedAnalyses = [...analyses].sort((a, b) =>
            new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime()
        );

        return sortedAnalyses.map((analysis, index) => {
            let normalSpeech = 0;
            let blocking = 0;
            let prolongation = 0;
            let soundRep = 0;
            let wordRep = 0;
            let interjection = 0;

            // Determine session type based on sessionId
            const sessionType = analysis.sessionId.startsWith('jam') ? 'JAM' :
                analysis.sessionId.startsWith('session') ? 'Passage' : 'Unknown';

            // Use segments data for most accurate analysis
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

                // Convert to percentages
                normalSpeech = (segmentStats.normal / segmentStats.total) * 100;
                blocking = (segmentStats.blocking / segmentStats.total) * 100;
                prolongation = (segmentStats.prolongation / segmentStats.total) * 100;
                soundRep = (segmentStats.soundRep / segmentStats.total) * 100;
                wordRep = (segmentStats.wordRep / segmentStats.total) * 100;
                interjection = (segmentStats.interjection / segmentStats.total) * 100;
            }
            // Fallback to summary data
            else if (analysis.summary) {
                const totalSegments = Object.values(analysis.summary).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);

                normalSpeech = totalSegments > 0 ? ((analysis.summary['NoStutteredWords'] || 0) / totalSegments) * 100 : 0;
                blocking = totalSegments > 0 ? ((analysis.summary['Block'] || 0) / totalSegments) * 100 : 0;
                prolongation = totalSegments > 0 ? ((analysis.summary['Prolongation'] || 0) / totalSegments) * 100 : 0;
                soundRep = totalSegments > 0 ? ((analysis.summary['SoundRep'] || 0) / totalSegments) * 100 : 0;
                wordRep = totalSegments > 0 ? ((analysis.summary['WordRep'] || 0) / totalSegments) * 100 : 0;
                interjection = totalSegments > 0 ? ((analysis.summary['Interjection'] || 0) / totalSegments) * 100 : 0;
            }
            // Last fallback to confidences
            else if (analysis.confidences) {
                normalSpeech = (analysis.confidences.normal || 0) * 100;
                blocking = (analysis.confidences.blocking || 0) * 100;
                prolongation = (analysis.confidences.prolongation || 0) * 100;
                soundRep = (analysis.confidences['sound-repetition'] || 0) * 100;
                wordRep = (analysis.confidences['word-repetition'] || 0) * 100;
                interjection = (analysis.confidences.interjection || 0) * 100;
            }

            const stutterRate = 100 - normalSpeech;

            return {
                session: `${sessionType} ${index + 1}`,
                sessionType,
                date: formatDate(analysis.analyzedAt),
                timestamp: new Date(analysis.analyzedAt).getTime(),
                normalSpeech: Math.max(0, Math.min(100, normalSpeech)), // Ensure 0-100 range
                stutterRate: Math.max(0, Math.min(100, stutterRate)),
                blocking: Math.max(0, blocking),
                prolongation: Math.max(0, prolongation),
                soundRep: Math.max(0, soundRep),
                wordRep: Math.max(0, wordRep),
                interjection: Math.max(0, interjection)
            };
        });
    };


    const patternData = useMemo(() => analyzeStutterPatterns(), [analyses]);
    const progressData = useMemo(() => getProgressOverTime(), [analyses]);

    // Memoize stutter trend data for all types
    const trendsData = useMemo(() => ({
        blocking: getStutterTrend('blocking'),
        prolongation: getStutterTrend('prolongation'),
        'sound-repetition': getStutterTrend('sound-repetition'),
        'word-repetition': getStutterTrend('word-repetition'),
    }), [analyses]);

    // Memoize computed statistics for better performance
    const speechStatistics = useMemo(() => {
        if (progressData.length === 0) return null;

        const normalSpeechValues = progressData.map(d => d.normalSpeech);
        const peakNormalSpeech = Math.max(...normalSpeechValues);
        const averageNormalSpeech = normalSpeechValues.reduce((sum, val) => sum + val, 0) / normalSpeechValues.length;
        const totalImprovement = progressData.length > 1 ?
            progressData[progressData.length - 1].normalSpeech - progressData[0].normalSpeech : 0;

        return {
            peakNormalSpeech,
            averageNormalSpeech,
            totalImprovement,
            totalSessions: progressData.length
        };
    }, [progressData]);

    // Memoize chart data for pie chart
    const pieChartData = useMemo(() => {
        const normalSpeechValue = patternData?.percentages.find(p => p.type === 'normal')?.percentage || 0;
        const stutterRateValue = patternData?.percentages.filter(p => p.type !== 'normal').reduce((sum, p) => sum + p.percentage, 0) || 0;

        return [
            {
                name: 'Normal Speech',
                value: Math.max(0.1, normalSpeechValue)
            },
            {
                name: 'Stutter Patterns',
                value: Math.max(0.1, stutterRateValue)
            }
        ];
    }, [patternData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-speech-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="loader mx-auto mb-4"></div>
                    <p className="font-bricolage text-lg text-speech-green">Loading your speech analysis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-speech-bg">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-speech-green/10 rounded-full px-6 py-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-speech-green" />
                        <span className="font-bricolage text-sm font-medium text-speech-green tracking-wide">
                            Speech Analytics Dashboard
                        </span>
                    </div>

                    <h1 className="font-bricolage text-3xl md:text-5xl font-bold text-speech-green mb-4 tracking-wide">
                        Speech Analysis Dashboard
                    </h1>
                    <p className="font-bricolage text-lg text-speech-green/70 max-w-3xl mx-auto leading-relaxed tracking-wide">
                        Monitor your speech therapy progress with comprehensive analytics and insights.
                    </p>
                </div>

                {analyses.length > 0 ? (
                    <>
                        {/* Metric Tiles - Top Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {['blocking', 'prolongation', 'sound-repetition', 'word-repetition'].map((stutterType) => {
                                const trend = trendsData[stutterType as keyof typeof trendsData];
                                const isPositive = trend && trend.trend === 'down'; // Lower stutter is better
                                const typeLabels = {
                                    blocking: 'Blocking',
                                    prolongation: 'Prolongation',
                                    'sound-repetition': 'Sound Repetition',
                                    'word-repetition': 'Word Repetition'
                                };

                                return (
                                    <Card key={stutterType} className="hover:shadow-lg transition-all duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stutterType === 'blocking' ? 'bg-red-100' :
                                                        stutterType === 'prolongation' ? 'bg-orange-100' :
                                                            stutterType === 'sound-repetition' ? 'bg-yellow-100' :
                                                                'bg-blue-100'
                                                        }`}>
                                                        {stutterType === 'blocking' && <Zap className={`w-5 h-5 text-red-600`} />}
                                                        {stutterType === 'prolongation' && <Clock className={`w-5 h-5 text-orange-600`} />}
                                                        {stutterType === 'sound-repetition' && <Volume2 className={`w-5 h-5 text-yellow-600`} />}
                                                        {stutterType === 'word-repetition' && <Target className={`w-5 h-5 text-blue-600`} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bricolage text-sm text-speech-green/70">
                                                            {typeLabels[stutterType as keyof typeof typeLabels]}
                                                        </p>
                                                        <p className="font-bricolage font-bold text-speech-green text-lg">
                                                            {patternData?.percentages.find(p => p.type === stutterType)?.percentage.toFixed(1) || 0}%
                                                        </p>
                                                    </div>
                                                </div>
                                                {trend && trend.trend !== 'stable' && (
                                                    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {isPositive ? (
                                                            <ArrowDown className="w-4 h-4" />
                                                        ) : (
                                                            <ArrowUp className="w-4 h-4" />
                                                        )}
                                                        <span className="font-bricolage text-sm font-medium">
                                                            {Math.abs(trend.percentage).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>


                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Bar Chart - Stutter Types Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                        <BarChart3 className="w-5 h-5" />
                                        Overall Stutter Pattern Distribution
                                    </CardTitle>
                                    <p className="text-sm text-speech-green/70">
                                        Based on all {patternData?.totalSegments || 0} analyzed segments
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={patternData?.percentages.filter(p => p.type !== 'normal').slice(0, 5) || []}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="type"
                                                    tickFormatter={(value) => {
                                                        const labels = {
                                                            blocking: 'Block',
                                                            prolongation: 'Prolong',
                                                            'sound-repetition': 'Sound Rep',
                                                            'word-repetition': 'Word Rep',
                                                            interjection: 'Interject'
                                                        };
                                                        return labels[value as keyof typeof labels] || value;
                                                    }}
                                                />
                                                <YAxis />
                                                <Tooltip
                                                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
                                                    labelFormatter={(label) => {
                                                        const labels = {
                                                            blocking: 'Blocking',
                                                            prolongation: 'Prolongation',
                                                            'sound-repetition': 'Sound Repetition',
                                                            'word-repetition': 'Word Repetition',
                                                            interjection: 'Interjection'
                                                        };
                                                        return labels[label as keyof typeof labels] || label;
                                                    }}
                                                />
                                                <Bar dataKey="percentage" fill="#22c55e" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enhanced Spiral Pie Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                        <Activity className="w-5 h-5" />
                                        Speech Pattern Overview
                                    </CardTitle>
                                    <p className="text-sm text-speech-green/70">
                                        Normal vs Stutter pattern distribution
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center">
                                        {/* Compact Chart */}
                                        <div className="h-48 flex items-center justify-center mb-4">
                                            <div className="relative">
                                                <ResponsiveContainer width={200} height={200}>
                                                    <PieChart>
                                                        <Pie
                                                            data={pieChartData.map(item => ({
                                                                ...item,
                                                                fill: item.name === 'Normal Speech' ? '#22c55e' : '#ef4444'
                                                            }))}
                                                            cx={100}
                                                            cy={100}
                                                            innerRadius={35}
                                                            outerRadius={80}
                                                            paddingAngle={2}
                                                            dataKey="value"
                                                            label={false}
                                                            labelLine={false}
                                                        />
                                                        <Tooltip
                                                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
                                                            contentStyle={{
                                                                backgroundColor: 'white',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                fontSize: '12px'
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                {/* Center label */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-speech-green">
                                                            {((patternData?.percentages.find(p => p.type === 'normal')?.percentage || 0) + (patternData?.percentages.filter(p => p.type !== 'normal').reduce((sum, p) => sum + p.percentage, 0) || 0)).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs text-speech-green/70">Analyzed</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compact Legend */}
                                        <div className="flex justify-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className="text-xs text-speech-green">Normal</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <span className="text-xs text-speech-green">Stutter</span>
                                            </div>
                                        </div>

                                        {/* Values below chart */}
                                        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600">
                                                    {patternData?.percentages.find(p => p.type === 'normal')?.percentage.toFixed(1) || '0.0'}%
                                                </div>
                                                <div className="text-xs text-speech-green/70">Normal Speech</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-red-600">
                                                    {(patternData?.percentages.filter(p => p.type !== 'normal').reduce((sum, p) => sum + p.percentage, 0) || 0).toFixed(1)}%
                                                </div>
                                                <div className="text-xs text-speech-green/70">Stutter Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progress Line Chart */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                    <TrendingUp className="w-5 h-5" />
                                    Detailed Progress Analysis
                                </CardTitle>
                                <p className="text-sm text-speech-green/70">
                                    Tracking improvement across {progressData.length} sessions over time
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={progressData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="session"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                formatter={(value: number, name: string) => [
                                                    `${value.toFixed(1)}%`,
                                                    name === 'normalSpeech' ? 'Normal Speech' :
                                                        name === 'stutterRate' ? 'Total Stutter Rate' :
                                                            name === 'blocking' ? 'Blocking' :
                                                                name === 'prolongation' ? 'Prolongation' :
                                                                    name === 'soundRep' ? 'Sound Repetition' :
                                                                        name === 'wordRep' ? 'Word Repetition' :
                                                                            name === 'interjection' ? 'Interjection' :
                                                                                name
                                                ]}
                                                labelFormatter={(label) => {
                                                    const sessionData = progressData.find(d => d.session === label);
                                                    return `${label}${sessionData ? ` (${sessionData.date})` : ''}`;
                                                }}
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '12px'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="normalSpeech"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                name="Normal Speech"
                                                dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
                                                activeDot={{ r: 7, stroke: '#22c55e', strokeWidth: 2 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="blocking"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                name="Blocking"
                                                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="prolongation"
                                                stroke="#f97316"
                                                strokeWidth={2}
                                                name="Prolongation"
                                                dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="soundRep"
                                                stroke="#eab308"
                                                strokeWidth={2}
                                                name="Sound Repetition"
                                                dot={{ fill: '#eab308', strokeWidth: 2, r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="wordRep"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                name="Word Repetition"
                                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-speech-green">
                                            {speechStatistics?.peakNormalSpeech.toFixed(1) || 0}%
                                        </div>
                                        <div className="text-xs text-speech-green/70">Peak Normal Speech</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-speech-green">
                                            {speechStatistics?.totalImprovement > 0 ? '+' : ''}{speechStatistics?.totalImprovement.toFixed(1) || 0}%
                                        </div>
                                        <div className="text-xs text-speech-green/70">Total Improvement</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-speech-green">
                                            {speechStatistics?.averageNormalSpeech.toFixed(1) || 0}%
                                        </div>
                                        <div className="text-xs text-speech-green/70">Average Normal Speech</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-speech-green">
                                            {speechStatistics?.totalSessions || 0}
                                        </div>
                                        <div className="text-xs text-speech-green/70">Total Sessions</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Charts - Radar and Heatmap */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Radar Chart - Stutter Pattern Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                        <Activity className="w-5 h-5" />
                                        Stutter Pattern Radar
                                    </CardTitle>
                                    <p className="text-sm text-speech-green/70">
                                        Multi-dimensional view of stutter patterns
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart data={[
                                                {
                                                    pattern: 'Blocking',
                                                    value: patternData?.percentages.find(p => p.type === 'blocking')?.percentage || 0,
                                                    fullMark: 100
                                                },
                                                {
                                                    pattern: 'Prolongation',
                                                    value: patternData?.percentages.find(p => p.type === 'prolongation')?.percentage || 0,
                                                    fullMark: 100
                                                },
                                                {
                                                    pattern: 'Sound Rep',
                                                    value: patternData?.percentages.find(p => p.type === 'sound-repetition')?.percentage || 0,
                                                    fullMark: 100
                                                },
                                                {
                                                    pattern: 'Word Rep',
                                                    value: patternData?.percentages.find(p => p.type === 'word-repetition')?.percentage || 0,
                                                    fullMark: 100
                                                },
                                                {
                                                    pattern: 'Interjection',
                                                    value: patternData?.percentages.find(p => p.type === 'interjection')?.percentage || 0,
                                                    fullMark: 100
                                                },
                                                {
                                                    pattern: 'Normal',
                                                    value: patternData?.percentages.find(p => p.type === 'normal')?.percentage || 0,
                                                    fullMark: 100
                                                }
                                            ]}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="pattern" />
                                                <PolarRadiusAxis
                                                    angle={90}
                                                    domain={[0, 75]}
                                                    tick={{ fontSize: 10 }}
                                                />
                                                <Radar
                                                    name="Percentage"
                                                    dataKey="value"
                                                    stroke="#22c55e"
                                                    fill="#22c55e"
                                                    fillOpacity={0.3}
                                                    strokeWidth={2}
                                                />
                                                <Tooltip
                                                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Heatmap - Pattern Frequency */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 font-bricolage text-speech-green">
                                        <BarChart3 className="w-5 h-5" />
                                        Pattern Frequency Heatmap
                                    </CardTitle>
                                    <p className="text-sm text-speech-green/70">
                                        Frequency distribution of stutter patterns
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {patternData?.percentages
                                            .filter(p => p.type !== 'normal')
                                            .sort((a, b) => b.count - a.count)
                                            .map((pattern, index) => {
                                                const intensity = Math.min(Math.max(pattern.percentage / 20, 0.1), 1); // Scale for better visibility
                                                return (
                                                    <div key={pattern.type} className="flex items-center gap-4">
                                                        <div className="w-24 text-sm font-medium text-speech-green capitalize">
                                                            {pattern.type.replace('-', ' ')}
                                                        </div>
                                                        <div className="flex-1 flex gap-1">
                                                            {Array.from({ length: 20 }, (_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="h-6 flex-1 rounded-sm transition-all duration-200"
                                                                    style={{
                                                                        backgroundColor: i < Math.round(intensity * 20)
                                                                            ? `rgba(34, 197, 94, ${0.3 + (intensity * 0.7)})`
                                                                            : 'rgba(229, 231, 235, 0.3)',
                                                                        border: i < Math.round(intensity * 20)
                                                                            ? '1px solid rgba(34, 197, 94, 0.5)'
                                                                            : '1px solid rgba(229, 231, 235, 0.5)'
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="w-16 text-right text-sm font-bold text-speech-green">
                                                            {pattern.percentage.toFixed(1)}%
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-speech-green/20">
                                        <div className="flex items-center justify-between text-xs text-speech-green/70">
                                            <span>Less Frequent</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(229, 231, 235, 0.3)', border: '1px solid rgba(229, 231, 235, 0.5)' }}></div>
                                                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.5)', border: '1px solid rgba(34, 197, 94, 0.5)' }}></div>
                                                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 1)', border: '1px solid rgba(34, 197, 94, 0.5)' }}></div>
                                            </div>
                                            <span>More Frequent</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Analysis History */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bricolage text-3xl font-bold text-speech-green tracking-wide">
                                    Analysis History
                                </h2>
                                <div className="text-sm text-speech-green/70">
                                    {analyses.length} total sessions
                                </div>
                            </div>

                            {analyses.slice().reverse().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((analysis, index) => {
                                const sessionType = analysis.sessionId.startsWith('jam') ? 'JAM' :
                                    analysis.sessionId.startsWith('session') ? 'Passage' : 'Unknown';
                                const actualIndex = (currentPage - 1) * itemsPerPage + index;
                                return (
                                    <Card
                                        key={analysis.sessionId}
                                        className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                        onClick={() => navigate(`/analysis/${analysis.sessionId}`)}
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-speech-green" />
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bricolage text-speech-green">
                                                            {sessionType} Session {analyses.length - actualIndex}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${sessionType === 'JAM' ? 'bg-blue-100 text-blue-800' :
                                                            sessionType === 'Passage' ? 'bg-green-100 text-green-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {sessionType}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bricolage text-sm text-speech-green/70">
                                                        {formatDate(analysis.analyzedAt)}
                                                    </span>
                                                    <div className="text-speech-green/50 group-hover:text-speech-green transition-colors">
                                                        <Target className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Stutter Analysis Results */}
                                            {analysis.confidences && (
                                                <div className="mb-6">
                                                    <h4 className="font-bricolage font-medium text-speech-green mb-4">Stutter Analysis Results</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {analysis.confidences.blocking !== undefined && (
                                                            <div className="text-center">
                                                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <span className="font-bricolage font-bold text-red-600 text-xs">
                                                                        {Math.round(analysis.confidences.blocking * 100)}%
                                                                    </span>
                                                                </div>
                                                                <div className="font-bricolage text-xs font-medium text-speech-green">Blocking</div>
                                                            </div>
                                                        )}

                                                        {analysis.confidences.prolongation !== undefined && (
                                                            <div className="text-center">
                                                                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <span className="font-bricolage font-bold text-orange-600 text-xs">
                                                                        {Math.round(analysis.confidences.prolongation * 100)}%
                                                                    </span>
                                                                </div>
                                                                <div className="font-bricolage text-xs font-medium text-speech-green">Prolongation</div>
                                                            </div>
                                                        )}

                                                        {analysis.confidences['sound-repetition'] !== undefined && (
                                                            <div className="text-center">
                                                                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <span className="font-bricolage font-bold text-yellow-600 text-xs">
                                                                        {Math.round(analysis.confidences['sound-repetition'] * 100)}%
                                                                    </span>
                                                                </div>
                                                                <div className="font-bricolage text-xs font-medium text-speech-green">Sound Repetition</div>
                                                            </div>
                                                        )}

                                                        {analysis.confidences['word-repetition'] !== undefined && (
                                                            <div className="text-center">
                                                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <span className="font-bricolage font-bold text-blue-600 text-xs">
                                                                        {Math.round(analysis.confidences['word-repetition'] * 100)}%
                                                                    </span>
                                                                </div>
                                                                <div className="font-bricolage text-xs font-medium text-speech-green">Word Repetition</div>
                                                            </div>
                                                        )}

                                                        {analysis.confidences.interjection !== undefined && (
                                                            <div className="text-center">
                                                                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <span className="font-bricolage font-bold text-purple-600 text-xs">
                                                                        {Math.round(analysis.confidences.interjection * 100)}%
                                                                    </span>
                                                                </div>
                                                                <div className="font-bricolage text-xs font-medium text-speech-green">Interjection</div>
                                                            </div>
                                                        )}

                                                        {analysis.confidences.normal !== undefined && (
                                                            <div className="text-center">
                                                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <span className="font-bricolage font-bold text-green-600 text-xs">
                                                                        {Math.round(analysis.confidences.normal * 100)}%
                                                                    </span>
                                                                </div>
                                                                <div className="font-bricolage text-xs font-medium text-speech-green">Normal Speech</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {/* Pagination */}
                            {analyses.length > itemsPerPage && (
                                <div className="flex items-center justify-between pt-6 border-t border-speech-green/20">
                                    <div className="text-sm text-speech-green/70">
                                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, analyses.length)} to {Math.min(currentPage * itemsPerPage, analyses.length)} of {analyses.length} sessions
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="border-speech-green text-speech-green hover:bg-speech-green hover:text-white"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.ceil(analyses.length / itemsPerPage) }, (_, i) => i + 1)
                                                .filter(page => {
                                                    const totalPages = Math.ceil(analyses.length / itemsPerPage);
                                                    if (totalPages <= 5) return true;
                                                    if (page === 1 || page === totalPages) return true;
                                                    if (Math.abs(page - currentPage) <= 1) return true;
                                                    return false;
                                                })
                                                .map((page, index, array) => (
                                                    <React.Fragment key={page}>
                                                        {index > 0 && array[index - 1] !== page - 1 && (
                                                            <span className="text-speech-green/50">...</span>
                                                        )}
                                                        <Button
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(page)}
                                                            className={currentPage === page
                                                                ? "bg-speech-green text-white"
                                                                : "border-speech-green text-speech-green hover:bg-speech-green hover:text-white"
                                                            }
                                                        >
                                                            {page}
                                                        </Button>
                                                    </React.Fragment>
                                                ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(analyses.length / itemsPerPage), prev + 1))}
                                            disabled={currentPage === Math.ceil(analyses.length / itemsPerPage)}
                                            className="border-speech-green text-speech-green hover:bg-speech-green hover:text-white"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* No Data State */
                    <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 shadow-sm border border-speech-green/10">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BarChart3 className="w-12 h-12 text-speech-green" />
                            </div>

                            <h2 className="font-bricolage text-3xl md:text-4xl font-bold text-speech-green mb-4 tracking-wide">
                                No Analysis Data Yet
                            </h2>
                            <p className="font-bricolage text-lg text-speech-green/70 max-w-2xl mx-auto mb-8 leading-relaxed tracking-wide">
                                You haven't completed any speech analysis sessions yet. Start by recording yourself reading passages
                                to see detailed analytics and track your progress over time.
                            </p>

                            <Button
                                className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage"
                                onClick={() => window.location.href = '/passages'}
                            >
                                Start Your First Session
                            </Button>
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <Button
                        variant="outline"
                        className="font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white transition-all duration-200 mr-4"
                        onClick={() => window.history.back()}
                    >
                        ← Back to Dashboard
                    </Button>
                    <Button
                        className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage"
                        onClick={() => window.location.href = '/passages'}
                    >
                        Record More Sessions
                    </Button>
                </div>
            </div>

            {/* Hidden audio element for playback */}
            <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} />

            <Footer />
        </div>
    );
}

