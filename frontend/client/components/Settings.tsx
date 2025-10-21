import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
    Settings as SettingsIcon,
    Volume2,
    VolumeX,
    Mic,
    MicOff,
    Headphones,
    Bell,
    BellOff,
    Monitor,
    Moon,
    Save,
    TestTube,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

interface SettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface AudioSettings {
    volume: number;
    microphoneSensitivity: number;
    headphonesConnected: boolean;
    headphonesTested: boolean;
    notificationsEnabled: boolean;
    darkMode: boolean;
}

export default function Settings({ open, onOpenChange }: SettingsProps) {
    const isMobile = window.innerWidth < 768;
    const audioContextRef = useRef<AudioContext | null>(null);
    const testToneRef = useRef<OscillatorNode | null>(null);

    const [settings, setSettings] = useState<AudioSettings>({
        volume: 75,
        microphoneSensitivity: 60,
        headphonesConnected: false,
        headphonesTested: false,
        notificationsEnabled: true,
        darkMode: false
    });

    const [headphoneTestStatus, setHeadphoneTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
    const [micTestStatus, setMicTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

    // Check for connected audio devices on mount
    useEffect(() => {
        const checkAudioDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasHeadphones = devices.some(device =>
                    device.kind === 'audiooutput' &&
                    device.deviceId !== 'default' &&
                    !device.label.toLowerCase().includes('speaker')
                );
                setSettings(prev => ({ ...prev, headphonesConnected: hasHeadphones }));
            } catch (error) {
                console.error('Error checking audio devices:', error);
            }
        };

        if (open) {
            checkAudioDevices();
        }
    }, [open]);

    // Headphone test function
    const testHeadphones = async () => {
        setHeadphoneTestStatus('testing');

        try {
            // Create audio context if it doesn't exist
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const audioContext = audioContextRef.current;

            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Create a test tone (1000 Hz sine wave)
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume for testing

            testToneRef.current = oscillator;

            // Play test tone for 2 seconds
            oscillator.start();
            setTimeout(() => {
                if (oscillator) {
                    oscillator.stop();
                    testToneRef.current = null;
                }
                setHeadphoneTestStatus('success');
                setSettings(prev => ({ ...prev, headphonesTested: true }));
            }, 2000);

        } catch (error) {
            console.error('Headphone test failed:', error);
            setHeadphoneTestStatus('failed');
        }
    };

    // Stop headphone test
    const stopHeadphoneTest = () => {
        if (testToneRef.current) {
            testToneRef.current.stop();
            testToneRef.current = null;
        }
        setHeadphoneTestStatus('idle');
    };

    // Microphone test function
    const testMicrophone = async () => {
        setMicTestStatus('testing');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            microphone.connect(analyser);
            analyser.fftSize = 256;

            // Monitor audio levels for 3 seconds
            let hasDetectedAudio = false;
            const checkAudio = () => {
                analyser.getByteFrequencyData(dataArray);

                // Check if there's significant audio input
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                if (average > 10) { // Threshold for detecting audio
                    hasDetectedAudio = true;
                }
            };

            const interval = setInterval(checkAudio, 100);

            setTimeout(() => {
                clearInterval(interval);
                stream.getTracks().forEach(track => track.stop());

                if (hasDetectedAudio) {
                    setMicTestStatus('success');
                } else {
                    setMicTestStatus('failed');
                }
            }, 3000);

        } catch (error) {
            console.error('Microphone test failed:', error);
            setMicTestStatus('failed');
        }
    };

    // Save settings
    const saveSettings = () => {
        // Here you would typically save to localStorage or send to backend
        localStorage.setItem('speechAppSettings', JSON.stringify(settings));
        // You could add a toast notification here
        onOpenChange(false);
    };

    const updateSetting = (key: keyof AudioSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const content = (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-speech-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SettingsIcon className="w-8 h-8 text-speech-green" />
                </div>
                <h2 className="font-bricolage text-2xl font-bold text-speech-green mb-2 tracking-wide">
                    Settings
                </h2>
                <p className="font-bricolage text-speech-green/70 tracking-wide">
                    Customize your speech therapy experience
                </p>
            </div>

            {/* Audio Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bricolage text-speech-green">
                        <Volume2 className="w-5 h-5" />
                        Audio Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Volume Control */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="font-bricolage text-sm font-medium text-speech-green">
                                Volume Level
                            </label>
                            <span className="font-bricolage text-sm text-speech-green/70">
                                {settings.volume}%
                            </span>
                        </div>
                        <Slider
                            value={[settings.volume]}
                            onValueChange={(value) => updateSetting('volume', value[0])}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Microphone Sensitivity */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="font-bricolage text-sm font-medium text-speech-green">
                                Microphone Sensitivity
                            </label>
                            <span className="font-bricolage text-sm text-speech-green/70">
                                {settings.microphoneSensitivity}%
                            </span>
                        </div>
                        <Slider
                            value={[settings.microphoneSensitivity]}
                            onValueChange={(value) => updateSetting('microphoneSensitivity', value[0])}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Headphone Check */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Headphones className="w-4 h-4 text-speech-green" />
                                <span className="font-bricolage text-sm font-medium text-speech-green">
                                    Headphones
                                </span>
                            </div>
                            <Badge variant={settings.headphonesConnected ? "default" : "secondary"}>
                                {settings.headphonesConnected ? "Connected" : "Not Connected"}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={headphoneTestStatus === 'testing' ? stopHeadphoneTest : testHeadphones}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                disabled={!settings.headphonesConnected}
                            >
                                {headphoneTestStatus === 'testing' ? (
                                    <>
                                        <TestTube className="w-4 h-4 mr-2 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        <TestTube className="w-4 h-4 mr-2" />
                                        Test Headphones
                                    </>
                                )}
                            </Button>

                            {headphoneTestStatus === 'success' && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {headphoneTestStatus === 'failed' && (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>

                        {headphoneTestStatus === 'success' && (
                            <p className="font-bricolage text-xs text-green-600">
                                ✓ Headphones are working correctly
                            </p>
                        )}
                        {headphoneTestStatus === 'failed' && (
                            <p className="font-bricolage text-xs text-red-600">
                                ✗ Could not detect headphone audio. Check your connection.
                            </p>
                        )}
                    </div>

                    {/* Microphone Test */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Mic className="w-4 h-4 text-speech-green" />
                                <span className="font-bricolage text-sm font-medium text-speech-green">
                                    Microphone Test
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={testMicrophone}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                disabled={micTestStatus === 'testing'}
                            >
                                {micTestStatus === 'testing' ? (
                                    <>
                                        <Mic className="w-4 h-4 mr-2 animate-pulse" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-4 h-4 mr-2" />
                                        Test Microphone
                                    </>
                                )}
                            </Button>

                            {micTestStatus === 'success' && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {micTestStatus === 'failed' && (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>

                        {micTestStatus === 'success' && (
                            <p className="font-bricolage text-xs text-green-600">
                                ✓ Microphone is detecting audio input
                            </p>
                        )}
                        {micTestStatus === 'failed' && (
                            <p className="font-bricolage text-xs text-red-600">
                                ✗ No audio input detected. Check your microphone.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bricolage text-speech-green">
                        <Bell className="w-5 h-5" />
                        Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {settings.notificationsEnabled ? (
                                <Bell className="w-4 h-4 text-speech-green" />
                            ) : (
                                <BellOff className="w-4 h-4 text-speech-green/50" />
                            )}
                            <span className="font-bricolage text-sm font-medium text-speech-green">
                                Notifications
                            </span>
                        </div>
                        <Switch
                            checked={settings.notificationsEnabled}
                            onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
                        />
                    </div>


                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="flex-1 font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white transition-all duration-200"
                >
                    Cancel
                </Button>
                <Button
                    onClick={saveSettings}
                    className="flex-1 bg-speech-green hover:bg-speech-green/90 text-white font-bricolage"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-white max-h-[90vh] overflow-y-auto">
                    <DrawerHeader>
                        <DrawerTitle className="sr-only">Settings</DrawerTitle>
                        <DrawerDescription className="sr-only">Configure your speech therapy settings</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-6 pb-6">
                        {content}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border-speech-green/20 max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="sr-only">Settings</DialogTitle>
                    <DialogDescription className="sr-only">Configure your speech therapy settings</DialogDescription>
                </DialogHeader>
                <div className="px-6">
                    {content}
                </div>
            </DialogContent>
        </Dialog>
    );
}


