import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, ChevronDown, Headphones, Mic, BarChart3, Settings, BookOpen } from "lucide-react";
import { useAuthContext } from "../components/auth/AuthProvider";
import { useState, useEffect, useRef } from "react";
import Profile from "./Profile";

interface DashboardHeaderProps {
    showFeatureSelector?: boolean;
    currentFeature?: string;
    dailyStreak?: number;
}

export default function DashboardHeader({ showFeatureSelector = false, currentFeature = "", dailyStreak = 0 }: DashboardHeaderProps) {
    const { logout, user } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [showFeatureMenu, setShowFeatureMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowFeatureMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const features = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: BarChart3,
            description: "Overview and progress"
        },
        {
            name: "DAF Training",
            path: "/daf-session",
            icon: Headphones,
            description: "Digital auditory feedback"
        },
        {
            name: "Speech Analysis",
            path: "/speech-analysis",
            icon: Mic,
            description: "Analyze speech patterns"
        },
        {
            name: "Therapy Sessions",
            path: "/therapy-sessions",
            icon: Settings,
            description: "Guided therapy sessions"
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="w-full px-2 py-4 md:px-4 lg:px-6 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center">
                        <Link
                            to="/dashboard"
                            className="font-bricolage text-4xl md:text-5xl font-bold text-speech-green tracking-wide capitalize"
                        >
                            Spasht
                        </Link>
                    </div>

                    {/* Feature Selector */}
                    {showFeatureSelector && (
                        <div className="flex-1 max-w-md mx-8">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowFeatureMenu(!showFeatureMenu)}
                                    className="w-full bg-speech-bg/50 hover:bg-speech-bg border border-speech-green/20 rounded-full px-6 py-3 flex items-center justify-between transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        {(() => {
                                            const currentFeatureData = features.find(f => f.name === currentFeature);
                                            if (currentFeatureData) {
                                                const IconComponent = currentFeatureData.icon;
                                                return (
                                                    <>
                                                        <IconComponent className="w-5 h-5 text-speech-green" />
                                                        <span className="font-bricolage text-lg font-semibold text-speech-green tracking-wide">
                                                            {currentFeature}
                                                        </span>
                                                    </>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-speech-green transition-transform ${showFeatureMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Feature Menu Dropdown */}
                                {showFeatureMenu && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        {features.map((feature) => {
                                            const IconComponent = feature.icon;
                                            return (
                                                <button
                                                    key={feature.path}
                                                    onClick={() => {
                                                        navigate(feature.path);
                                                        setShowFeatureMenu(false);
                                                    }}
                                                    className={`w-full px-6 py-4 flex items-center space-x-3 hover:bg-speech-bg/30 transition-colors text-left ${location.pathname === feature.path ? 'bg-speech-green/10' : ''
                                                        }`}
                                                >
                                                    <IconComponent className="w-5 h-5 text-speech-green flex-shrink-0" />
                                                    <div>
                                                        <div className="font-bricolage font-semibold text-speech-green tracking-wide">
                                                            {feature.name}
                                                        </div>
                                                        <div className="font-bricolage text-sm text-speech-green/70">
                                                            {feature.description}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* User Info & Blog & Logout */}
                    <div className="flex items-center space-x-4">
                        {/* Blog Button */}
                        <Button
                            asChild
                            variant="outline"
                            className="bg-white hover:bg-speech-bg border-speech-green text-speech-green hover:text-speech-green font-bricolage text-lg font-semibold px-4 py-3 rounded-full tracking-wide transition-all duration-200 flex items-center space-x-2"
                        >
                            <Link to="/blog">
                                <BookOpen size={18} />
                                <span className="hidden lg:inline">Resources</span>
                            </Link>
                        </Button>

                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 mb-1">
                                    <img
                                        src="/assets/daily_streak_icon.svg"
                                        alt="Daily Streak"
                                        className="w-5 h-5"
                                    />
                                    <span className="font-bricolage text-sm text-orange-600 font-semibold tracking-wide">
                                        {dailyStreak} day streak
                                    </span>
                                </div>
                            </div>

                            {/* Profile Component */}
                            <Profile />
                        </div>

                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="bg-white hover:bg-speech-bg border-speech-green text-speech-green hover:text-speech-green font-bricolage text-lg font-semibold px-6 py-3 rounded-full tracking-wide capitalize transition-all duration-200 flex items-center space-x-2"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}