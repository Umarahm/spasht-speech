import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Mic, MicOff, Volume2, Play, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

interface LetterWordItem {
    id: string;
    text: string;
    language: 'english' | 'hindi';
    audioUrl?: string;
}

interface MCQQuestion {
    id: string;
    question: string;
    language: 'english' | 'hindi';
    options: string[];
    correctAnswer: number;
    soundFile?: string;
}

export default function SpeechTherapy() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('repetition');
    const [isRecording, setIsRecording] = useState(false);
    const [currentItem, setCurrentItem] = useState<LetterWordItem | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'close' | 'wrong' | null>(null);
    const [score, setScore] = useState(0);
    const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
    const [selectedSoundIndex, setSelectedSoundIndex] = useState<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Ensure speech synthesis voices are loaded
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
            }
        };

        loadVoices();
        // Some browsers load voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // English and Hindi letters and words for repetition
    const englishLetters: LetterWordItem[] = [
        { id: 'a', text: 'A', language: 'english' },
        { id: 'b', text: 'B', language: 'english' },
        { id: 'c', text: 'C', language: 'english' },
        { id: 'd', text: 'D', language: 'english' },
        { id: 'e', text: 'E', language: 'english' },
        { id: 'f', text: 'F', language: 'english' },
        { id: 'g', text: 'G', language: 'english' },
        { id: 'h', text: 'H', language: 'english' },
        { id: 'i', text: 'I', language: 'english' },
        { id: 'j', text: 'J', language: 'english' },
        { id: 'k', text: 'K', language: 'english' },
        { id: 'l', text: 'L', language: 'english' },
        { id: 'm', text: 'M', language: 'english' },
        { id: 'n', text: 'N', language: 'english' },
        { id: 'o', text: 'O', language: 'english' },
        { id: 'p', text: 'P', language: 'english' },
        { id: 'q', text: 'Q', language: 'english' },
        { id: 'r', text: 'R', language: 'english' },
        { id: 's', text: 'S', language: 'english' },
        { id: 't', text: 'T', language: 'english' },
        { id: 'u', text: 'U', language: 'english' },
        { id: 'v', text: 'V', language: 'english' },
        { id: 'w', text: 'W', language: 'english' },
        { id: 'x', text: 'X', language: 'english' },
        { id: 'y', text: 'Y', language: 'english' },
        { id: 'z', text: 'Z', language: 'english' },
    ];

    const englishWords: LetterWordItem[] = [
        { id: 'cat', text: 'Cat', language: 'english' },
        { id: 'dog', text: 'Dog', language: 'english' },
        { id: 'sun', text: 'Sun', language: 'english' },
        { id: 'moon', text: 'Moon', language: 'english' },
        { id: 'tree', text: 'Tree', language: 'english' },
        { id: 'house', text: 'House', language: 'english' },
        { id: 'water', text: 'Water', language: 'english' },
        { id: 'bread', text: 'Bread', language: 'english' },
        { id: 'apple', text: 'Apple', language: 'english' },
        { id: 'school', text: 'School', language: 'english' },
    ];

    const hindiLetters: LetterWordItem[] = [
        { id: 'अ', text: 'अ', language: 'hindi' },
        { id: 'आ', text: 'आ', language: 'hindi' },
        { id: 'इ', text: 'इ', language: 'hindi' },
        { id: 'ई', text: 'ई', language: 'hindi' },
        { id: 'उ', text: 'उ', language: 'hindi' },
        { id: 'ऊ', text: 'ऊ', language: 'hindi' },
        { id: 'ए', text: 'ए', language: 'hindi' },
        { id: 'ऐ', text: 'ऐ', language: 'hindi' },
        { id: 'ओ', text: 'ओ', language: 'hindi' },
        { id: 'औ', text: 'औ', language: 'hindi' },
        { id: 'क', text: 'क', language: 'hindi' },
        { id: 'ख', text: 'ख', language: 'hindi' },
        { id: 'ग', text: 'ग', language: 'hindi' },
        { id: 'घ', text: 'घ', language: 'hindi' },
        { id: 'च', text: 'च', language: 'hindi' },
        { id: 'छ', text: 'छ', language: 'hindi' },
        { id: 'ज', text: 'ज', language: 'hindi' },
        { id: 'झ', text: 'झ', language: 'hindi' },
        { id: 'ट', text: 'ट', language: 'hindi' },
        { id: 'ठ', text: 'ठ', language: 'hindi' },
    ];

    const hindiWords: LetterWordItem[] = [
        { id: 'बिल्ली', text: 'बिल्ली', language: 'hindi' },
        { id: 'कुत्ता', text: 'कुत्ता', language: 'hindi' },
        { id: 'सूरज', text: 'सूरज', language: 'hindi' },
        { id: 'चाँद', text: 'चाँद', language: 'hindi' },
        { id: 'पेड़', text: 'पेड़', language: 'hindi' },
        { id: 'घर', text: 'घर', language: 'hindi' },
        { id: 'पानी', text: 'पानी', language: 'hindi' },
        { id: 'रोटी', text: 'रोटी', language: 'hindi' },
        { id: 'सेब', text: 'सेब', language: 'hindi' },
        { id: 'स्कूल', text: 'स्कूल', language: 'hindi' },
    ];

    // Hindi Matras and common combinations
    const hindiMatras: LetterWordItem[] = [
        { id: 'अ', text: 'अ', language: 'hindi' },
        { id: 'आ', text: 'आ', language: 'hindi' },
        { id: 'इ', text: 'इ', language: 'hindi' },
        { id: 'ई', text: 'ई', language: 'hindi' },
        { id: 'उ', text: 'उ', language: 'hindi' },
        { id: 'ऊ', text: 'ऊ', language: 'hindi' },
        { id: 'ए', text: 'ए', language: 'hindi' },
        { id: 'ऐ', text: 'ऐ', language: 'hindi' },
        { id: 'ओ', text: 'ओ', language: 'hindi' },
        { id: 'औ', text: 'औ', language: 'hindi' },
        { id: 'अं', text: 'अं', language: 'hindi' },
        { id: 'अः', text: 'अः', language: 'hindi' },
        { id: 'क', text: 'क', language: 'hindi' },
        { id: 'का', text: 'का', language: 'hindi' },
        { id: 'कि', text: 'कि', language: 'hindi' },
        { id: 'की', text: 'की', language: 'hindi' },
        { id: 'कु', text: 'कु', language: 'hindi' },
        { id: 'कू', text: 'कू', language: 'hindi' },
        { id: 'के', text: 'के', language: 'hindi' },
        { id: 'कै', text: 'कै', language: 'hindi' },
        { id: 'को', text: 'को', language: 'hindi' },
        { id: 'कौ', text: 'कौ', language: 'hindi' },
        { id: 'कं', text: 'कं', language: 'hindi' },
        { id: 'ख', text: 'ख', language: 'hindi' },
        { id: 'खा', text: 'खा', language: 'hindi' },
        { id: 'खि', text: 'खि', language: 'hindi' },
        { id: 'खी', text: 'खी', language: 'hindi' },
        { id: 'ग', text: 'ग', language: 'hindi' },
        { id: 'गा', text: 'गा', language: 'hindi' },
        { id: 'गि', text: 'गि', language: 'hindi' },
        { id: 'गी', text: 'गी', language: 'hindi' },
        { id: 'घ', text: 'घ', language: 'hindi' },
        { id: 'चा', text: 'चा', language: 'hindi' },
        { id: 'ची', text: 'ची', language: 'hindi' },
        { id: 'ज', text: 'ज', language: 'hindi' },
        { id: 'जा', text: 'जा', language: 'hindi' },
        { id: 'जी', text: 'जी', language: 'hindi' },
        { id: 'ट', text: 'ट', language: 'hindi' },
        { id: 'टा', text: 'टा', language: 'hindi' },
        { id: 'टी', text: 'टी', language: 'hindi' },
        { id: 'ठ', text: 'ठ', language: 'hindi' },
        { id: 'ड', text: 'ड', language: 'hindi' },
        { id: 'डा', text: 'डा', language: 'hindi' },
        { id: 'डी', text: 'डी', language: 'hindi' },
        { id: 'त', text: 'त', language: 'hindi' },
        { id: 'ता', text: 'ता', language: 'hindi' },
        { id: 'ती', text: 'ती', language: 'hindi' },
        { id: 'थ', text: 'थ', language: 'hindi' },
        { id: 'द', text: 'द', language: 'hindi' },
        { id: 'दा', text: 'दा', language: 'hindi' },
        { id: 'दी', text: 'दी', language: 'hindi' },
        { id: 'ध', text: 'ध', language: 'hindi' },
        { id: 'न', text: 'न', language: 'hindi' },
        { id: 'ना', text: 'ना', language: 'hindi' },
        { id: 'नी', text: 'नी', language: 'hindi' },
        { id: 'प', text: 'प', language: 'hindi' },
        { id: 'पा', text: 'पा', language: 'hindi' },
        { id: 'पी', text: 'पी', language: 'hindi' },
        { id: 'फ', text: 'फ', language: 'hindi' },
        { id: 'ब', text: 'ब', language: 'hindi' },
        { id: 'बा', text: 'बा', language: 'hindi' },
        { id: 'बी', text: 'बी', language: 'hindi' },
        { id: 'भ', text: 'भ', language: 'hindi' },
        { id: 'म', text: 'म', language: 'hindi' },
        { id: 'मा', text: 'मा', language: 'hindi' },
        { id: 'मी', text: 'मी', language: 'hindi' },
        { id: 'य', text: 'य', language: 'hindi' },
        { id: 'या', text: 'या', language: 'hindi' },
        { id: 'र', text: 'र', language: 'hindi' },
        { id: 'रा', text: 'रा', language: 'hindi' },
        { id: 'री', text: 'री', language: 'hindi' },
        { id: 'ल', text: 'ल', language: 'hindi' },
        { id: 'ला', text: 'ला', language: 'hindi' },
        { id: 'ली', text: 'ली', language: 'hindi' },
        { id: 'व', text: 'व', language: 'hindi' },
        { id: 'वा', text: 'वा', language: 'hindi' },
        { id: 'श', text: 'श', language: 'hindi' },
        { id: 'शा', text: 'शा', language: 'hindi' },
        { id: 'ष', text: 'ष', language: 'hindi' },
        { id: 'स', text: 'स', language: 'hindi' },
        { id: 'सा', text: 'सा', language: 'hindi' },
        { id: 'ह', text: 'ह', language: 'hindi' },
        { id: 'हा', text: 'हा', language: 'hindi' },
        { id: 'ही', text: 'ही', language: 'hindi' },
    ];

    // MCQ Questions for English
    const englishMCQs: MCQQuestion[] = [
        {
            id: 'eng1',
            question: 'Which sound completes "C_t"?',
            language: 'english',
            options: ['A', 'O', 'U', 'I'],
            correctAnswer: 0,
            soundFile: 'cat'
        },
        {
            id: 'eng2',
            question: 'Which sound completes "D_g"?',
            language: 'english',
            options: ['A', 'O', 'U', 'I'],
            correctAnswer: 1,
            soundFile: 'dog'
        },
        {
            id: 'eng3',
            question: 'Which sound completes "S_n"?',
            language: 'english',
            options: ['A', 'U', 'I', 'O'],
            correctAnswer: 2,
            soundFile: 'sun'
        },
        {
            id: 'eng4',
            question: 'Which sound completes "M_n"?',
            language: 'english',
            options: ['O', 'A', 'I', 'U'],
            correctAnswer: 0,
            soundFile: 'moon'
        },
        {
            id: 'eng5',
            question: 'Which sound completes "Tr_e"?',
            language: 'english',
            options: ['A', 'I', 'O', 'E'],
            correctAnswer: 1,
            soundFile: 'tree'
        },
        {
            id: 'eng6',
            question: 'Which sound completes "H_se"?',
            language: 'english',
            options: ['O', 'A', 'U', 'I'],
            correctAnswer: 2,
            soundFile: 'house'
        },
        {
            id: 'eng7',
            question: 'Which sound completes "W_ter"?',
            language: 'english',
            options: ['A', 'I', 'O', 'E'],
            correctAnswer: 0,
            soundFile: 'water'
        },
    ];

    // MCQ Questions for Hindi
    const hindiMCQs: MCQQuestion[] = [
        {
            id: 'hin1',
            question: 'कौन सा स्वर "बि_ली" को पूरा करता है?',
            language: 'hindi',
            options: ['अ', 'आ', 'इ', 'ई'],
            correctAnswer: 2,
            soundFile: 'billi'
        },
        {
            id: 'hin2',
            question: 'कौन सा स्वर "सूर_" को पूरा करता है?',
            language: 'hindi',
            options: ['अ', 'आ', 'इ', 'ज'],
            correctAnswer: 3,
            soundFile: 'suraj'
        },
        {
            id: 'hin3',
            question: 'कौन सा स्वर "चाँ_" को पूरा करता है?',
            language: 'hindi',
            options: ['द', 'ड', 'द', 'द'],
            correctAnswer: 0,
            soundFile: 'chand'
        },
        {
            id: 'hin4',
            question: 'कौन सा स्वर "पे_" को पूरा करता है?',
            language: 'hindi',
            options: ['द', 'ड', 'ड़', 'द'],
            correctAnswer: 2,
            soundFile: 'ped'
        },
        {
            id: 'hin5',
            question: 'कौन सा स्वर "घ_" को पूरा करता है?',
            language: 'hindi',
            options: ['अ', 'र', 'र', 'र'],
            correctAnswer: 1,
            soundFile: 'ghar'
        },
        {
            id: 'hin6',
            question: 'कौन सा स्वर "पानी" में आता है?',
            language: 'hindi',
            options: ['आ', 'ई', 'अ', 'इ'],
            correctAnswer: 1,
            soundFile: 'pani'
        },
        {
            id: 'hin7',
            question: 'कौन सा स्वर "रो_" को पूरा करता है?',
            language: 'hindi',
            options: ['ट', 'टी', 'ती', 'ति'],
            correctAnswer: 1,
            soundFile: 'roti'
        },
    ];

    const playAudio = async (text: string, language: string) => {
        setIsPlaying(true);
        try {
            // Use Web Speech API for text-to-speech
            const utterance = new SpeechSynthesisUtterance(text);

            // Get available voices
            const voices = window.speechSynthesis.getVoices();

            if (language === 'hindi') {
                // Try different Hindi language codes
                const hindiLangCodes = ['hi-IN', 'hi', 'en-IN'];
                let hindiVoice = null;

                for (const langCode of hindiLangCodes) {
                    hindiVoice = voices.find(voice => voice.lang === langCode);
                    if (hindiVoice) {
                        utterance.lang = langCode;
                        break;
                    }
                }

                // If no Hindi voice found, try any Indian accent voice
                if (!hindiVoice) {
                    hindiVoice = voices.find(voice =>
                        voice.lang.includes('IN') ||
                        voice.name.toLowerCase().includes('india') ||
                        voice.name.toLowerCase().includes('hindi')
                    );
                    if (hindiVoice) {
                        utterance.lang = hindiVoice.lang;
                    }
                }

                if (hindiVoice) {
                    utterance.voice = hindiVoice;
                    console.log('Using Hindi voice:', hindiVoice.name, hindiVoice.lang);
                } else {
                    console.log('No Hindi voice found, using default');
                    utterance.lang = 'hi-IN'; // Fallback
                }
            } else {
                utterance.lang = 'en-US';
                // Use a different persona for English - try to find a female or different voice
                const englishVoices = voices.filter(voice =>
                    voice.lang.includes('en') && !voice.name.toLowerCase().includes('zira') // Avoid default Zira
                );

                // Prefer female voices for variety, fallback to any English voice
                const preferredVoice = englishVoices.find(voice =>
                    voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('woman') ||
                    voice.name.toLowerCase().includes('samantha') ||
                    voice.name.toLowerCase().includes('victoria') ||
                    voice.name.toLowerCase().includes('alex') // macOS voice
                ) || englishVoices.find(voice => voice.lang === 'en-US') || englishVoices[0];

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }
            }

            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.9;

            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);

            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await processRecording(audioBlob);
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Auto-stop after 3 seconds
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    stopRecording();
                }
            }, 3000);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Microphone access is required for speech exercises.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processRecording = async (audioBlob: Blob) => {
        try {
            if (!currentItem) {
                setFeedback('wrong');
                setTimeout(() => setFeedback(null), 2000);
                return;
            }

            // Create FormData to send the audio file
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');
            formData.append('expectedText', currentItem.text);
            formData.append('language', currentItem.language);

            // Send to our backend API
            const response = await fetch('/api/speech-recognition', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Speech recognition failed');
            }

            const result = await response.json();

            if (result.success) {
                // Use the accuracy level from the backend
                const feedbackType = result.accuracy || 'wrong';

                if (feedbackType === 'correct') {
                    setScore(prev => prev + 1);
                }

                setFeedback(feedbackType);

                console.log('Transcript:', result.transcript);
                console.log('Confidence:', result.confidence);
                console.log('Accuracy:', feedbackType);
            } else {
                setFeedback('wrong');
            }

            // Clear feedback after 3 seconds to show the message longer
            setTimeout(() => setFeedback(null), 3000);
        } catch (error) {
            console.error('Error processing recording:', error);
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    const playSoundForMCQ = async (soundText: string, index: number, language: string) => {
        setSelectedSoundIndex(index);
        setIsPlaying(true);

        try {
            const utterance = new SpeechSynthesisUtterance(soundText);

            // Get available voices
            const voices = window.speechSynthesis.getVoices();

            if (language === 'hindi') {
                // Try different Hindi language codes
                const hindiLangCodes = ['hi-IN', 'hi', 'en-IN'];
                let hindiVoice = null;

                for (const langCode of hindiLangCodes) {
                    hindiVoice = voices.find(voice => voice.lang === langCode);
                    if (hindiVoice) {
                        utterance.lang = langCode;
                        break;
                    }
                }

                // If no Hindi voice found, try any Indian accent voice
                if (!hindiVoice) {
                    hindiVoice = voices.find(voice =>
                        voice.lang.includes('IN') ||
                        voice.name.toLowerCase().includes('india') ||
                        voice.name.toLowerCase().includes('hindi')
                    );
                    if (hindiVoice) {
                        utterance.lang = hindiVoice.lang;
                    }
                }

                if (hindiVoice) {
                    utterance.voice = hindiVoice;
                    console.log('Using Hindi voice:', hindiVoice.name, hindiVoice.lang);
                } else {
                    console.log('No Hindi voice found, using default');
                    utterance.lang = 'hi-IN'; // Fallback
                }
            } else {
                utterance.lang = 'en-US';
                // Use a different persona for English - try to find a female or different voice
                const englishVoices = voices.filter(voice =>
                    voice.lang.includes('en') && !voice.name.toLowerCase().includes('zira') // Avoid default Zira
                );

                // Prefer female voices for variety, fallback to any English voice
                const preferredVoice = englishVoices.find(voice =>
                    voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('woman') ||
                    voice.name.toLowerCase().includes('samantha') ||
                    voice.name.toLowerCase().includes('victoria') ||
                    voice.name.toLowerCase().includes('alex') // macOS voice
                ) || englishVoices.find(voice => voice.lang === 'en-US') || englishVoices[0];

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }
            }

            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.9;

            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);

            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error playing sound:', error);
            setIsPlaying(false);
        }
    };

    const handleMCQAnswer = (selectedIndex: number | null) => {
        const currentQuestions = activeTab === 'english-mcq' ? englishMCQs : hindiMCQs;
        const currentQuestion = currentQuestions[currentMCQIndex];

        // If selectedIndex is null, it means they chose "doesn't complete the word"
        const isCorrect = selectedIndex === null
            ? selectedSoundIndex !== currentQuestion.correctAnswer
            : selectedIndex === currentQuestion.correctAnswer;

        if (isCorrect) {
            setFeedback('correct');
            setScore(prev => prev + 1);
        } else {
            setFeedback('wrong');
        }

        // Move to next question or reset
        setTimeout(() => {
            setFeedback(null);
            setSelectedSoundIndex(null);
            if (currentMCQIndex < currentQuestions.length - 1) {
                setCurrentMCQIndex(prev => prev + 1);
            } else {
                // Quiz completed
                setCurrentMCQIndex(0);
                alert(`Quiz completed! Your score: ${score + (isCorrect ? 1 : 0)}/${currentQuestions.length}`);
                setScore(0);
            }
        }, 2000);
    };

    const getRandomItem = (items: LetterWordItem[]) => {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-speech-bg">
            <Navigation />

            {/* Hero Background */}
            <div className="relative min-h-[30vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-speech-green/20 to-speech-bg/80"></div>
                <div className="relative z-10 text-center px-4 md:px-6 lg:px-8">
                    <h1 className="font-bricolage text-4xl md:text-5xl lg:text-6xl font-bold text-speech-green mb-4 tracking-wide">
                        Speech Therapy
                    </h1>
                    <p className="font-bricolage text-xl md:text-2xl text-speech-green/80 max-w-3xl mx-auto leading-relaxed tracking-wide">
                        Practice letter and word repetition with interactive exercises
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                        <TabsTrigger value="repetition" className="font-bricolage">Letter Repetition</TabsTrigger>
                        <TabsTrigger value="words" className="font-bricolage">Word Repetition</TabsTrigger>
                        <TabsTrigger value="english-mcq" className="font-bricolage">English MCQ</TabsTrigger>
                        <TabsTrigger value="hindi-mcq" className="font-bricolage">Hindi MCQ</TabsTrigger>
                        <TabsTrigger value="hindi-matras" className="font-bricolage">Hindi Matras</TabsTrigger>
                    </TabsList>

                    {/* Letter Repetition Tab */}
                    <TabsContent value="repetition" className="space-y-6">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-bricolage text-2xl text-speech-green flex items-center justify-between">
                                    <span>Letter Repetition Practice</span>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-speech-green" />
                                        <span className="font-semibold">Score: {score}</span>
                                    </div>
                                </CardTitle>
                                <p className="font-bricolage text-lg text-speech-green/70 mt-2">
                                    Listen to the letter, then speak it clearly. The system will automatically check your pronunciation!
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="flex justify-center gap-4 mb-6">
                                        <Button
                                            onClick={() => setCurrentItem(getRandomItem(englishLetters))}
                                            variant={currentItem?.language === 'english' ? 'default' : 'outline'}
                                            className="font-bricolage"
                                        >
                                            English Letters
                                        </Button>
                                        <Button
                                            onClick={() => setCurrentItem(getRandomItem(hindiLetters))}
                                            variant={currentItem?.language === 'hindi' ? 'default' : 'outline'}
                                            className="font-bricolage"
                                        >
                                            Hindi Letters
                                        </Button>
                                    </div>

                                    {currentItem && (
                                        <div className="space-y-6">
                                            <div className="text-8xl font-bold text-speech-green mb-4">
                                                {currentItem.text}
                                            </div>

                                            <div className="flex justify-center gap-4">
                                                <Button
                                                    onClick={() => playAudio(currentItem.text, currentItem.language)}
                                                    disabled={isPlaying}
                                                    className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage"
                                                >
                                                    <Volume2 className="w-5 h-5 mr-2" />
                                                    {isPlaying ? 'Playing...' : 'Listen'}
                                                </Button>

                                                <Button
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    className={`font-bricolage ${isRecording
                                                        ? 'bg-red-500 hover:bg-red-600'
                                                        : 'bg-speech-green hover:bg-speech-green/90'
                                                        }`}
                                                >
                                                    {isRecording ? (
                                                        <>
                                                            <MicOff className="w-5 h-5 mr-2" />
                                                            Stop Recording
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Mic className="w-5 h-5 mr-2" />
                                                            Repeat
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    onClick={() => {
                                                        const items = currentItem?.language === 'english' ? englishLetters : hindiLetters;
                                                        setCurrentItem(getRandomItem(items));
                                                    }}
                                                    variant="outline"
                                                    className="font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white"
                                                >
                                                    Next Letter
                                                </Button>
                                            </div>

                                            {feedback && (
                                                <div className={`text-center p-4 rounded-lg ${feedback === 'correct'
                                                    ? 'bg-green-50 border border-green-200'
                                                    : feedback === 'close'
                                                        ? 'bg-yellow-50 border border-yellow-200'
                                                        : 'bg-red-50 border border-red-200'
                                                    }`}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {feedback === 'correct' ? (
                                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                                        ) : feedback === 'close' ? (
                                                            <div className="w-6 h-6 rounded-full border-2 border-yellow-600 flex items-center justify-center">
                                                                <span className="text-yellow-600 text-sm font-bold">~</span>
                                                            </div>
                                                        ) : (
                                                            <XCircle className="w-6 h-6 text-red-600" />
                                                        )}
                                                        <span className="font-bricolage text-lg font-semibold">
                                                            {feedback === 'correct'
                                                                ? 'Perfect!'
                                                                : feedback === 'close'
                                                                    ? 'Close! Keep trying!'
                                                                    : 'Not quite right!'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Word Repetition Tab */}
                    <TabsContent value="words" className="space-y-6">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-bricolage text-2xl text-speech-green flex items-center justify-between">
                                    <span>Word Repetition Practice</span>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-speech-green" />
                                        <span className="font-semibold">Score: {score}</span>
                                    </div>
                                </CardTitle>
                                <p className="font-bricolage text-lg text-speech-green/70 mt-2">
                                    Listen to the word, then speak it clearly. The system will automatically check your pronunciation!
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="flex justify-center gap-4 mb-6">
                                        <Button
                                            onClick={() => setCurrentItem(getRandomItem(englishWords))}
                                            variant={currentItem?.language === 'english' ? 'default' : 'outline'}
                                            className="font-bricolage"
                                        >
                                            English Words
                                        </Button>
                                        <Button
                                            onClick={() => setCurrentItem(getRandomItem(hindiWords))}
                                            variant={currentItem?.language === 'hindi' ? 'default' : 'outline'}
                                            className="font-bricolage"
                                        >
                                            Hindi Words
                                        </Button>
                                    </div>

                                    {currentItem && (
                                        <div className="space-y-6">
                                            <div className="text-6xl font-bold text-speech-green mb-4">
                                                {currentItem.text}
                                            </div>

                                            <div className="flex justify-center gap-4">
                                                <Button
                                                    onClick={() => playAudio(currentItem.text, currentItem.language)}
                                                    disabled={isPlaying}
                                                    className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage"
                                                >
                                                    <Volume2 className="w-5 h-5 mr-2" />
                                                    {isPlaying ? 'Playing...' : 'Listen'}
                                                </Button>

                                                <Button
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    className={`font-bricolage ${isRecording
                                                        ? 'bg-red-500 hover:bg-red-600'
                                                        : 'bg-speech-green hover:bg-speech-green/90'
                                                        }`}
                                                >
                                                    {isRecording ? (
                                                        <>
                                                            <MicOff className="w-5 h-5 mr-2" />
                                                            Stop Recording
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Mic className="w-5 h-5 mr-2" />
                                                            Repeat
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    onClick={() => {
                                                        const items = currentItem?.language === 'english' ? englishWords : hindiWords;
                                                        setCurrentItem(getRandomItem(items));
                                                    }}
                                                    variant="outline"
                                                    className="font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white"
                                                >
                                                    Next Word
                                                </Button>
                                            </div>

                                            {feedback && (
                                                <div className={`text-center p-4 rounded-lg ${feedback === 'correct'
                                                    ? 'bg-green-50 border border-green-200'
                                                    : feedback === 'close'
                                                        ? 'bg-yellow-50 border border-yellow-200'
                                                        : 'bg-red-50 border border-red-200'
                                                    }`}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {feedback === 'correct' ? (
                                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                                        ) : feedback === 'close' ? (
                                                            <div className="w-6 h-6 rounded-full border-2 border-yellow-600 flex items-center justify-center">
                                                                <span className="text-yellow-600 text-sm font-bold">~</span>
                                                            </div>
                                                        ) : (
                                                            <XCircle className="w-6 h-6 text-red-600" />
                                                        )}
                                                        <span className="font-bricolage text-lg font-semibold">
                                                            {feedback === 'correct'
                                                                ? 'Excellent!'
                                                                : feedback === 'close'
                                                                    ? 'Close! Keep trying!'
                                                                    : 'Keep practicing!'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* English MCQ Tab */}
                    <TabsContent value="english-mcq" className="space-y-6">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-bricolage text-2xl text-speech-green flex items-center justify-between">
                                    <span>English Sound Completion Quiz</span>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-speech-green" />
                                        <span className="font-semibold">Score: {score}</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="bg-speech-bg rounded-lg p-6 mb-6">
                                        <h3 className="font-bricolage text-3xl font-bold text-speech-green mb-4">
                                            Question {currentMCQIndex + 1} of {englishMCQs.length}
                                        </h3>
                                        <p className="font-bricolage text-xl text-speech-green/80 mb-4">
                                            {englishMCQs[currentMCQIndex]?.question}
                                        </p>
                                        <p className="font-bricolage text-lg text-speech-green/60">
                                            Click on a sound to hear it, then decide if it completes the word correctly.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {englishMCQs[currentMCQIndex]?.options.map((option, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => playSoundForMCQ(option, index, 'english')}
                                                disabled={feedback !== null}
                                                className="font-bricolage text-lg py-4 h-auto bg-speech-green hover:bg-speech-green/90 text-white flex items-center justify-center gap-2"
                                            >
                                                <Volume2 className="w-5 h-5" />
                                                Sound {index + 1}
                                            </Button>
                                        ))}
                                    </div>

                                    {/* Selection buttons after hearing sounds */}
                                    <div className="flex justify-center gap-4 mb-6">
                                        <Button
                                            onClick={() => handleMCQAnswer(selectedSoundIndex)}
                                            disabled={feedback !== null || selectedSoundIndex === null}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bricolage px-8 py-3"
                                        >
                                            This sound completes the word
                                        </Button>
                                        <Button
                                            onClick={() => handleMCQAnswer(null)} // Indicate wrong choice
                                            disabled={feedback !== null || selectedSoundIndex === null}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bricolage px-8 py-3"
                                        >
                                            This sound doesn't complete the word
                                        </Button>
                                    </div>

                                    {feedback && (
                                        <div className={`text-center p-4 rounded-lg ${feedback === 'correct'
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-red-50 border border-red-200'
                                            }`}>
                                            <div className="flex items-center justify-center gap-2">
                                                {feedback === 'correct' ? (
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-600" />
                                                )}
                                                <span className="font-bricolage text-lg font-semibold">
                                                    {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Hindi MCQ Tab */}
                    <TabsContent value="hindi-mcq" className="space-y-6">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-bricolage text-2xl text-speech-green flex items-center justify-between">
                                    <span>Hindi Sound Completion Quiz</span>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-speech-green" />
                                        <span className="font-semibold">Score: {score}</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="bg-speech-bg rounded-lg p-6 mb-6">
                                        <h3 className="font-bricolage text-3xl font-bold text-speech-green mb-4">
                                            प्रश्न {currentMCQIndex + 1} का {hindiMCQs.length}
                                        </h3>
                                        <p className="font-bricolage text-xl text-speech-green/80 mb-4">
                                            {hindiMCQs[currentMCQIndex]?.question}
                                        </p>
                                        <p className="font-bricolage text-lg text-speech-green/60">
                                            ध्वनि सुनने के लिए क्लिक करें, फिर तय करें कि यह शब्द को सही ढंग से पूरा करती है या नहीं।
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {hindiMCQs[currentMCQIndex]?.options.map((option, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => playSoundForMCQ(option, index, 'hindi')}
                                                disabled={feedback !== null}
                                                className="font-bricolage text-lg py-4 h-auto bg-speech-green hover:bg-speech-green/90 text-white flex items-center justify-center gap-2"
                                            >
                                                <Volume2 className="w-5 h-5" />
                                                ध्वनि {index + 1}
                                            </Button>
                                        ))}
                                    </div>

                                    {/* Selection buttons after hearing sounds */}
                                    <div className="flex justify-center gap-4 mb-6">
                                        <Button
                                            onClick={() => handleMCQAnswer(selectedSoundIndex)}
                                            disabled={feedback !== null || selectedSoundIndex === null}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bricolage px-8 py-3"
                                        >
                                            यह ध्वनि शब्द को पूरा करती है
                                        </Button>
                                        <Button
                                            onClick={() => handleMCQAnswer(null)} // Indicate wrong choice
                                            disabled={feedback !== null || selectedSoundIndex === null}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bricolage px-8 py-3"
                                        >
                                            यह ध्वनि शब्द को पूरा नहीं करती
                                        </Button>
                                    </div>

                                    {feedback && (
                                        <div className={`text-center p-4 rounded-lg ${feedback === 'correct'
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-red-50 border border-red-200'
                                            }`}>
                                            <div className="flex items-center justify-center gap-2">
                                                {feedback === 'correct' ? (
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-600" />
                                                )}
                                                <span className="font-bricolage text-lg font-semibold">
                                                    {feedback === 'correct' ? 'सही!' : 'गलत!'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Hindi Matras Board Tab */}
                    <TabsContent value="hindi-matras" className="space-y-6">
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-bricolage text-2xl text-speech-green">
                                    Hindi Matras Practice Board
                                </CardTitle>
                                <p className="font-bricolage text-lg text-speech-green/70 mt-2">
                                    Tap on any matra or letter combination to hear its pronunciation and practice speaking it.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                                    {hindiMatras.map((matra) => (
                                        <Button
                                            key={matra.id}
                                            onClick={() => playAudio(matra.text, matra.language)}
                                            disabled={isPlaying}
                                            className="aspect-square bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl lg:text-2xl py-4 h-auto flex items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="leading-tight">{matra.text}</span>
                                                <Volume2 className="w-4 h-4 mt-1 opacity-70" />
                                            </div>
                                        </Button>
                                    ))}
                                </div>

                                <div className="bg-speech-bg/50 rounded-lg p-4 mt-6">
                                    <h3 className="font-bricolage text-lg font-semibold text-speech-green mb-2">
                                        How to Practice:
                                    </h3>
                                    <ul className="font-bricolage text-speech-green/80 space-y-1 text-sm">
                                        <li>• Click on any matra to hear its correct pronunciation</li>
                                        <li>• Try to repeat the sound after hearing it</li>
                                        <li>• Practice regularly to improve your Hindi speech articulation</li>
                                        <li>• Focus on the correct mouth movements and tongue placement</li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-bricolage text-md font-semibold text-blue-800 mb-2">
                                            Vowels (स्वर)
                                        </h4>
                                        <p className="font-bricolage text-sm text-blue-700">
                                            अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ, अं, अः
                                        </p>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-bricolage text-md font-semibold text-green-800 mb-2">
                                            Consonants (व्यंजन)
                                        </h4>
                                        <p className="font-bricolage text-sm text-green-700">
                                            क, ख, ग, घ, च, छ, ज, झ, ट, ठ, ड, ढ, त, थ, द, ध, न, प, फ, ब, भ, म, य, र, ल, व, श, ष, स, ह
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
