/**
 * AI Podcast Page - Voice Conversations with AI Assistants
 *
 * Integrated with VAPI for real-time voice conversations using the new service architecture.
 * Features:
 * - Real-time speech recognition and transcription
 * - Voice responses from AI assistants
 * - Multiple assistant personalities (Therapist, Stutter, Casual, Professional, Creative)
 * - Live conversation interface with modern UI
 */

import React, { useState } from 'react';
import { MessageSquare, Settings } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import VapiConversation from '../src/components/ai/VapiConversation.jsx';

interface SessionData {
    duration: number;
    messages: any[];
    persona: string;
    timestamp: Date;
    id: string;
}

export default function AIPodcast() {
    const [selectedPersona, setSelectedPersona] = useState('therapist');
    const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const personas = [
        {
            id: 'therapist',
            name: 'Speech Therapist',
            description: 'Professional speech therapy specialist'
        },
        {
            id: 'stutter',
            name: 'Stutter Specialist',
            description: 'Specialized stuttering therapy expert'
        },
        {
            id: 'casual',
            name: 'Casual Partner',
            description: 'Friendly everyday conversation partner'
        },
        {
            id: 'professional',
            name: 'Professional Coach',
            description: 'Business and formal communication coach'
        },
        {
            id: 'creative',
            name: 'Creative Partner',
            description: 'Artistic and imaginative conversation partner'
        }
    ];

    const handleSessionEnd = (sessionData: any) => {
        console.log('Session ended:', sessionData);
        setSessionHistory(prev => [...prev, {
            ...sessionData,
            timestamp: new Date(),
            id: `session_${Date.now()}`
        }]);
    };

    const handleError = (error: any) => {
        console.error('AI Conversation error:', error);
    };

    const selectedPersonaData = personas.find(p => p.id === selectedPersona);

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
                {/* Banner Image */}
                <div className="mb-12">
                    <picture>
                        <source media="(max-width: 768px)" srcSet="/banners/AIPodcastMobile.webp" />
                        <img
                            src="/banners/AIPodcast.webp"
                            alt="AI Podcast Banner"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </picture>
                </div>
                {/* Persona Selection */}
                <div className="mb-16">
                    <h2 className="font-bricolage text-3xl md:text-4xl font-bold text-speech-green mb-8 text-center">
                        Choose Your Conversation Partner
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {personas.map((persona) => (
                            <button
                                key={persona.id}
                                onClick={() => setSelectedPersona(persona.id)}
                                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedPersona === persona.id
                                    ? 'border-speech-green bg-speech-green/5 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-speech-green/50'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="w-6 h-6 text-speech-green" />
                                    </div>
                                    <h3 className="font-bricolage font-semibold text-gray-900 mb-2">{persona.name}</h3>
                                    <p className="font-bricolage text-sm text-gray-600 leading-relaxed">{persona.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Persona Info */}
                {selectedPersonaData && (
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-100">
                            <div className="w-10 h-10 bg-speech-green/10 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-speech-green" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bricolage font-semibold text-gray-900">{selectedPersonaData.name}</h3>
                                <p className="font-bricolage text-sm text-gray-600">{selectedPersonaData.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conversation Component */}
                <div className="mb-12">
                    <VapiConversation
                        persona={selectedPersona}
                        onSessionEnd={handleSessionEnd}
                        onError={handleError}
                    />
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-6 text-center">How to Use AI Conversations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-bricolage font-semibold text-gray-900 text-lg">Getting Started</h4>
                            <ul className="font-bricolage text-gray-700 space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Choose your preferred AI assistant persona</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Click "Start Conversation" to begin</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Allow microphone access when prompted</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Speak naturally - the AI will respond with voice</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bricolage font-semibold text-gray-900 text-lg">Best Practices</h4>
                            <ul className="font-bricolage text-gray-700 space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Practice in a quiet environment</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Speak clearly and at a normal pace</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Take breaks as needed</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-speech-green rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Try different personas for varied practice</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>



                {/* Session History */}
                {sessionHistory.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-6 text-center">Recent Sessions</h3>
                        <div className="space-y-4">
                            {sessionHistory.slice(-5).reverse().map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-speech-green/10 rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-speech-green" />
                                        </div>
                                        <div>
                                            <p className="font-bricolage font-semibold text-gray-900">
                                                {personas.find(p => p.id === session.persona)?.name}
                                            </p>
                                            <p className="font-bricolage text-sm text-gray-600">
                                                {session.timestamp.toLocaleDateString()} • {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')} minutes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bricolage text-sm text-gray-600">{session.messages.length} messages</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
