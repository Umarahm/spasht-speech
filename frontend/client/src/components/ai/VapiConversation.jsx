import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import vapiService from '../../services/vapiService';

const VapiConversation = ({ persona = 'therapist', onSessionEnd, onError, autoStart = false }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [messages, setMessages] = useState([]);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [error, setError] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

    const sessionStartTime = useRef(null);
    const durationInterval = useRef(null);

    useEffect(() => {
        const initializeVapi = async () => {
            try {
                setIsInitializing(true);
                await vapiService.initialize();
                setupEventListeners();

                if (autoStart) {
                    await startConversation();
                }
            } catch (error) {
                console.error('Failed to initialize VAPI:', error);
                setError('Failed to initialize voice AI. Please check your connection.');
                onError?.(error);
            } finally {
                setIsInitializing(false);
            }
        };

        initializeVapi();

        return () => {
            cleanup();
        };
    }, []);

    const setupEventListeners = () => {
        vapiService.on('call-start', handleCallStart);
        vapiService.on('call-end', handleCallEnd);
        vapiService.on('speech-start', handleSpeechStart);
        vapiService.on('speech-end', handleSpeechEnd);
        vapiService.on('message', handleMessage);
        vapiService.on('transcript', handleTranscript);
        vapiService.on('speech-update', handleSpeechUpdate);
        vapiService.on('volume-level', handleVolumeLevel);
        vapiService.on('error', handleVapiError);
    };

    const cleanup = () => {
        if (durationInterval.current) {
            clearInterval(durationInterval.current);
        }
        // Remove all event listeners
        vapiService.off('call-start', handleCallStart);
        vapiService.off('call-end', handleCallEnd);
        vapiService.off('speech-start', handleSpeechStart);
        vapiService.off('speech-end', handleSpeechEnd);
        vapiService.off('message', handleMessage);
        vapiService.off('transcript', handleTranscript);
        vapiService.off('speech-update', handleSpeechUpdate);
        vapiService.off('volume-level', handleVolumeLevel);
        vapiService.off('error', handleVapiError);
    };

    const handleCallStart = () => {
        console.log('Call started - VAPI connection established');
        setIsConnected(true);
        setError(null);
        sessionStartTime.current = Date.now();
        durationInterval.current = setInterval(() => {
            setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
        }, 1000);

        // Test audio context
        if (typeof window !== 'undefined' && window.AudioContext) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('Audio context state:', audioContext.state);
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        console.log('Audio context resumed');
                    });
                }
            } catch (error) {
                console.error('Audio context error:', error);
            }
        }
    };

    const handleCallEnd = (data) => {
        console.log('Call ended:', data);
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
        setVolumeLevel(0);

        if (durationInterval.current) {
            clearInterval(durationInterval.current);
        }

        const sessionData = {
            duration: sessionDuration,
            messages: messages,
            persona: persona,
            endReason: data?.reason || 'unknown'
        };

        onSessionEnd?.(sessionData);
    };

    const handleSpeechStart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
    };

    const handleMessage = (message) => {
        console.log('New message:', message);
        setMessages(prev => [...prev, message]);
    };

    const handleTranscript = (transcript) => {
        console.log('Transcript:', transcript);
        // Handle partial transcripts - update existing partial message or add new one
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];

            if (lastMessage && lastMessage.isPartial && lastMessage.sender === 'user') {
                // Update existing partial message
                lastMessage.text = transcript.text;
            } else {
                // Add new partial message
                newMessages.push(transcript);
            }
            return newMessages;
        });
    };

    const handleSpeechUpdate = (speechUpdate) => {
        console.log('Speech update:', speechUpdate);
        // Handle AI speech updates
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];

            if (lastMessage && lastMessage.isPartial && lastMessage.sender === 'ai') {
                // Update existing partial AI message
                lastMessage.text = speechUpdate.text;
            } else {
                // Add new partial AI message
                newMessages.push(speechUpdate);
            }
            return newMessages;
        });
    };

    const handleVolumeLevel = (level) => {
        setVolumeLevel(level);
    };

    const handleVapiError = (error) => {
        console.error('VAPI error:', error);
        
        // Extract user-friendly error message
        let errorMessage = 'Voice AI error occurred. Please try again.';
        
        if (error && typeof error === 'object') {
            // Prioritize parsed error messages
            if (error.message) {
                errorMessage = error.message;
            } else if (error.body?.message) {
                errorMessage = error.body.message;
            } else if (error.body?.error) {
                errorMessage = error.body.error;
            } else if (error.apiError?.message) {
                errorMessage = error.apiError.message;
            } else if (error.type === 'start-method-error') {
                // Specific handling for start-method-error
                if (error.status && error.statusText) {
                    // Error has been processed, use status info
                    if (error.status === 401) {
                        errorMessage = 'Authentication failed. Please check your VAPI public key.';
                    } else if (error.status === 403) {
                        errorMessage = 'Access denied. Please check your VAPI credentials and permissions.';
                    } else if (error.status === 404) {
                        errorMessage = 'Workflow or endpoint not found. Please check your VAPI workflow ID.';
                    } else if (error.status === 422) {
                        errorMessage = 'Invalid configuration. Please check your VAPI settings.';
                    } else if (error.status >= 500) {
                        errorMessage = 'VAPI server error. Please try again later.';
                    } else {
                        errorMessage = `Failed to start conversation (${error.status}). Please check your VAPI configuration.`;
                    }
                } else if (error.error instanceof Response) {
                    errorMessage = `Failed to start conversation (${error.error.status}). Please check your VAPI configuration and credentials.`;
                } else {
                    errorMessage = 'Failed to start conversation. Please check your VAPI configuration and try again.';
                }
            } else if (error.status && error.statusText) {
                // Handle error objects with status fields
                errorMessage = `Server error (${error.status}: ${error.statusText})`;
            } else if (error instanceof Response) {
                // Direct Response object (shouldn't happen with processed errors, but handle it)
                errorMessage = `Connection error (${error.status}: ${error.statusText}). Please check your VAPI configuration.`;
            }
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        setError(errorMessage);
        onError?.(error);
    };

    const startConversation = async () => {
        try {
            setError(null);

            // Check microphone permissions
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    console.log('Requesting microphone permission...');
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    console.log('Microphone permission granted');
                    stream.getTracks().forEach(track => track.stop()); // Stop the test stream
                } catch (micError) {
                    console.error('Microphone permission denied:', micError);
                    setError('Microphone access is required for voice conversations. Please allow microphone permissions and try again.');
                    return;
                }
            }

            // Check audio context
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('Audio context created, state:', audioContext.state);
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                    console.log('Audio context resumed');
                }
            } catch (audioError) {
                console.error('Audio context error:', audioError);
            }

            console.log('Starting VAPI conversation...');
            await vapiService.startConversation(persona);
            console.log('VAPI conversation started successfully');
        } catch (error) {
            console.error('Failed to start conversation:', error);
            setError('Failed to start conversation. Please check your microphone permissions and try again.');
            onError?.(error);
        }
    };

    const endConversation = async () => {
        try {
            await vapiService.endConversation();
        } catch (error) {
            console.error('Failed to end conversation:', error);
        }
    };

    const toggleMute = () => {
        // Note: VAPI doesn't have a direct mute method, this would need to be implemented
        // based on VAPI's API capabilities
        setIsMuted(!isMuted);
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isInitializing) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="loader mx-auto mb-4"></div>
                    <p className="font-bricolage text-gray-600">Initializing voice AI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-speech-green' : 'bg-gray-400'}`}></div>
                        <span className="font-bricolage font-semibold text-gray-900">
                            {persona.charAt(0).toUpperCase() + persona.slice(1)} Assistant
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                        {isConnected && <span className="font-bricolage">{formatDuration(sessionDuration)}</span>}
                        <button
                            onClick={toggleMute}
                            className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'}`}
                            title="Mute/Unmute (Note: This feature is not fully implemented yet)"
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button
                            onClick={() => {
                                console.log('=== AUDIO DEBUG INFO ===');
                                console.log('VAPI Service initialized:', vapiService.isServiceInitialized());
                                console.log('VAPI Service connected:', vapiService.isServiceConnected());
                                console.log('Is connected:', isConnected);
                                console.log('Is listening:', isListening);
                                console.log('Is speaking:', isSpeaking);
                                console.log('Volume level:', volumeLevel);
                                if (typeof window !== 'undefined') {
                                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                                    console.log('Audio context state:', audioContext.state);
                                }
                                navigator.mediaDevices.enumerateDevices().then(devices => {
                                    const audioInputs = devices.filter(device => device.kind === 'audioinput');
                                    console.log('Available audio input devices:', audioInputs.length);
                                    audioInputs.forEach((device, index) => {
                                        console.log(`Device ${index + 1}: ${device.label || 'Unknown device'}`);
                                    });
                                });
                                alert('Debug information logged to console. Check browser console for details.');
                            }}
                            className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-50"
                            title="Debug audio information"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && !isConnected && (
                    <div className="text-center text-gray-500 py-12">
                        <p className="font-bricolage text-lg">Click start to begin your conversation</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-3 rounded-2xl ${message.sender === 'user'
                                ? 'bg-speech-green text-white'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                } ${message.isPartial ? 'opacity-70 italic' : ''}`}
                        >
                            <p className="font-bricolage text-sm leading-relaxed">{message.text}</p>
                            {message.isPartial && (
                                <span className="text-xs opacity-60">typing...</span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Visual indicators */}
                {isSpeaking && (
                    <div className="flex justify-start">
                        <div className="bg-speech-green/10 border border-speech-green/20 text-speech-green px-4 py-3 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-speech-green rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-speech-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-speech-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="font-bricolage text-sm font-medium">AI is speaking...</span>
                            </div>
                        </div>
                    </div>
                )}

                {isListening && (
                    <div className="flex justify-end">
                        <div className="bg-speech-green/10 border border-speech-green/20 text-speech-green px-4 py-3 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <Mic size={16} className="animate-pulse" />
                                <span className="font-bricolage text-sm font-medium">Listening...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-gray-100">
                <div className="flex justify-center">
                    {!isConnected ? (
                        <button
                            onClick={startConversation}
                            className="flex items-center space-x-3 bg-speech-green hover:bg-speech-green/90 text-white px-8 py-4 rounded-full font-bricolage font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            <Phone size={20} />
                            <span>Start Conversation</span>
                        </button>
                    ) : (
                        <button
                            onClick={endConversation}
                            className="flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bricolage font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            <PhoneOff size={20} />
                            <span>End Call</span>
                        </button>
                    )}
                </div>

                {/* Volume indicator */}
                {volumeLevel > 0 && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-8 rounded-lg transition-colors ${i < Math.floor(volumeLevel * 5) ? 'bg-speech-green' : 'bg-gray-300'
                                        }`}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error display */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                        <p className="font-bricolage text-sm text-center">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VapiConversation;
