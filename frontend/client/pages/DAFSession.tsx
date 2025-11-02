import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Mic, MicOff, RotateCcw, Volume2, Headphones } from 'lucide-react';

export default function DAFSession() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [currentPassage, setCurrentPassage] = useState('Click "New Passage" to generate your reading material.');
    const [isGeneratingPassage, setIsGeneratingPassage] = useState(false);
    const [headphonesConnected, setHeadphonesConnected] = useState<boolean | null>(null);
    const [showHeadphonesWarning, setShowHeadphonesWarning] = useState(false);

    // Audio-related state
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const [wordsRead, setWordsRead] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [spectrogramData, setSpectrogramData] = useState<number[]>([]);
    const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
    const [audioError, setAudioError] = useState<string | null>(null);
    const [dafDelayNode, setDafDelayNode] = useState<DelayNode | null>(null);
    const [dafGainNode, setDafGainNode] = useState<GainNode | null>(null);
    const [dafFilterNode, setDafFilterNode] = useState<BiquadFilterNode | null>(null);
    const [dafSourceNode, setDafSourceNode] = useState<MediaStreamAudioSourceNode | null>(null);

    // DAF parameters
    const [dafDelay, setDafDelay] = useState(150); // milliseconds - now configurable
    const DAF_FEEDBACK_GAIN = 0.7; // volume of feedback

    // Helper function to format duration
    const formatDuration = (startTime: Date | null) => {
        if (!startTime) return '00:00:00';

        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    };

    // Update session stats periodically
    useEffect(() => {
        if (!isRecording || !sessionStartTime) return;

        const interval = setInterval(() => {
            // Force re-render for duration update
            setWordsRead(prev => prev);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRecording, sessionStartTime]);

    // Update DAF delay in real-time when changed during recording
    useEffect(() => {
        if (dafDelayNode && isRecording && audioContext) {
            try {
                dafDelayNode.delayTime.setValueAtTime(dafDelay / 1000, audioContext.currentTime);
            } catch (error) {
                console.warn('Error updating delay time:', error);
            }
        }
    }, [dafDelay, dafDelayNode, isRecording, audioContext]);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Generate random reading passage
    const generatePassage = async () => {
        setIsGeneratingPassage(true);
        try {
            const response = await apiFetch('/api/generate-passage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    difficulty: 'intermediate',
                    topic: 'general'
                })
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentPassage(data.passage);
            } else {
                // Fallback passage if API fails
                setCurrentPassage("The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Speech therapists often use such sentences to practice articulation and fluency.");
            }
        } catch (error) {
            console.error('Failed to generate passage:', error);
            // Fallback passage
            setCurrentPassage("The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Speech therapists often use such sentences to practice articulation and fluency.");
        } finally {
            setIsGeneratingPassage(false);
        }
    };

    // Check for headphones connection
    const checkHeadphones = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

            // Check if there are any audio output devices (headphones/speakers)
            const hasHeadphones = audioOutputs.length > 1; // More than just default speakers
            setHeadphonesConnected(hasHeadphones);

            if (!hasHeadphones) {
                setShowHeadphonesWarning(true);
            }
        } catch (error) {
            console.error('Error checking headphones:', error);
            setHeadphonesConnected(false);
            setShowHeadphonesWarning(true);
        }
    };

    // Initialize audio context and microphone
    const initializeAudio = async () => {
        try {
            setAudioError(null);

            // Check if Web Audio API is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Web Audio API is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
            }

            // Request microphone permission using utility function
            const { requestMicrophonePermission } = await import('@/utils/microphonePermission');
            const result = await requestMicrophonePermission({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    sampleRate: 44100,
                    channelCount: 1
                }
            });

            if (!result.success || !result.stream) {
                setAudioError(result.error || 'Microphone access failed');
                setMicPermissionGranted(false);
                alert(result.error || 'Microphone access is required for DAF sessions.');
                return false;
            }

            const stream = result.stream;
            setMicPermissionGranted(true);

            // Create audio context
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Create analyser for spectrogram
            const analyserNode = ctx.createAnalyser();
            analyserNode.fftSize = 2048;
            analyserNode.smoothingTimeConstant = 0.8;

            // Connect microphone to analyser
            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyserNode);

            setAudioContext(ctx);
            setMicrophoneStream(stream);
            setAnalyser(analyserNode);

            return true;
        } catch (error: any) {
            console.error('Error initializing audio:', error);

            let errorMessage = 'Microphone access is required for DAF sessions. ';

            if (error.name === 'NotAllowedError') {
                errorMessage += 'Please allow microphone permissions in your browser settings and try again.';
                setMicPermissionGranted(false);
            } else if (error.name === 'NotFoundError') {
                errorMessage += 'No microphone found. Please connect a microphone and try again.';
            } else if (error.name === 'NotReadableError') {
                errorMessage += 'Microphone is already in use by another application. Please close other audio applications and try again.';
            } else {
                errorMessage += error.message || 'Please check your audio settings and try again.';
            }

            setAudioError(errorMessage);
            setMicPermissionGranted(false);
            alert(errorMessage);
            return false;
        }
    };

    // Create DAF feedback loop with delay
    const createDAFFeedback = (context: AudioContext, stream: MediaStream) => {
        const source = context.createMediaStreamSource(stream);

        // Create delay node for DAF effect
        const delayNode = context.createDelay(1.0); // Max 1 second delay
        delayNode.delayTime.value = dafDelay / 1000;

        // Create gain node to control feedback volume
        const gainNode = context.createGain();
        gainNode.gain.value = DAF_FEEDBACK_GAIN;

        // Create low-pass filter to simulate slight frequency shift (optional DAF variant)
        const filterNode = context.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 3000; // Slight high-frequency rolloff

        // Connect the DAF chain: source -> delay -> filter -> gain -> destination
        source.connect(delayNode);
        delayNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(context.destination);

        // Store references for cleanup
        setDafSourceNode(source);
        setDafDelayNode(delayNode);
        setDafGainNode(gainNode);
        setDafFilterNode(filterNode);

        return { delayNode, gainNode, filterNode };
    };

    // Update spectrogram data
    const updateSpectrogram = () => {
        if (!analyser) return;

        try {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            // Convert to array and update state
            const normalizedData = Array.from(dataArray).map(value => value / 255);
            setSpectrogramData(normalizedData);
        } catch (error) {
            console.error('Error updating spectrogram:', error);
        }
    };

    // Start DAF session
    const startRecording = async () => {
        // Check headphones before starting
        if (headphonesConnected === false) {
            setShowHeadphonesWarning(true);
            return;
        }

        const initialized = await initializeAudio();
        if (!initialized) return;

        if (audioContext && microphoneStream) {
            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Create DAF feedback loop
            createDAFFeedback(audioContext, microphoneStream);

            setIsRecording(true);
            setSessionStartTime(new Date());

            // Start spectrogram updates immediately
            updateSpectrogram(); // Initial update
            const updateInterval = setInterval(updateSpectrogram, 50);

            // Store interval ID for cleanup
            (window as any).spectrogramInterval = updateInterval;
        }
    };

    // Stop DAF session
    const stopRecording = () => {
        setIsRecording(false);
        setAudioError(null);

        // Stop spectrogram updates
        if ((window as any).spectrogramInterval) {
            clearInterval((window as any).spectrogramInterval);
        }

        // Disconnect DAF audio nodes to stop feedback
        try {
            if (dafSourceNode && dafDelayNode) {
                dafSourceNode.disconnect(dafDelayNode);
            }
            if (dafDelayNode && dafFilterNode) {
                dafDelayNode.disconnect(dafFilterNode);
            }
            if (dafFilterNode && dafGainNode) {
                dafFilterNode.disconnect(dafGainNode);
            }
            if (dafGainNode && audioContext) {
                dafGainNode.disconnect(audioContext.destination);
            }
        } catch (error) {
            console.warn('Error disconnecting audio nodes:', error);
        }

        // Clean up audio resources
        if (microphoneStream) {
            microphoneStream.getTracks().forEach(track => track.stop());
            setMicrophoneStream(null);
        }

        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close();
            setAudioContext(null);
        }

        // Reset all audio node references
        setAnalyser(null);
        setSpectrogramData([]);
        setSessionStartTime(null);
        setMicPermissionGranted(null); // Reset for next session
        setDafDelayNode(null);
        setDafGainNode(null);
        setDafFilterNode(null);
        setDafSourceNode(null);
    };

    useEffect(() => {
        checkHeadphones();
    }, []);

    if (!user) {
        return null;
    }

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
                        <source media="(max-width: 768px)" srcSet="/banners/DAFMobile.webp" />
                        <img
                            src="/banners/DAF.webp"
                            alt="DAF Session Banner"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </picture>
                </div>

                {/* Headphones Warning Modal */}
                {showHeadphonesWarning && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-[30px] p-8 max-w-md w-full mx-4 shadow-2xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Headphones className="w-8 h-8 text-speech-green" />
                                </div>
                                <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-4 tracking-wide">
                                    Headphones Required
                                </h3>
                                <p className="font-bricolage text-lg text-speech-green/80 mb-6 leading-relaxed">
                                    For the best DAF experience, please connect headphones. This ensures you receive clear audio feedback without interference.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            setShowHeadphonesWarning(false);
                                            checkHeadphones(); // Re-check headphones
                                        }}
                                        className="flex-1 bg-speech-green hover:bg-speech-green/90 text-white font-bricolage font-semibold py-3 rounded-full tracking-wide"
                                    >
                                        Check Again
                                    </Button>
                                    <Button
                                        onClick={() => setShowHeadphonesWarning(false)}
                                        variant="outline"
                                        className="flex-1 border-speech-green text-speech-green hover:bg-speech-green hover:text-white font-bricolage font-semibold py-3 rounded-full tracking-wide"
                                    >
                                        Continue Anyway
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero Background */}
                {/* <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/assets/homepage/Tiles/Tile for DAF.svg"
                            alt="DAF Session Background"
                            className="w-full h-full object-cover object-center opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-speech-green/20 to-speech-bg/80"></div>
                    </div>

                    <div className="relative z-10 text-center px-4 md:px-6 lg:px-8">
                        <h1 className="font-bricolage text-4xl md:text-5xl lg:text-6xl font-bold text-speech-green mb-4 tracking-wide">
                            DAF Session
                        </h1>
                        <p className="font-bricolage text-xl md:text-2xl text-speech-green/80 max-w-3xl mx-auto leading-relaxed tracking-wide">
                            Digital Auditory Feedback Training with Real-time Analysis
                        </p>
                    </div>
                </div> */}

                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Session Area */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Reading Passage */}
                            <Card className="bg-white shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="font-bricolage text-2xl text-speech-green">
                                            Reading Passage
                                        </CardTitle>
                                        <Button
                                            onClick={generatePassage}
                                            disabled={isGeneratingPassage}
                                            variant="outline"
                                            className="font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isGeneratingPassage ? 'Generating...' : 'New Passage'}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-speech-bg rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center">
                                        {isGeneratingPassage ? (
                                            <div className="text-center">
                                                <div className="loader mx-auto mb-4"></div>
                                                <p className="font-bricolage text-lg text-speech-green/80">
                                                    Generating passage...
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="font-bricolage text-lg leading-relaxed text-speech-green/80 text-center">
                                                {currentPassage}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Spectrogram Placeholder */}
                            <Card className="bg-white shadow-lg">
                                <CardHeader>
                                    <CardTitle className="font-bricolage text-2xl text-speech-green flex items-center gap-2">
                                        <Volume2 className="w-6 h-6" />
                                        Real-time Spectrogram
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-black rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                                        {isRecording && spectrogramData.length > 0 ? (
                                            <div className="w-full h-full flex items-end justify-center space-x-1">
                                                {spectrogramData.slice(0, 64).map((value, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-speech-green rounded-sm min-w-[2px] transition-all duration-75"
                                                        style={{
                                                            height: `${Math.max(value * 180, 2)}px`,
                                                            opacity: value > 0.1 ? 1 : 0.3
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="font-bricolage text-white text-lg">
                                                {isRecording ? 'Initializing spectrogram...' : 'Spectrogram visualization will appear here during recording'}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Controls Panel */}
                        <div className="space-y-6">
                            {/* Recording Controls */}
                            <Card className="bg-white shadow-lg">
                                <CardHeader>
                                    <CardTitle className="font-bricolage text-xl text-speech-green">
                                        Session Controls
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Headphones Status */}
                                    <div className="flex items-center justify-between p-3 bg-speech-bg/50 rounded-xl">
                                        <div className="flex items-center space-x-2">
                                            <Headphones className="w-5 h-5 text-speech-green" />
                                            <span className="font-bricolage text-sm font-semibold text-speech-green">
                                                Audio Output
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${headphonesConnected === true
                                                ? 'bg-green-500'
                                                : headphonesConnected === false
                                                    ? 'bg-red-500'
                                                    : 'bg-yellow-500'
                                                }`} />
                                            <span className="font-bricolage text-xs text-speech-green/70">
                                                {headphonesConnected === true
                                                    ? 'Headphones'
                                                    : headphonesConnected === false
                                                        ? 'Speakers'
                                                        : 'Checking...'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Microphone Status */}
                                    <div className="flex items-center justify-between p-3 bg-speech-bg/50 rounded-xl">
                                        <div className="flex items-center space-x-2">
                                            <Mic className="w-5 h-5 text-speech-green" />
                                            <span className="font-bricolage text-sm font-semibold text-speech-green">
                                                Microphone
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${micPermissionGranted === true
                                                ? 'bg-green-500'
                                                : micPermissionGranted === false
                                                    ? 'bg-red-500'
                                                    : 'bg-yellow-500'
                                                }`} />
                                            <span className="font-bricolage text-xs text-speech-green/70">
                                                {micPermissionGranted === true
                                                    ? 'Ready'
                                                    : micPermissionGranted === false
                                                        ? 'Access Denied'
                                                        : 'Checking...'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Audio Error Display */}
                                    {audioError && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                            <p className="font-bricolage text-sm text-red-700">
                                                {audioError}
                                            </p>
                                        </div>
                                    )}

                                    {/* DAF Delay Controls */}
                                    <div className="p-3 bg-speech-bg/50 rounded-xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bricolage text-sm font-semibold text-speech-green">
                                                DAF Delay
                                            </span>
                                            <span className="font-bricolage text-sm text-speech-green/70">
                                                {dafDelay}ms
                                            </span>
                                        </div>
                                        <Slider
                                            value={[dafDelay]}
                                            onValueChange={(value) => setDafDelay(value[0])}
                                            max={500}
                                            min={50}
                                            step={25}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-speech-green/60">
                                            <span>50ms</span>
                                            <span>500ms</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            className={`flex-1 font-bricolage text-lg py-3 ${isRecording
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-speech-green hover:bg-speech-green/90'
                                                }`}
                                        >
                                            {isRecording ? (
                                                <>
                                                    <MicOff className="w-5 h-5 mr-2" />
                                                    Stop Session
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="w-5 h-5 mr-2" />
                                                    Start Session
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => setIsRecording(false)}
                                            variant="outline"
                                            className="font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Session Stats */}
                            <Card className="bg-white shadow-lg">
                                <CardHeader>
                                    <CardTitle className="font-bricolage text-xl text-speech-green">
                                        Session Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-speech-green/70">Duration</span>
                                        <span className="font-semibold text-speech-green">
                                            {formatDuration(sessionStartTime)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-speech-green/70">Words Read</span>
                                        <span className="font-semibold text-speech-green">
                                            {isRecording ? Math.floor((Date.now() - (sessionStartTime?.getTime() || 0)) / 1000 / 2) : 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-speech-green/70">Audio Level</span>
                                        <span className="font-semibold text-speech-green">
                                            {isRecording && spectrogramData.length > 0
                                                ? `${Math.round(spectrogramData.reduce((a, b) => a + b, 0) / spectrogramData.length * 100)}%`
                                                : '0%'
                                            }
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}