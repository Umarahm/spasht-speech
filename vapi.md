# VAPI Integration Documentation

## Overview

This document outlines how VAPI (Voice AI Platform Interface) is integrated into the Speech Therapy Application. VAPI provides real-time voice conversation capabilities with AI personas designed for speech therapy and practice.

## Architecture

### Core Components

1. **VapiService** (`/src/services/vapiService.js`) - Main service class handling VAPI SDK integration
2. **VapiConversation** (`/src/components/ai/VapiConversation.jsx`) - React component for conversation UI
3. **AiConversationPage** (`/pages/ai-conversation.js`) - Main page component orchestrating the conversation experience

## Dependencies

```json
{
  "@vapi-ai/web": "^2.3.8"
}
```

## Environment Configuration

```env
# VAPI Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=64854441-5e51-451c-a954-f80ead45af9d
NEXT_PUBLIC_VAPI_WORKFLOW_ID=587b4902-b05d-4a14-acbf-d7c06e86c1e3
```

## Core Implementation

### 1. Service Initialization

```javascript
// vapiService.js
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
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
      const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
      
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
}
```

### 2. Event Listeners Setup

```javascript
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
```

### 3. Starting a Conversation

```javascript
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

    // Configure the call
    const callConfig = {
      model: {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.getSystemMessage(persona)
          }
        ]
      },
      voice: {
        provider: 'playht',
        voiceId: 'jennifer'
      },
      firstMessage: this.getFirstMessage(persona)
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
```

### 4. Ending a Conversation

```javascript
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
```

## Persona Configuration

The application supports multiple AI personas, each with unique characteristics:

### Available Personas

1. **Therapist** - Dr. Sarah (Warm, encouraging speech therapist)
2. **Stutter** - Rohan (Specialized stutter therapist)
3. **Casual** - Alex (Friendly conversation partner)
4. **Professional** - Ms. Johnson (Professional communication coach)
5. **Creative** - Maya (Creative conversation partner)

### Persona Configuration Example

```javascript
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
        systemMessage: `You are Dr. Sarah, a warm and encouraging speech therapist...`
      }
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
        systemMessage: `You are Rohan, a specialized stutter therapist...`
      }
    }
    // ... other personas
  };

  return configs[persona] || configs.therapist;
}
```

## React Component Integration

### VapiConversation Component Usage

```jsx
// In ai-conversation.js
import VapiConversation from '../src/components/ai/VapiConversation.jsx';

const AiConversationPage = () => {
  const [selectedPersona, setSelectedPersona] = useState('therapist');

  const handleSessionEnd = (sessionData) => {
    updateSessionStats(sessionData);
    console.log('Session ended:', sessionData);
  };

  const handleError = (error) => {
    console.error('AI Conversation error:', error);
  };

  return (
    <VapiConversation
      persona={selectedPersona}
      onSessionEnd={handleSessionEnd}
      onError={handleError}
    />
  );
};
```

### Component Event Handling

```jsx
// In VapiConversation.jsx
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
```

## Message Handling

### Message Types

1. **transcript** - Final and partial transcripts from user speech
2. **speech-update** - Real-time AI speech updates
3. **function-call** - AI function calls (if configured)
4. **hang** - Call termination events

### Message Processing Example

```javascript
const handleMessage = (message) => {
  switch (message.type) {
    case 'transcript':
      if (message.transcriptType === 'final') {
        // Add final transcript message
        addMessage({
          id: generateMessageId(),
          text: message.transcript,
          sender: message.role === 'assistant' ? 'ai' : 'user',
          timestamp: new Date(),
          isPartial: false
        });
      } else if (message.transcriptType === 'partial') {
        // Handle partial transcript (user speaking)
        if (message.role === 'user') {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];

            if (lastMessage && lastMessage.isPartial && lastMessage.sender === 'user') {
              // Update existing partial message
              lastMessage.text = message.transcript;
            } else {
              // Add new partial message
              newMessages.push({
                id: generateMessageId(),
                text: message.transcript,
                sender: 'user',
                timestamp: new Date(),
                isPartial: true
              });
            }
            return newMessages;
          });
        }
      }
      break;

    case 'speech-update':
      // Handle real-time speech updates from assistant
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];

        if (lastMessage && lastMessage.isPartial && lastMessage.sender === 'ai') {
          // Update existing partial AI message
          lastMessage.text = message.transcript || message.text || '';
        } else {
          // Add new partial AI message
          newMessages.push({
            id: generateMessageId(),
            text: message.transcript || message.text || '',
            sender: 'ai',
            timestamp: new Date(),
            isPartial: true
          });
        }
        return newMessages;
      });
      break;

    default:
      console.log('Unhandled message type:', message.type);
  }
};
```

## State Management

### Conversation State

```javascript
conversationState = {
  isActive: false,
  messages: [],
  currentPersona: null,
  sessionId: null
}
```

### Component State

```javascript
const [isConnected, setIsConnected] = useState(false);
const [isListening, setIsListening] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const [isMuted, setIsMuted] = useState(false);
const [volumeLevel, setVolumeLevel] = useState(0);
const [messages, setMessages] = useState([]);
const [sessionDuration, setSessionDuration] = useState(0);
const [error, setError] = useState(null);
const [isInitializing, setIsInitializing] = useState(false);
```

## Error Handling

### Service Level Error Handling

```javascript
this.vapi.on('error', (error) => {
  console.error('VAPI error:', error);
  this.emit('error', error);
});
```

### Component Level Error Handling

```javascript
const handleVapiError = (error) => {
  console.error('VAPI error:', error);
  setError('Voice AI error occurred. Please try again.');
  onError?.(error);
};
```

## Best Practices

### 1. Initialization
- Always check if VAPI is initialized before starting conversations
- Handle initialization failures gracefully
- Provide user feedback during initialization

### 2. Event Management
- Properly set up and clean up event listeners
- Use the custom event system for loose coupling
- Handle all possible event types

### 3. State Management
- Keep UI state synchronized with VAPI state
- Handle partial and final transcripts appropriately
- Manage session lifecycle properly

### 4. Error Handling
- Implement comprehensive error handling at all levels
- Provide meaningful error messages to users
- Log errors for debugging

### 5. Cleanup
- Always clean up resources when components unmount
- Stop active calls before cleanup
- Clear event listeners to prevent memory leaks

## Usage Examples

### Basic Conversation Start

```javascript
// Start a conversation with therapist persona
await vapiService.startConversation('therapist');
```

### Custom Configuration

```javascript
// Start with custom options
await vapiService.startConversation('stutter', {
  maxDuration: 600, // 10 minutes
  enableTranscription: true
});
```

### Event Listening

```javascript
// Listen for specific events
vapiService.on('call-start', () => {
  console.log('Conversation started');
});

vapiService.on('transcript', (transcript) => {
  console.log('New transcript:', transcript.content);
});
```

## Troubleshooting

### Common Issues

1. **Initialization Fails**
   - Check environment variables
   - Verify VAPI credentials
   - Ensure network connectivity

2. **No Audio**
   - Check microphone permissions
   - Verify browser audio settings
   - Test with different browsers

3. **Connection Drops**
   - Check network stability
   - Implement reconnection logic
   - Handle timeout scenarios

4. **Transcript Issues**
   - Verify audio quality
   - Check for background noise
   - Test with different microphones

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_MODE=true
LOG_LEVEL=debug
```

## Future Enhancements

1. **Advanced Persona Customization**
   - User-defined personas
   - Dynamic persona switching
   - Persona learning from user interactions

2. **Enhanced Analytics**
   - Speech pattern analysis
   - Progress tracking
   - Performance metrics

3. **Multi-language Support**
   - Additional language models
   - Locale-specific voices
   - Cultural adaptation

4. **Advanced Features**
   - Screen sharing during calls
   - File sharing capabilities
   - Group conversation support
