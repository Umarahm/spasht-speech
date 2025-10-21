import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ProgressAnalyticsResponse, AnalyticsData } from '../../../backend/shared/api';
import {
    TrendingUp,
    Target,
    Trophy,
    Flame,
    Clock,
    BarChart3,
    Star,
    Award,
    Activity,
    Zap
} from 'lucide-react';
import { Progress as ProgressBar } from '../components/ui/progress';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function Progress() {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const { data: progressData, isLoading, error } = useQuery({
        queryKey: ['progress-analytics', user?.uid],
        queryFn: async (): Promise<ProgressAnalyticsResponse> => {
            if (!user?.uid) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`/api/progress?userId=${user.uid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch progress data');
            }
            return response.json();
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        enabled: !!user?.uid, // Only run query if user is authenticated
    });

    const analytics = progressData?.analytics;

    // Format time spent seconds to readable format
    const formatTimeSpent = (seconds: string) => {
        const totalSeconds = parseFloat(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = Math.floor(totalSeconds % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    // Prepare chart data
    const prepareChartData = () => {
        if (!analytics?.trends?.processed_daily_progress) return [];

        return analytics.trends.processed_daily_progress
            .slice(-30) // Last 30 days
            .map(day => ({
                date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: day.total_score,
                levels: day.levels_completed,
                accuracy: parseFloat(day.average_accuracy.replace(/[^0-9.]/g, '')) || 0,
                fluency: parseFloat(day.average_fluency.replace(/[^0-9.]/g, '')) || 0,
            }));
    };

    const chartData = prepareChartData();

    // Level breakdown for pie chart
    const prepareLevelData = () => {
        if (!analytics?.level_breakdown) return [];

        return Object.values(analytics.level_breakdown).map((level: any) => ({
            name: `Level ${level.level_id}`,
            value: level.successful_attempts,
            attempts: level.attempts,
            score: level.average_score,
        }));
    };

    const levelData = prepareLevelData();

    const COLORS = ['#00373e', '#006b7a', '#00a8b3', '#00e5ff', '#33f0ff'];

    if (!user) {
        return null; // Will redirect
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-speech-bg">
                <Navigation />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="loader mx-auto mb-4"></div>
                        <p className="font-bricolage text-lg text-speech-green">Loading your progress...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !progressData?.success || !analytics) {
        return (
            <div className="min-h-screen bg-speech-bg">
                <Navigation />

                {/* Hero Section with Empty State */}
                <section className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="relative bg-gradient-to-br from-[#F9E6D0] to-[#F5DCC4] rounded-[70px] overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[668px] flex items-center justify-center shadow-2xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-10 left-10 w-32 h-32 bg-speech-green rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 bg-speech-green rounded-full blur-3xl"></div>
                        </div>

                        {/* Main Content */}
                        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
                            <div className="w-24 h-24 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <BarChart3 className="w-12 h-12 text-speech-green" />
                            </div>

                            <h1 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-speech-green mb-6 md:mb-8 leading-tight drop-shadow-sm">
                                No Progress Yet
                            </h1>

                            <p className="font-bricolage text-lg sm:text-xl md:text-2xl lg:text-2xl text-speech-green/90 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
                                {progressData?.message || "Start playing games to see your progress analytics and track your improvement!"}
                            </p>

                            <button
                                onClick={() => window.open('https://spasht-game.vercel.app/', '_blank')}
                                className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Start Playing Now
                            </button>
                        </div>
                    </div>
                </section>

                {/* Getting Started Section */}
                <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6">
                            {/* Section Label */}
                            <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase">
                                GET STARTED
                            </p>

                            {/* Main Heading */}
                            <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide">
                                Your Journey Begins Here
                            </h2>

                            {/* Description */}
                            <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
                                Complete your first level to begin tracking progress and monitor your improvement over time.
                            </p>

                            {/* Call to Action Button */}
                            <div className="pt-4">
                                <button
                                    onClick={() => window.open('https://spasht-game.vercel.app/', '_blank')}
                                    className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors"
                                >
                                    Start Your First Game
                                </button>
                            </div>
                        </div>

                        {/* Right Illustration */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative bg-speech-green rounded-[60px] w-full max-w-[550px] aspect-[550/564] flex items-center justify-center overflow-hidden">
                                <img
                                    src="https://api.builder.io/api/v1/image/assets/TEMP/94d811e65f6cd29f35f00f5fed21001c8bbdd9cf?width=832"
                                    alt="Speech therapy games illustration"
                                    className="w-[75%] h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* What You'll Track Section */}
                <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase mb-4">
                            WHAT YOU'LL TRACK
                        </p>
                        <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                            Comprehensive Analytics
                        </h2>
                        <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px] max-w-2xl mx-auto">
                            Monitor your progress across multiple dimensions of speech improvement.
                        </p>
                    </div>

                    {/* Analytics Grid */}
                    <div className="space-y-8">
                        {/* Top Row */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Accuracy & Fluency */}
                            <div className="relative bg-[#F9E6D0] rounded-[60px] p-8 md:p-12 lg:p-15 min-h-[300px] flex flex-col justify-between overflow-hidden">
                                <div>
                                    <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                                        Accuracy & Fluency
                                    </h3>
                                    <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                                        Track your speech accuracy and fluency improvements with detailed analytics and progress charts.
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Target className="w-16 h-16 text-speech-green/60" />
                                </div>
                            </div>

                            {/* Performance Trends */}
                            <div className="relative bg-[#F8ECEC] rounded-[60px] p-8 md:p-12 lg:p-15 min-h-[300px] flex flex-col justify-between overflow-hidden">
                                <div>
                                    <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                                        Performance Trends
                                    </h3>
                                    <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                                        Visualize your improvement over time with interactive charts and detailed performance metrics.
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <TrendingUp className="w-16 h-16 text-speech-green/60" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="relative bg-white rounded-[60px] p-8 md:p-12 lg:p-15 min-h-[300px] overflow-hidden">
                            <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
                                {/* Content */}
                                <div className="space-y-6">
                                    <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide">
                                        Activity Insights
                                    </h3>
                                    <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                                        Detailed breakdown of your speech therapy sessions, including time spent, levels completed, and success rates.
                                    </p>
                                    <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                                        Monitor your consistency and identify patterns in your speech therapy journey.
                                    </p>
                                    <button
                                        onClick={() => window.open('https://spasht-game.vercel.app/', '_blank')}
                                        className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-8 py-3 rounded-full tracking-wide capitalize transition-colors"
                                    >
                                        Begin Tracking
                                    </button>
                                </div>

                                {/* Illustration */}
                                <div className="flex justify-center lg:justify-end">
                                    <Activity className="w-32 h-32 text-speech-green/60" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-speech-bg">
            <Navigation />

            {/* Overview Stats Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase mb-4">
                        YOUR PROGRESS
                    </p>
                    <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                        Key Metrics at a Glance
                    </h2>
                    <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px] max-w-2xl mx-auto">
                        Comprehensive overview of your speech therapy performance and achievements.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Levels Completed */}
                    <div className="bg-white rounded-[59px] p-8 md:p-10 lg:p-12 text-center flex flex-col justify-between min-h-[300px]">
                        <div className="flex-1 space-y-4">
                            <div className="w-16 h-16 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto">
                                <Trophy className="w-8 h-8 text-speech-green" />
                            </div>
                            <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                                {analytics.overview.total_levels_completed}
                            </h3>
                            <p className="font-bricolage text-lg lg:text-[18px] text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                                Levels Completed
                            </p>
                        </div>
                    </div>

                    {/* Total XP */}
                    <div className="bg-white rounded-[59px] p-8 md:p-10 lg:p-12 text-center flex flex-col justify-between min-h-[300px]">
                        <div className="flex-1 space-y-4">
                            <div className="w-16 h-16 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto">
                                <Star className="w-8 h-8 text-speech-green" />
                            </div>
                            <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                                {analytics.overview.total_xp.toLocaleString()}
                            </h3>
                            <p className="font-bricolage text-lg lg:text-[18px] text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                                Total XP Earned
                            </p>
                        </div>
                    </div>

                    {/* Current Streak */}
                    <div className="bg-white rounded-[59px] p-8 md:p-10 lg:p-12 text-center flex flex-col justify-between min-h-[300px]">
                        <div className="flex-1 space-y-4">
                            <div className="w-16 h-16 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto">
                                <Flame className="w-8 h-8 text-speech-green" />
                            </div>
                            <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                                {analytics.overview.current_streak}
                            </h3>
                            <p className="font-bricolage text-lg lg:text-[18px] text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                                Current Streak
                            </p>
                        </div>
                    </div>

                    {/* Time Spent */}
                    <div className="bg-white rounded-[59px] p-8 md:p-10 lg:p-12 text-center flex flex-col justify-between min-h-[300px]">
                        <div className="flex-1 space-y-4">
                            <div className="w-16 h-16 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 text-speech-green" />
                            </div>
                            <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                                {formatTimeSpent(analytics.overview.total_time_spent_seconds)}
                            </h3>
                            <p className="font-bricolage text-lg lg:text-[18px] text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                                Time Practicing
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Level Progression Board */}
            <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase mb-4">
                        LEVEL PROGRESSION
                    </p>
                    <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                        Your Journey Map
                    </h2>
                    <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px] max-w-2xl mx-auto">
                        Track your progress through all 21 levels. Red levels are boss challenges!
                    </p>
                </div>

                {/* Level Grid */}
                <div className="bg-white rounded-[60px] p-8 md:p-12 lg:p-15">
                    {/* Legend */}
                    <div className="flex justify-center gap-8 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-speech-green rounded-full"></div>
                            <span className="font-bricolage text-sm text-speech-green">Completed Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="font-bricolage text-sm text-speech-green">Boss Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                            <span className="font-bricolage text-sm text-speech-green">Not Started</span>
                        </div>
                    </div>

                    {/* Level Grid - 7x3 layout */}
                    <div className="grid grid-cols-7 gap-4 max-w-4xl mx-auto">
                        {Array.from({ length: 21 }, (_, i) => {
                            const levelNumber = i + 1;
                            const isBossLevel = [7, 14, 16, 21].includes(levelNumber);
                            const levelData = analytics.level_breakdown?.[levelNumber.toString()];
                            const isCompleted = levelData && levelData.successful_attempts > 0;

                            return (
                                <div
                                    key={levelNumber}
                                    className="relative group"
                                >
                                    {/* Level Circle */}
                                    <div
                                        className={`
                                            w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
                                            transition-all duration-300 hover:scale-110 hover:shadow-lg
                                            ${isCompleted
                                                ? (isBossLevel ? 'bg-red-500 text-white' : 'bg-speech-green text-white')
                                                : 'bg-gray-200 text-gray-500'
                                            }
                                        `}
                                    >
                                        <span className="font-bricolage font-bold text-lg md:text-xl">
                                            {levelNumber}
                                        </span>
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        <div className="text-center">
                                            <div className="font-bricolage font-semibold">
                                                Level {levelNumber} {isBossLevel && '(Boss)'}
                                            </div>
                                            {levelData ? (
                                                <div className="text-xs mt-1">
                                                    <div>Attempts: {levelData.attempts}</div>
                                                    <div>Best Score: {levelData.best_score}</div>
                                                    <div>Avg Accuracy: {(levelData.average_accuracy * 100).toFixed(1)}%</div>
                                                </div>
                                            ) : (
                                                <div className="text-xs mt-1">
                                                    {isCompleted ? 'Completed' : 'Not started'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Summary */}
                    <div className="mt-12 text-center">
                        <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="bg-[#F9E6D0] rounded-[30px] p-6">
                                <div className="text-2xl font-bold text-speech-green mb-2">
                                    {analytics.overview.total_levels_completed}/21
                                </div>
                                <div className="text-speech-green/70 font-bricolage">
                                    Levels Completed
                                </div>
                            </div>
                            <div className="bg-[#F8ECEC] rounded-[30px] p-6">
                                <div className="text-2xl font-bold text-speech-green mb-2">
                                    {Object.keys(analytics.level_breakdown || {}).length}
                                </div>
                                <div className="text-speech-green/70 font-bricolage">
                                    Levels Attempted
                                </div>
                            </div>
                            <div className="bg-[#F0F9FF] rounded-[30px] p-6">
                                <div className="text-2xl font-bold text-speech-green mb-2">
                                    {Math.round((analytics.overview.total_levels_completed / 21) * 100)}%
                                </div>
                                <div className="text-speech-green/70 font-bricolage">
                                    Progress
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Content - Performance */}
                    <div className="space-y-8">
                        {/* Section Label */}
                        <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase">
                            PERFORMANCE METRICS
                        </p>

                        {/* Main Heading */}
                        <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide">
                            Your Speech Quality
                        </h2>

                        {/* Metrics Cards */}
                        <div className="space-y-6">
                            {/* Average Score */}
                            <div className="bg-[#F9E6D0] rounded-[30px] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-speech-green rounded-full flex items-center justify-center">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bricolage text-xl font-bold text-speech-green">Average Score</h3>
                                        <p className="text-speech-green/70">Overall performance rating</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bricolage text-3xl font-bold text-speech-green">{analytics.performance.average_score}</p>
                                    <ProgressBar value={parseFloat(analytics.performance.average_score)} className="w-24 h-2 mt-2" />
                                </div>
                            </div>

                            {/* Average Accuracy */}
                            <div className="bg-[#F8ECEC] rounded-[30px] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-speech-green rounded-full flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bricolage text-xl font-bold text-speech-green">Average Accuracy</h3>
                                        <p className="text-speech-green/70">Speech recognition accuracy</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bricolage text-3xl font-bold text-speech-green">{(parseFloat(analytics.performance.average_accuracy) * 100).toFixed(1)}%</p>
                                    <ProgressBar value={parseFloat(analytics.performance.average_accuracy) * 100} className="w-24 h-2 mt-2" />
                                </div>
                            </div>

                            {/* Average Fluency */}
                            <div className="bg-[#F0F9FF] rounded-[30px] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-speech-green rounded-full flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bricolage text-xl font-bold text-speech-green">Average Fluency</h3>
                                        <p className="text-speech-green/70">Speech flow and smoothness</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bricolage text-3xl font-bold text-speech-green">{(parseFloat(analytics.performance.average_fluency) * 100).toFixed(1)}%</p>
                                    <ProgressBar value={parseFloat(analytics.performance.average_fluency) * 100} className="w-24 h-2 mt-2" />
                                </div>
                            </div>

                            {/* Words Per Minute */}
                            <div className="bg-[#FFF8F0] rounded-[30px] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-speech-green rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bricolage text-xl font-bold text-speech-green">Speaking Speed</h3>
                                        <p className="text-speech-green/70">Words per minute average</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bricolage text-3xl font-bold text-speech-green">{analytics.performance.average_words_per_minute}</p>
                                    <p className="text-sm text-speech-green/60 mt-1">Best streak: {analytics.performance.best_streak}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Charts */}
                    <div className="space-y-8">
                        {/* Progress Trends Chart */}
                        <div className="bg-white rounded-[60px] p-8 overflow-hidden">
                            <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-6 tracking-wide">Progress Trends</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#F9FAFB',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#00373e"
                                        strokeWidth={3}
                                        dot={{ fill: '#00373e', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: '#00373e', strokeWidth: 2, fill: '#F9E6D0' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Accuracy & Fluency Chart */}
                        <div className="bg-white rounded-[60px] p-8 overflow-hidden">
                            <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-6 tracking-wide">Quality Metrics</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                                    <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#F9FAFB',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="#00a8b3"
                                        strokeWidth={3}
                                        name="Accuracy %"
                                        dot={{ fill: '#00a8b3', strokeWidth: 2, r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="fluency"
                                        stroke="#006b7a"
                                        strokeWidth={3}
                                        name="Fluency %"
                                        dot={{ fill: '#006b7a', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                        Detailed Analytics
                    </h2>
                    <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px] max-w-2xl mx-auto">
                        Comprehensive insights into your speech therapy progress and performance patterns.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Level Completion Chart */}
                    <div className="bg-white rounded-[60px] p-8 overflow-hidden">
                        <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-6 tracking-wide">Daily Activity</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#F9FAFB',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar dataKey="levels" fill="#00373e" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Level Breakdown Pie Chart */}
                    <div className="bg-white rounded-[60px] p-8 overflow-hidden">
                        <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-6 tracking-wide">Level Performance</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={levelData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {levelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#F9FAFB',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


            <Footer />
        </div>
    );
}
