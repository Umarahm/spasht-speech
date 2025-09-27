import Vapi from '@vapi-ai/web';

class VapiService {
    constructor() {
        this.vapi = null;
        this.isInitialized = false;
        this.isConnected = false;
        this.currentCall = null;
        this.eventListeners = new Map();
        this.conversationState = {
            isActive: false,
            messages: [],
            currentPersona: null,
            sessionId: null
        };
    }

    async initialize() {
        try {
            const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
            const workflowId = import.meta.env.VITE_VAPI_WORKFLOW_ID;

            if (!publicKey || !workflowId) {
                throw new Error('VAPI credentials not found in environment variables');
            }

            this.vapi = new Vapi(publicKey);
            this.setupEventListeners();
            this.isInitialized = true;

            return true;
        } catch (error) {
            console.error('Failed to initialize VAPI service:', error);
            throw error;
        }
    }

    setupEventListeners() {
        if (!this.vapi) return;

        // Call lifecycle events
        this.vapi.on('call-start', () => {
            this.isConnected = true;
            this.conversationState.isActive = true;
            this.emit('call-start');
        });

        this.vapi.on('call-end', () => {
            this.isConnected = false;
            this.conversationState.isActive = false;
            this.currentCall = null;
            this.emit('call-end');
        });

        // Speech events
        this.vapi.on('speech-start', () => {
            this.emit('speech-start');
        });

        this.vapi.on('speech-end', () => {
            this.emit('speech-end');
        });

        // Message handling
        this.vapi.on('message', (message) => {
            this.handleMessage(message);
        });

        // Error handling
        this.vapi.on('error', (error) => {
            this.emit('error', error);
        });

        // Volume level updates
        this.vapi.on('volume-level', (level) => {
            this.emit('volume-level', level);
        });
    }

    handleMessage(message) {
        switch (message.type) {
            case 'transcript':
                if (message.transcriptType === 'final') {
                    // Add final transcript message
                    const finalMessage = {
                        id: this.generateMessageId(),
                        text: message.transcript,
                        sender: message.role === 'assistant' ? 'ai' : 'user',
                        timestamp: new Date(),
                        isPartial: false
                    };
                    this.conversationState.messages.push(finalMessage);
                    this.emit('message', finalMessage);
                } else if (message.transcriptType === 'partial') {
                    // Handle partial transcript (user speaking)
                    if (message.role === 'user') {
                        const partialMessage = {
                            id: this.generateMessageId(),
                            text: message.transcript,
                            sender: 'user',
                            timestamp: new Date(),
                            isPartial: true
                        };
                        this.emit('transcript', partialMessage);
                    }
                }
                break;

            case 'speech-update':
                // Handle real-time speech updates from assistant
                const speechUpdateMessage = {
                    id: this.generateMessageId(),
                    text: message.transcript || message.text || '',
                    sender: 'ai',
                    timestamp: new Date(),
                    isPartial: true
                };
                this.emit('speech-update', speechUpdateMessage);
                break;

            default:
                console.log('Unhandled message type:', message.type);
        }
    }

    async startConversation(persona = 'therapist', options = {}) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            if (this.isConnected) {
                console.warn('Conversation already active');
                return false;
            }

            // Generate session ID
            this.conversationState.sessionId = this.generateSessionId();
            this.conversationState.currentPersona = persona;
            this.conversationState.messages = [];

            // Get persona-specific configuration
            const personaConfig = this.getPersonaConfig(persona);

            // Configure the call
            const callConfig = {
                model: {
                    provider: 'openai',
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: personaConfig.model.systemMessage
                        }
                    ],
                    temperature: personaConfig.model.temperature || 0.7
                },
                voice: personaConfig.voice,
                firstMessage: personaConfig.firstMessage
            };

            // Start the call
            this.currentCall = await this.vapi.start(callConfig);

            return true;
        } catch (error) {
            console.error('Failed to start VAPI conversation:', error);
            this.emit('error', error);
            throw error;
        }
    }

    getPersonaConfig(persona) {
        const configs = {
            therapist: {
                voice: {
                    provider: 'playht',
                    voiceId: 'jennifer'
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-3.5-turbo',
                    temperature: 0.7,
                    systemMessage: `You are Dr. Sarah, a warm and encouraging speech therapist with over 15 years of experience helping people improve their communication skills. You specialize in speech therapy and communication coaching. Be supportive, patient, and provide gentle feedback when appropriate. Focus on building confidence and helping the user practice clear articulation, appropriate pacing, and effective communication techniques.`
                },
                firstMessage: "Hello! I'm Dr. Sarah, your speech therapist. I'm here to help you practice and improve your communication skills. How are you feeling today, and what would you like to work on?"
            },
            stutter: {
                voice: {
                    provider: 'playht',
                    voiceId: 'davis'
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-3.5-turbo',
                    temperature: 0.6,
                    systemMessage: `You are Rohan, a specialized stutter therapist who understands the challenges of stuttering. You provide a safe, non-judgmental space for practice. Your approach focuses on building confidence and fluency through supportive conversation. You understand that stuttering is a neurological condition and your role is to create a comfortable environment where the user can practice speaking without fear of judgment.`
                },
                firstMessage: "Hi there! I'm Rohan, and I'm here to support you in your speech therapy journey. This is a safe space to practice speaking at your own pace. What brings you here today?"
            },
            casual: {
                voice: {
                    provider: 'playht',
                    voiceId: 'jennifer'
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-3.5-turbo',
                    temperature: 0.8,
                    systemMessage: `You are Alex, a friendly conversation partner who enjoys casual chats about various topics. You're approachable and engaging, making it easy for others to practice natural conversation skills. Keep the conversation light, fun, and natural. Ask questions that encourage the user to share their thoughts and experiences.`
                },
                firstMessage: "Hey! I'm Alex. I love having conversations about all sorts of things. What's on your mind today?"
            },
            professional: {
                voice: {
                    provider: 'playht',
                    voiceId: 'davis'
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-3.5-turbo',
                    temperature: 0.6,
                    systemMessage: `You are Ms. Johnson, a professional communication coach who specializes in business and formal communication skills. You provide constructive feedback on clarity, professionalism, and presentation. Help the user practice formal communication, business etiquette, and professional presentation skills.`
                },
                firstMessage: "Good day. I'm Ms. Johnson, a communication coach specializing in professional and business communication. How may I assist you in developing your communication skills?"
            },
            creative: {
                voice: {
                    provider: 'playht',
                    voiceId: 'jennifer'
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-3.5-turbo',
                    temperature: 0.9,
                    systemMessage: `You are Maya, a creative conversation partner who loves discussing art, literature, music, and imaginative topics. You encourage creative expression and thoughtful discussion. Be enthusiastic about creative pursuits and help the user explore their imagination and artistic interests.`
                },
                firstMessage: "Hello! I'm Maya, and I love exploring creative ideas and thoughts. What creative projects or ideas have been inspiring you lately?"
            }
        };

        return configs[persona] || configs.therapist;
    }

    async endConversation() {
        try {
            if (this.vapi && this.isConnected) {
                await this.vapi.stop();
                this.isConnected = false;
                this.conversationState.isActive = false;
                this.conversationState.status = 'disconnected';
                this.emit('call-end', { reason: 'user-disconnected' });
            }
        } catch (error) {
            console.error('Error ending conversation:', error);
            this.emit('error', { error: 'Failed to end conversation' });
        }
    }


    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Event emitter methods
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // Getters for state
    getConversationState() {
        return { ...this.conversationState };
    }

    isServiceConnected() {
        return this.isConnected;
    }

    isServiceInitialized() {
        return this.isInitialized;
    }
}

// Export singleton instance
const vapiService = new VapiService();
export default vapiService;
