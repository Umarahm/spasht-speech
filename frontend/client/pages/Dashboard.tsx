import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import JamPassagesSelector from '../components/JamPassagesSelector';
import ProgressSelector from '../components/ProgressSelector';
import Settings from '../components/Settings';
import { blogLinks } from '../data/blogLinks';
import { getRandomQuote } from '../data/quotelist';
import type { BlogLink } from '../data/blogLinks';

type Quote = {
    text: string;
    author: string;
    category: string;
};

import { ExternalLink, Youtube, MessageSquare, BookOpen, Users, Calendar, Newspaper, Quote, Target, Trophy, Flame } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [dailyStreak, setDailyStreak] = useState(7); // Mock streak data
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
    const [blogImagesLoaded, setBlogImagesLoaded] = useState<Record<number, boolean>>({});
    const [jamPassagesModalOpen, setJamPassagesModalOpen] = useState(false);
    const [progressModalOpen, setProgressModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login');
        }
        // Set random quote on component mount
        setCurrentQuote(getRandomQuote());
    }, [user, navigate]);

    if (!user) {
        return null; // Will redirect
    }

    // Determine greeting based on current time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return {
                message: 'Good morning',
                image: '/assets/homepage/Good morning.svg',
                bgColor: 'bg-gradient-to-br from-orange-100 to-yellow-50'
            };
        } else if (hour >= 12 && hour < 18) {
            return {
                message: 'Good afternoon',
                image: '/assets/homepage/Good Afternoon.svg',
                bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-50'
            };
        } else {
            return {
                message: 'Good evening',
                image: '/assets/homepage/Good Night.svg',
                bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-50'
            };
        }
    };

    const greeting = getGreeting();

    const getIcon = (type: string) => {
        switch (type) {
            case 'youtube':
                return <Youtube className="w-5 h-5 text-red-500" />;
            case 'reddit':
                return <MessageSquare className="w-5 h-5 text-orange-500" />;
            case 'journal':
                return <BookOpen className="w-5 h-5 text-blue-500" />;
            case 'community':
                return <Users className="w-5 h-5 text-green-500" />;
            case 'event':
                return <Calendar className="w-5 h-5 text-purple-500" />;
            case 'news':
                return <Newspaper className="w-5 h-5 text-gray-500" />;
            default:
                return <ExternalLink className="w-5 h-5 text-speech-green" />;
        }
    };

    const features = [
        {
            title: 'Games',
            description: 'Fun and engaging games to improve your speech skills',
            image: '/assets/homepage/Tiles/Tile for Games.svg'
        },
        {
            title: 'Speech Analysis',
            description: 'Analyze your speech patterns and get personalized insights',
            image: '/assets/homepage/Tiles/Tile for Speech Analysis Through Jam and ML.svg'
        },
        {
            title: 'Therapy Sessions',
            description: 'Connect with professional therapists for guided sessions',
            image: '/assets/homepage/Tiles/Tile for Therapy Session.svg'
        },
        {
            title: 'AI Podcast',
            description: 'Listen to AI-generated podcasts tailored to your needs',
            image: '/assets/homepage/Tiles/Tile for AI Podcast.svg'
        },
        {
            title: 'Progress Tracking',
            description: 'Monitor your improvement with detailed analytics',
            image: '/assets/homepage/Tiles/Tile for progress.svg'
        },
        {
            title: 'DAF Training',
            description: 'Delayed Auditory Feedback exercises for speech therapy',
            image: '/assets/homepage/Tiles/Tile for DAF.svg'
        },
        {
            title: 'Settings',
            description: 'Customize your experience and preferences',
            image: '/assets/homepage/Tiles/Tile for Settings.svg'
        }
    ];


    return (
        <div className="min-h-screen bg-speech-bg overflow-x-hidden">
            <Navigation showDailyStreak={true} dailyStreak={dailyStreak} />

            {/* Greeting Section - Hero with Rounded Shape */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
                <div className="relative bg-gradient-to-br from-[#F9E6D0] to-[#F5DCC4] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] lg:rounded-[70px] overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[668px] flex items-center justify-center shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-speech-green rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-speech-green rounded-full blur-3xl"></div>
                    </div>

                    {/* Background Image */}
                    <div className="absolute inset-0">
                        {!backgroundImageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-speech-bg">
                                <div className="text-center">
                                    <div className="loader mx-auto mb-4"></div>
                                    <p className="font-bricolage text-lg text-speech-green">Loading background...</p>
                                </div>
                            </div>
                        )}
                        <img
                            src={greeting.image}
                            alt={greeting.message}
                            className={`w-full h-full object-cover object-center ${backgroundImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setBackgroundImageLoaded(true)}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
                        {/* Greeting */}
                        <div className="mb-6 md:mb-8">
                            <h1 className="font-bricolage text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-speech-green mb-3 md:mb-4 leading-tight tracking-wide drop-shadow-sm">
                                {greeting.message}
                            </h1>
                            <h2 className="font-bricolage text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-speech-green/90 tracking-wide drop-shadow-sm">
                                {user.displayName || user.email?.split('@')[0]}
                            </h2>
                        </div>

                        {/* Welcome Message Section */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-[40px] p-6 sm:p-8 md:p-10 max-w-3xl mx-auto shadow-2xl border-4 border-speech-green/30 transform hover:scale-[1.02] transition-transform duration-300">
                            <p className="font-bricolage text-lg sm:text-xl md:text-2xl text-speech-green leading-relaxed tracking-wide mb-4 md:mb-6">
                                Welcome back to your personal speech therapy dashboard.
                            </p>
                            <p className="font-bricolage text-base sm:text-lg md:text-xl text-speech-green/80 leading-relaxed tracking-wide">
                                Ready to continue your journey towards better communication?
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quotes Section */}
            <div className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-speech-green/5 to-blue-50/50">
                <div className="max-w-4xl mx-auto text-center">
                    {currentQuote && (
                        <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
                            {/* Quote Paper Background */}
                            <div className="relative overflow-hidden">
                                <img
                                    src="/assets/QuotePaper.svg"
                                    alt="Quote Paper"
                                    className="w-full h-auto scale-110"
                                />

                                {/* Quote Text on Paper */}
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-8 py-8 md:py-12">
                                    <blockquote className="font-bricolage text-base md:text-lg lg:text-xl text-speech-green/90 leading-relaxed mb-3 md:mb-4 tracking-wide">
                                        "{currentQuote.text}"
                                    </blockquote>
                                    <cite className="font-bricolage text-sm md:text-base text-speech-green/70 font-semibold tracking-wide">
                                        — {currentQuote.author}
                                    </cite>
                                </div>
                            </div>

                            {/* Left Tape */}
                            <div className="absolute -top-8 -left-8 z-10">
                                <img
                                    src="/assets/Tape.svg"
                                    alt="Tape"
                                    className="w-24 h-auto transform -rotate-45"
                                />
                            </div>

                            {/* Right Tape */}
                            <div className="absolute -top-8 -right-8 z-10">
                                <img
                                    src="/assets/Tape.svg"
                                    alt="Tape"
                                    className="w-24 h-auto transform rotate-45"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Tiles Section - Streaming Style */}
            <div className="py-16 px-2 md:px-4 lg:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header with Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-bricolage text-3xl md:text-4xl font-bold text-speech-green tracking-wide">
                            Your Tools & Features
                        </h2>

                        {/* Navigation Buttons */}
                        <div className="flex gap-2">
                            <button
                                className="w-12 h-12 bg-speech-green/10 hover:bg-speech-green/20 rounded-full flex items-center justify-center transition-colors group"
                                onClick={() => {
                                    const container = document.getElementById('features-scroll');
                                    if (container) container.scrollBy({ left: -350, behavior: 'smooth' });
                                }}
                            >
                                <svg className="w-6 h-6 text-speech-green group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                className="w-12 h-12 bg-speech-green/10 hover:bg-speech-green/20 rounded-full flex items-center justify-center transition-colors group"
                                onClick={() => {
                                    const container = document.getElementById('features-scroll');
                                    if (container) container.scrollBy({ left: 350, behavior: 'smooth' });
                                }}
                            >
                                <svg className="w-6 h-6 text-speech-green group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Scrolling Container - Hidden Scrollbar */}
                    <div
                        id="features-scroll"
                        className="overflow-x-auto scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex gap-6 px-4 md:px-0 pb-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (feature.title === 'Speech Analysis') {
                                            setJamPassagesModalOpen(true);
                                        } else if (feature.title === 'DAF Training') {
                                            navigate('/daf-session');
                                        } else if (feature.title === 'Therapy Sessions') {
                                            navigate('/speech-therapy');
                                        } else if (feature.title === 'AI Podcast') {
                                            navigate('/ai-podcast');
                                        } else if (feature.title === 'Games') {
                                            window.location.href = 'https://spasht-game.vercel.app/';
                                        } else if (feature.title === 'Progress Tracking') {
                                            setProgressModalOpen(true);
                                        } else if (feature.title === 'Settings') {
                                            setSettingsModalOpen(true);
                                        }
                                        // Add other feature navigation here as needed
                                    }}
                                    className="relative flex-shrink-0 w-64 md:w-80 h-36 md:h-48 bg-speech-bg rounded-[20px] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                >
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Hover Overlay with Title */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <h3 className="font-bricolage text-xl font-bold text-white text-center px-4 tracking-wide">
                                            {feature.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Custom Scrollbar Hide Styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `
                }} />
            </div>

            {/* Quests Section */}
            <div className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    {/* <div className="absolute top-10 left-10 w-48 h-48 border-2 border-speech-green rounded-full"></div> */}
                    <div className="absolute top-32 right-20 w-24 h-24 border border-speech-green/50 rounded-full"></div>
                    <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-speech-green/10 rounded-full"></div>
                    <div className="absolute bottom-32 right-1/3 w-16 h-16 border border-speech-green/30 rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-speech-green/20">
                            <div className="w-2 h-2 bg-speech-green rounded-full animate-pulse"></div>
                            <span className="font-bricolage text-sm font-medium text-speech-green tracking-wide">Daily Missions</span>
                        </div>
                        <h2 className="font-bricolage text-4xl md:text-5xl font-bold text-speech-green mb-6 tracking-wide">
                            Communication Quests
                        </h2>
                        <p className="font-bricolage text-xl text-speech-green/70 max-w-3xl mx-auto leading-relaxed tracking-wide">
                            Transform everyday moments into opportunities for growth. Each quest builds confidence and connection.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Voice Quest */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-32 md:h-48">
                            <div className="absolute inset-0">
                                <img
                                    src="assets/Communication Quests/Speak The Truth.png"
                                    alt="Speak Your Truth"
                                    className="w-full h-full object-cover object-left opacity-30"
                                    style={{ objectPosition: '33% center' }}
                                />
                            </div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 md:p-6">
                                <h3 className="font-bricolage text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight drop-shadow-sm">SPEAK YOUR TRUTH</h3>
                                <p className="font-bricolage text-sm md:text-base text-gray-700 leading-tight drop-shadow-sm">Share thoughts with one new person today</p>
                            </div>
                        </div>

                        {/* Expression Quest */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-32 md:h-48">
                            <div className="absolute inset-0">
                                <img
                                    src="/assets/Communication Quests/Radiate Joy.png"
                                    alt="Radiate Joy"
                                    className="w-full h-full object-cover object-left opacity-30"
                                    style={{ objectPosition: '33% center' }}
                                />
                            </div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 md:p-6">
                                <h3 className="font-bricolage text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight drop-shadow-sm">RADIATE JOY</h3>
                                <p className="font-bricolage text-sm md:text-base text-gray-700 leading-tight drop-shadow-sm">Share authentic smiles with three people</p>
                            </div>
                        </div>

                        {/* Mindfulness Quest */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-32 md:h-48">
                            <div className="absolute inset-0">
                                <img
                                    src="/assets/Communication Quests/Inner voice.png"
                                    alt="Inner Voice"
                                    className="w-full h-full object-cover object-left opacity-30"
                                    style={{ objectPosition: '33% center' }}
                                />
                            </div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 md:p-6">
                                <h3 className="font-bricolage text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight drop-shadow-sm">INNER VOICE</h3>
                                <p className="font-bricolage text-sm md:text-base text-gray-700 leading-tight drop-shadow-sm">Practice positive self-talk daily</p>
                            </div>
                        </div>

                        {/* Connection Quest */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-32 md:h-48">
                            <div className="absolute inset-0">
                                <img
                                    src="/assets/Communication Quests/Active Listening.png"
                                    alt="Active Listening"
                                    className="w-full h-full object-cover object-left opacity-30"
                                    style={{ objectPosition: '33% center' }}
                                />
                            </div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 md:p-6">
                                <h3 className="font-bricolage text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight drop-shadow-sm">ACTIVE LISTENING</h3>
                                <p className="font-bricolage text-sm md:text-base text-gray-700 leading-tight drop-shadow-sm">Give someone your undivided attention</p>
                            </div>
                        </div>

                        {/* Gratitude Quest */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-32 md:h-48">
                            <div className="absolute inset-0">
                                <img
                                    src="/assets/Communication Quests/Words of Thanks.png"
                                    alt="Words of Thanks"
                                    className="w-full h-full object-cover object-left opacity-30"
                                    style={{ objectPosition: '33% center' }}
                                />
                            </div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 md:p-6">
                                <h3 className="font-bricolage text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight drop-shadow-sm">WORDS OF THANKS</h3>
                                <p className="font-bricolage text-sm md:text-base text-gray-700 leading-tight drop-shadow-sm">Express gratitude to three people today</p>
                            </div>
                        </div>

                        {/* Vision Quest */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-32 md:h-48">
                            <div className="absolute inset-0">
                                <img
                                    src="/assets/Communication Quests/Daily Intentions.png"
                                    alt="Daily Intentions"
                                    className="w-full h-full object-cover object-left opacity-30"
                                    style={{ objectPosition: '33% center' }}
                                />
                            </div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 md:p-6">
                                <h3 className="font-bricolage text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight drop-shadow-sm">DAILY INTENTIONS</h3>
                                <p className="font-bricolage text-sm md:text-base text-gray-700 leading-tight drop-shadow-sm">Set clear communication goals for today</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Challenges Section */}
            <div className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-orange-50/50 to-red-50/50">
                <div className="max-w-7xl mx-auto">
                    {/* Divider */}
                    <div className="text-center mb-8">
                        <img
                            src="/assets/Divider.svg"
                            alt="Divider"
                            className="w-full max-w-md mx-auto"
                        />
                    </div>
                    <div className="text-center mb-12">
                        <h2 className="font-bricolage text-3xl md:text-4xl font-bold text-speech-green mb-4 tracking-wide">
                            Weekly Challenges
                        </h2>
                        <p className="font-bricolage text-xl text-speech-green/70 max-w-2xl mx-auto leading-relaxed tracking-wide">
                            Push your boundaries and achieve communication mastery
                        </p>
                    </div>

                    {/* Mobile: Horizontal scrolling with navigation */}
                    <div className="md:hidden">
                        {/* Navigation Buttons for Mobile */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                className="w-10 h-10 bg-speech-green/10 hover:bg-speech-green/20 rounded-full flex items-center justify-center transition-colors group"
                                onClick={() => {
                                    const container = document.getElementById('challenges-scroll-mobile');
                                    if (container) container.scrollBy({ left: -280, behavior: 'smooth' });
                                }}
                            >
                                <svg className="w-5 h-5 text-speech-green group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                className="w-10 h-10 bg-speech-green/10 hover:bg-speech-green/20 rounded-full flex items-center justify-center transition-colors group"
                                onClick={() => {
                                    const container = document.getElementById('challenges-scroll-mobile');
                                    if (container) container.scrollBy({ left: 280, behavior: 'smooth' });
                                }}
                            >
                                <svg className="w-5 h-5 text-speech-green group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Horizontal Scrolling Container for Mobile */}
                        <div
                            id="challenges-scroll-mobile"
                            className="overflow-x-auto scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <div className="flex gap-4 px-4 pb-4">
                                {/* Public Speaking Challenge */}
                                <div className="flex flex-col relative flex-shrink-0 w-64">
                                    <div className="w-32 h-32 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-6 z-10 border-4 border-white shadow-lg">
                                        <img
                                            src="/assets/Weekly Challenges/Public Speaking.png"
                                            alt="Public Speaking"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 pt-8 border border-orange-200/50 hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center text-sm">Public Speaking</h3>
                                        <p className="text-xs text-speech-green/70 text-center">Present for 5 minutes in front of 3+ people</p>
                                    </div>
                                </div>

                                {/* Voice Recording Challenge */}
                                <div className="flex flex-col relative flex-shrink-0 w-64">
                                    <div className="w-32 h-32 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-6 z-10 border-4 border-white shadow-lg">
                                        <img
                                            src="/assets/Weekly Challenges/Voice Recording.png"
                                            alt="Voice Recording"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 pt-8 border border-red-200/50 hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center text-sm">Voice Recording</h3>
                                        <p className="text-xs text-speech-green/70 text-center">Record and analyze your speech for 30 minutes</p>
                                    </div>
                                </div>

                                {/* Social Connection Challenge */}
                                <div className="flex flex-col relative flex-shrink-0 w-64">
                                    <div className="w-32 h-32 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-6 z-10 border-4 border-white shadow-lg">
                                        <img
                                            src="/assets/Weekly Challenges/Social Connection.png"
                                            alt="Social Connection"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 pt-8 border border-teal-200/50 hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center text-sm">Social Connection</h3>
                                        <p className="text-xs text-speech-green/70 text-center">Have meaningful conversations with 5 new people</p>
                                    </div>
                                </div>

                                {/* Reading Challenge */}
                                <div className="flex flex-col relative flex-shrink-0 w-64">
                                    <div className="w-32 h-32 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-6 z-10 border-4 border-white shadow-lg">
                                        <img
                                            src="/assets/Weekly Challenges/Reading Challenge.png"
                                            alt="Reading Challenge"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 pt-8 border border-violet-200/50 hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center text-sm">Reading Challenge</h3>
                                        <p className="text-xs text-speech-green/70 text-center">Read aloud for 20 minutes daily, 5 days this week</p>
                                    </div>
                                </div>

                                {/* Role Playing Challenge */}
                                <div className="flex flex-col relative flex-shrink-0 w-64">
                                    <div className="w-32 h-32 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-6 z-10 border-4 border-white shadow-lg">
                                        <img
                                            src="/assets/Weekly Challenges/Role Playing.png"
                                            alt="Role Playing"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 pt-8 border border-cyan-200/50 hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center text-sm">Role Playing</h3>
                                        <p className="text-xs text-speech-green/70 text-center">Practice conversations in 3 different scenarios</p>
                                    </div>
                                </div>

                                {/* Precision Practice Challenge */}
                                <div className="flex flex-col relative flex-shrink-0 w-64">
                                    <div className="w-32 h-32 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-6 z-10 border-4 border-white shadow-lg">
                                        <img
                                            src="/assets/Weekly Challenges/Precision Practice.png"
                                            alt="Precision Practice"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 pt-8 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center text-sm">Precision Practice</h3>
                                        <p className="text-xs text-speech-green/70 text-center">Master 10 difficult words or phrases this week</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop: Grid layout */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Public Speaking Challenge */}
                        <div className="flex flex-col relative mb-8">
                            <div className="w-48 h-48 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-8 z-10 border-4 border-white shadow-lg">
                                <img
                                    src="/assets/Weekly Challenges/Public Speaking.png"
                                    alt="Public Speaking"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-[25px] p-6 pt-12 border border-orange-200/50 hover:shadow-lg transition-all duration-300">
                                <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center">Public Speaking</h3>
                                <p className="text-sm text-speech-green/70 text-center">Present for 5 minutes in front of 3+ people</p>
                            </div>
                        </div>

                        {/* Voice Recording Challenge */}
                        <div className="flex flex-col relative mb-8">
                            <div className="w-48 h-48 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-8 z-10 border-4 border-white shadow-lg">
                                <img
                                    src="/assets/Weekly Challenges/Voice Recording.png"
                                    alt="Voice Recording"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-[25px] p-6 pt-12 border border-red-200/50 hover:shadow-lg transition-all duration-300">
                                <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center">Voice Recording</h3>
                                <p className="text-sm text-speech-green/70 text-center">Record and analyze your speech for 30 minutes</p>
                            </div>
                        </div>

                        {/* Social Connection Challenge */}
                        <div className="flex flex-col relative mb-8">
                            <div className="w-48 h-48 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-8 z-10 border-4 border-white shadow-lg">
                                <img
                                    src="/assets/Weekly Challenges/Social Connection.png"
                                    alt="Social Connection"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-[25px] p-6 pt-12 border border-teal-200/50 hover:shadow-lg transition-all duration-300">
                                <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center">Social Connection</h3>
                                <p className="text-sm text-speech-green/70 text-center">Have meaningful conversations with 5 new people</p>
                            </div>
                        </div>

                        {/* Reading Challenge */}
                        <div className="flex flex-col relative">
                            <div className="w-48 h-48 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-8 z-10 border-4 border-white shadow-lg">
                                <img
                                    src="/assets/Weekly Challenges/Reading Challenge.png"
                                    alt="Reading Challenge"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-[25px] p-6 pt-12 border border-violet-200/50 hover:shadow-lg transition-all duration-300">
                                <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center">Reading Challenge</h3>
                                <p className="text-sm text-speech-green/70 text-center">Read aloud for 20 minutes daily, 5 days this week</p>
                            </div>
                        </div>

                        {/* Role Playing Challenge */}
                        <div className="flex flex-col relative">
                            <div className="w-48 h-48 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-8 z-10 border-4 border-white shadow-lg">
                                <img
                                    src="/assets/Weekly Challenges/Role Playing.png"
                                    alt="Role Playing"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-[25px] p-6 pt-12 border border-cyan-200/50 hover:shadow-lg transition-all duration-300">
                                <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center">Role Playing</h3>
                                <p className="text-sm text-speech-green/70 text-center">Practice conversations in 3 different scenarios</p>
                            </div>
                        </div>

                        {/* Precision Practice Challenge */}
                        <div className="flex flex-col relative">
                            <div className="w-48 h-48 bg-speech-bg rounded-full overflow-hidden mx-auto -mb-8 z-10 border-4 border-white shadow-lg">
                                <img
                                    src="/assets/Weekly Challenges/Precision Practice.png"
                                    alt="Precision Practice"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-[25px] p-6 pt-12 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                                <h3 className="font-bricolage font-semibold text-speech-green tracking-wide mb-2 text-center">Precision Practice</h3>
                                <p className="text-sm text-speech-green/70 text-center">Master 10 difficult words or phrases this week</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider before Blog Section */}
                <div className="text-center mt-16 mb-8">
                    <img
                        src="/assets/Divider.svg"
                        alt="Divider"
                        className="w-full max-w-md mx-auto"
                    />
                </div>
            </div>

            {/* Blogs Section */}
            <div className="py-16 px-4 md:px-6 lg:px-8 bg-[#F9E6D0]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-bricolage text-4xl md:text-5xl font-bold text-speech-green mb-6 tracking-wide">
                            Latest from Our Blog
                        </h2>
                        <p className="font-bricolage text-xl text-speech-green/70 max-w-3xl mx-auto leading-relaxed tracking-wide">
                            Stay informed with the latest insights, tips, and research in speech therapy.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {blogLinks.slice(0, 3).map((blog, index) => (
                            <div
                                key={index}
                                onClick={() => window.open(blog.url, '_blank', 'noopener,noreferrer')}
                                className="bg-white rounded-[20px] md:rounded-[30px] p-4 md:p-8 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <div className="mb-4 md:mb-6">
                                    <div className="w-full h-32 md:h-48 bg-speech-bg rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden relative">
                                        {!blogImagesLoaded[index] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-speech-bg">
                                                <div className="text-center">
                                                    <div className="loader mx-auto mb-2"></div>
                                                    <p className="font-bricolage text-xs text-speech-green">Loading...</p>
                                                </div>
                                            </div>
                                        )}
                                        <img
                                            src={`/assets/blog${(index % 3) + 1}.png`}
                                            alt="Speech Therapy Resources"
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${blogImagesLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                                            onLoad={() => setBlogImagesLoaded(prev => ({ ...prev, [index]: true }))}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    {getIcon(blog.type)}
                                    <span className="font-bricolage text-xs md:text-sm font-semibold text-speech-green/70 uppercase tracking-wide">
                                        {blog.type === 'youtube' ? 'YouTube' :
                                            blog.type === 'reddit' ? 'Reddit' :
                                                blog.type === 'journal' ? 'Journal' :
                                                    blog.type === 'community' ? 'Community' :
                                                        blog.type === 'event' ? 'Event' :
                                                            blog.type === 'news' ? 'News' : 'Resource'}
                                    </span>
                                </div>
                                <h3 className="font-bricolage text-lg md:text-xl font-bold text-speech-green mb-3 tracking-wide leading-tight">
                                    {blog.title}
                                </h3>
                                <p className="font-bricolage text-sm text-speech-green/70 mb-4 leading-relaxed tracking-wide line-clamp-3">
                                    {blog.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bricolage text-xs text-speech-green/60 tracking-wide">
                                        {blog.date}
                                    </span>
                                    <div className="flex items-center gap-1 text-speech-green font-semibold">
                                        <span className="font-bricolage text-sm">Visit</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {blogLinks.length > 3 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => navigate('/blog')}
                                className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage font-semibold px-8 py-3 rounded-full tracking-wide transition-all duration-200"
                            >
                                View All Resources →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* Jam and Passages Selector Modal */}
            <JamPassagesSelector
                open={jamPassagesModalOpen}
                onOpenChange={setJamPassagesModalOpen}
            />

            {/* Progress Selector Modal */}
            <ProgressSelector
                open={progressModalOpen}
                onOpenChange={setProgressModalOpen}
            />

            {/* Settings Modal */}
            <Settings
                open={settingsModalOpen}
                onOpenChange={setSettingsModalOpen}
            />
        </div>
    );
}
