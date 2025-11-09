# Speech Therapy AI Platform - Complete Project Details

This document provides comprehensive details about the Speech Therapy AI Platform, covering all features, capabilities, and user experiences. All information is grounded in the actual codebase implementation.

---

## 1. Project Overview

### Technology Stack
- **Frontend**: React 18 with TypeScript, Vite build tool, TailwindCSS for styling
- **Backend**: Express.js server with TypeScript, integrated with Firebase Admin SDK
- **Authentication**: Firebase Authentication with Google OAuth
- **Database**: Firebase Cloud Firestore (optional) and Firebase Storage
- **AI Services**: Google Speech-to-Text, Google Generative AI (Gemini), External ML analysis service, VAPI for voice conversations
- **Deployment**: Netlify for frontend, Render.com for backend
- **PWA Support**: Service worker and manifest for offline capability

### Design Assets
All visual assets are designed in Figma and exported to the project:
- Hero banners for each major feature (desktop and mobile variants)
- Communication Quest icons and Weekly Challenge badges
- Homepage illustrations and SVG graphics
- Login page graphics
- Tech partner logos (AssemblyAI, Gemini, Google Cloud, VAPI, Whisper AI)
- PWA icons and favicons

---

## 2. Core Features - Detailed Descriptions

### 2.1 Authentication System

**User Experience:**
- Users sign in using their Google account through Firebase Authentication
- Single sign-on provides seamless access across devices
- Session persistence maintains login state
- Automatic profile creation upon first login

**Security Features:**
- Secure token-based authentication
- Automatic session refresh
- Protected routes requiring authentication
- User-specific data access controls

---

### 2.2 Speech Therapy Exercises (Hindi & English)

**Feature Overview:**
The Speech Therapy page provides multiple exercise modes designed to help users practice pronunciation, articulation, and fluency in both English and Hindi languages.

**Exercise Modes:**

1. **Letter Repetition**
   - **English**: Complete alphabet (A-Z) for practice
   - **Hindi**: Devanagari script letters (अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ, क, ख, ग, घ, च, छ, ज, झ, ट, ठ, etc.)
   - Users hear the letter pronounced via text-to-speech
   - Users record themselves repeating the letter
   - System checks pronunciation accuracy

2. **Word Repetition**
   - **English Words**: Cat, Dog, Sun, Moon, Tree, House, Water, Bread, Apple, School, and more
   - **Hindi Words**: बिल्ली (cat), कुत्ता (dog), सूरज (sun), चाँद (moon), पेड़ (tree), घर (house), पानी (water), रोटी (bread), सेब (apple), स्कूल (school), and more
   - Users listen to word pronunciation
   - Users record themselves saying the word
   - System validates pronunciation correctness

3. **English MCQ (Multiple Choice Questions)**
   - "Sound completion" style questions
   - Audio prompts play sounds or words
   - Users select the correct answer from multiple choices
   - Tests listening comprehension and sound recognition

4. **Hindi MCQ**
   - Hindi language questions with audio prompts
   - Multiple choice format
   - Tests Hindi language comprehension and pronunciation recognition

5. **Hindi Matras Board**
   - Interactive board displaying Hindi matras (vowel marks) and combinations
   - Includes: अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ, अं, अः
   - Common consonant-matra combinations (का, कि, की, कु, कू, के, कै, को, कौ, कं, etc.)
   - Tap-to-play functionality for each matra/combo
   - Helps users learn and practice Hindi pronunciation patterns

**How It Works:**
- Text-to-speech uses Web Speech API with language-aware voice selection
- For Hindi: Uses `hi-IN` language code with appropriate Hindi voices
- For English: Uses `en-US` language code with English voices
- Robust fallback system for Android devices that may have delayed voice loading
- Speech recognition validates user recordings against expected text
- Provides immediate feedback: "correct", "close", or "wrong" based on accuracy
- Score tracking system for user progress
- Microphone permission handling optimized for Android PWAs

---

### 2.3 Reading Passage Practice

**Feature Overview:**
Users practice reading fluency by reading AI-generated passages, recording themselves, and receiving detailed analysis of their speech patterns.

**Passage Generation:**
- AI-powered passage generation using Google's Gemini model
- Three difficulty levels:
  - **Beginner**: Simple vocabulary, everyday topics, 50-75 words
  - **Intermediate**: Moderate complexity, interesting concepts, 50-75 words
  - **Advanced**: Sophisticated vocabulary, complex ideas, 50-75 words
- Optional topic specification for personalized passages
- Automatic word count enforcement (50-75 words)
- Fallback static passages if AI service is unavailable
- Estimated reading time calculation

**User Flow:**
1. User selects difficulty level (beginner/intermediate/advanced)
2. System generates a personalized passage using AI
3. User reads the passage displayed on screen
4. User records themselves reading the passage
5. Audio is uploaded and stored securely
6. System analyzes the recording for speech patterns
7. User receives detailed analysis with visualizations
8. Optional AI-generated recommendations based on analysis

**Analysis Features:**
- Segment-by-segment speech pattern detection
- Stutter pattern identification (Block, Prolongation, Interjection, Word Repetition, Sound Repetition, Fluent Speech)
- Timeline visualization showing patterns throughout the recording
- Summary statistics (fluency percentage, stutter rate, duration)
- Audio playback with waveform visualization
- Interactive timeline for navigating through the recording

**Recommendations:**
- AI-generated personalized recommendations using Gemini
- Markdown-formatted suggestions based on detected speech patterns
- Stored per session for future reference
- Rate-limited for non-tester users to manage costs

---

### 2.4 Just-A-Minute (JAM) Sessions

**Feature Overview:**
JAM sessions are 60-second timed speaking exercises where users speak on a given topic, helping build spontaneous speech fluency and confidence.

**Topic Library:**
- 100+ curated topics across multiple categories
- Three difficulty levels:
  - **Beginner**: Personal experiences, daily routines, hobbies, simple topics
  - **Intermediate**: Memorable events, opinions, descriptions, moderate complexity
  - **Advanced**: Abstract concepts, social issues, complex discussions
- Each topic includes:
  - Topic title and description
  - Helpful hints to guide the user
  - Estimated word count (typically 150-170 words)
  - 60-second time limit

**Sample Topics:**
- Beginner: "My Daily Routine", "My Favorite Hobby", "Healthy Living"
- Intermediate: "A Memorable Vacation", "My Dream Job", "The Importance of Education"
- Advanced: "Technology and Society", "Environmental Awareness", "The Future of Work"

**Session Flow:**
1. User selects difficulty level
2. System randomly selects a topic matching the difficulty
3. Topic is displayed with description and hints
4. User has preparation time to think
5. Recording starts automatically
6. 60-second countdown timer displays
7. User speaks continuously about the topic
8. Recording automatically stops at 60 seconds
9. Audio is uploaded and stored
10. System analyzes the recording
11. User views detailed analysis and performance metrics

**Analysis and Feedback:**
- Same comprehensive analysis as passage practice
- Pattern detection across the 60-second speech
- Fluency scoring
- Performance metrics and trends
- Optional AI recommendations for improvement

**User Experience Features:**
- Topic hints can be revealed progressively
- Visual countdown timer
- Real-time recording indicator
- Ability to retry with different topics
- Session history tracking

---

### 2.5 DAF (Delayed Auditory Feedback) Session

**Feature Overview:**
DAF is a therapeutic technique that helps reduce stuttering by introducing a slight delay in hearing one's own voice, which can help improve speech fluency.

**How DAF Works:**
- User's voice is captured through microphone
- Audio is processed through a delay node (50-500ms configurable)
- Delayed audio is played back through headphones/speakers
- The delay creates a feedback loop that helps users regulate their speech pace
- Low-pass filter applied to simulate natural frequency characteristics
- Gain control for comfortable feedback volume

**User Experience:**
1. System checks for headphones (recommended for best experience)
2. User can generate a reading passage or use existing text
3. User adjusts delay time using a slider (50-500ms)
4. Real-time audio visualization (spectrogram-like bars) shows voice activity
5. User starts recording and reads the passage
6. Delayed feedback plays through headphones while speaking
7. Visual feedback shows audio levels in real-time
8. Session statistics tracked (words read, feedback count, duration)

**Technical Features:**
- Real-time audio processing using Web Audio API
- Adjustable delay while recording (live adjustment)
- Headphone detection and warnings
- Audio context management for browser compatibility
- Android/PWA-specific permission handling
- Clean audio cleanup on session end

**Therapeutic Benefits:**
- Helps users slow down speech naturally
- Reduces stuttering patterns through delayed feedback
- Builds awareness of speech pace
- Improves fluency through practice

---

### 2.6 AI Podcast (VAPI Voice Conversations)

**Feature Overview:**
Real-time voice conversations with AI therapist personas, providing conversational therapy practice in a safe, judgment-free environment.

**AI Personas:**
The system includes five specialized AI therapist personas, each with unique therapeutic approaches:

1. **Therapist Persona**
   - General speech therapy approach
   - Warm and encouraging
   - Focus on articulation and pacing
   - Provides gentle corrective feedback

2. **Stutter Specialist**
   - Specialized in stuttering therapy
   - Non-judgmental and patient
   - Creates safe practice environment
   - Focus on confidence building

3. **Casual Conversation Partner**
   - Friendly and approachable
   - Natural conversation flow
   - Everyday topics and interests
   - Encourages spontaneous speech

4. **Professional Coach**
   - Business communication focus
   - Formal and structured approach
   - Presentation skills development
   - Professional clarity emphasis

5. **Creative Partner**
   - Artistic and imaginative
   - Creative expression focus
   - Topics: art, literature, music, ideas
   - Thoughtful discussion encouragement

**How Conversations Work:**
- User selects a persona or uses default configuration
- System initializes VAPI voice AI service
- Real-time bidirectional voice conversation begins
- AI responds naturally to user speech
- Conversation flows naturally with context awareness
- User can speak naturally, pause, and continue

**Session Features:**
- Real-time transcription display (user and AI messages)
- Speaking indicators (when user is speaking, when AI is speaking)
- Volume level visualization
- Session duration tracking
- Mute/unmute controls
- End session capability
- Session data saved for review

**Technical Integration:**
- Uses VAPI platform for voice AI
- Supports both assistant ID and workflow ID configurations
- Fallback to custom persona configurations if IDs not provided
- Event handling for call start/end, speech detection, messages, volume levels
- Error handling and recovery
- Audio context management for browser compatibility

**User Benefits:**
- Practice conversational speech in safe environment
- No judgment or pressure
- Available 24/7
- Multiple therapeutic approaches
- Builds confidence through practice

---

### 2.7 Speech Analysis Dashboard

**Feature Overview:**
Comprehensive dashboard showing all user's speech analysis sessions, trends, and detailed insights.

**Dashboard View:**
- Lists all analysis sessions (passages and JAM sessions)
- Shows session dates and types
- Displays summary statistics for each session
- Quick access to detailed analysis
- Audio file listings with playback capability

**Analytics and Visualizations:**
- **Summary Charts**: Bar charts showing pattern distribution
- **Trend Analysis**: Line charts showing improvement over time
- **Pattern Breakdown**: Pie charts showing stutter pattern percentages
- **Radar Charts**: Multi-dimensional performance metrics
- **Historical Comparison**: Week-over-week, month-over-month trends

**Detailed Analysis View:**
- Per-session comprehensive analysis
- Timeline visualization with color-coded segments
- Pattern distribution charts
- Waveform display with audio player
- Quick statistics:
  - Normal speech percentage
  - Stutter rate
  - Total duration
  - Total segments analyzed
- Interactive timeline for navigation
- Audio playback synchronized with visualizations

**Data Management:**
- Signed URLs for secure audio access
- Pagination for large datasets
- Filtering and sorting capabilities
- Export capabilities (future enhancement)

---

## 3. How Speech Analysis Works

**End-to-End Process:**

1. **Recording Phase:**
   - User records audio using browser's MediaRecorder API
   - Audio is captured in high quality (mono channel, optimal sampling rate)
   - Audio is converted to WAV format for maximum compatibility
   - Recording happens locally in the browser

2. **Upload Phase:**
   - Audio file is uploaded to secure cloud storage (Firebase Storage)
   - Session metadata is created and stored
   - User-specific folder structure ensures privacy
   - Audio file is stored with unique session ID

3. **Analysis Phase:**
   - System retrieves the audio file from storage
   - Audio is sent to external ML analysis service
   - ML service processes audio in segments (typically 2-second windows)
   - Each segment is analyzed for stutter patterns:
     - **Block**: Complete stoppage of speech
     - **Prolongation**: Extended sound duration
     - **Sound Repetition**: Repeated phonemes
     - **Word Repetition**: Repeated words or phrases
     - **Interjection**: Filler words (um, uh, like)
     - **NoStutteredWords**: Fluent speech segments
   - Confidence scores assigned to each detection
   - Summary statistics calculated

4. **Results Processing:**
   - Analysis results formatted with segments and summary
   - Results stored as JSON in cloud storage
   - Signed URL generated for audio playback
   - Complete analysis package returned to user

5. **Visualization Phase:**
   - Client receives analysis data
   - Timeline visualization created showing segments
   - Color-coded bars indicate pattern types
   - Summary charts generated
   - Audio player synchronized with timeline
   - Interactive navigation enabled

6. **Recommendations Phase (Optional):**
   - User can request AI-generated recommendations
   - System loads analysis JSON
   - Gemini AI generates personalized suggestions
   - Recommendations formatted as markdown
   - Stored per session for future reference

**Model Performance:**
- **Training Accuracy**: 75%
- **Test Accuracy**: 79%
- The model is trained on diverse speech samples
- External ML service handles the actual analysis
- Results include confidence scores for transparency

---

## 4. Data Storage and Management

**Firebase Storage:**
- **Audio Recordings**: Stored per user in `recordings/{userId}/{sessionId}.wav`
- **Analysis Results**: JSON files at `recordings/{userId}/{sessionId}.json`
- **Recommendations**: Markdown files at `recordings/{userId}/{sessionId}.md`
- Secure signed URLs for access
- User-specific folder structure ensures privacy

**Firebase Firestore (Optional):**
- **Recording Sessions**: Metadata for passage practice sessions
- **JAM Sessions**: Metadata for JAM exercise sessions
- **Recommendation Usage**: Rate limiting tracking per user
- System gracefully handles Firestore unavailability

**Data Privacy:**
- User-specific data isolation
- Secure access controls
- Signed URLs with expiration
- No cross-user data access

---

## 5. Visualizations and User Interface

**Speech Pattern Labels:**
- **Block**: Complete speech stoppage
- **Prolongation**: Extended sound duration
- **Interjection**: Filler words and sounds
- **WordRep**: Word repetition
- **SoundRep**: Sound/phoneme repetition
- **NoStutteredWords**: Fluent speech segments

**Visualization Components:**
- **Timeline Visualizer**: Shows segments across recording duration with color coding
- **Summary Charts**: Bar charts showing pattern distribution
- **Waveform Display**: Audio waveform synchronized with analysis
- **Pattern Distribution**: Pie charts and bar charts
- **Trend Graphs**: Line charts showing improvement over time
- **Interactive Elements**: Clickable timeline, zoom controls, audio scrubbing

**Color Coding:**
- Each stutter pattern type has distinct color
- Fluent speech segments highlighted differently
- Visual consistency across all visualizations
- Accessibility considerations for color-blind users

---

## 6. Assets from Figma

**Banner Assets:**
- Desktop and mobile variants for each major feature:
  - AI Podcast banners
  - DAF Session banners
  - Speech Analysis banners
  - Speech Therapy banners

**Homepage Assets:**
- SVG icons and illustrations
- Feature showcase graphics
- Hero section graphics
- Call-to-action graphics

**Login Assets:**
- Authentication page graphics
- SVG shapes and decorative elements
- Brand identity elements

**Gamification Assets:**
- Communication Quest icons (6 PNG files)
- Weekly Challenge badges (6 PNG files)
- Achievement graphics

**Miscellaneous Assets:**
- Empowering.png
- QuotePaper.svg
- Tape.svg
- daily_streak_icon.svg
- Logo variations (color, white, minimal)
- Favicon and PWA icons

**Tech Partner Logos:**
- AssemblyAI logo
- Gemini logo
- Google Cloud logo
- VAPI logo
- Whisper AI logo

All assets are professionally designed in Figma following modern UI/UX principles and exported in appropriate formats (WebP, PNG, SVG) for optimal web performance.

---

## 7. Progressive Web App (PWA) Features

**Manifest Configuration:**
- Standalone app mode
- Theme color customization
- Microphone permission declaration
- App shortcuts for quick access
- Icon sets for various device sizes

**Service Worker:**
- Caching of key routes and assets
- Offline capability for core features
- Automatic updates
- Background sync when online

**Mobile Optimization:**
- Responsive design for all screen sizes
- Touch-optimized interface
- Android-specific microphone permission handling
- PWA installation prompts

---

## 8. Environment Configuration

**Frontend Environment Variables:**
- Firebase configuration (API key, auth domain, project ID, storage bucket, messaging sender ID, app ID)
- API base URL (or auto-detected from hostname)
- VAPI public key (required for voice conversations)
- Optional VAPI assistant ID or workflow ID

**Backend Environment Variables:**
- Google Generative AI API key (for passage generation and recommendations)
- Google Speech-to-Text API key (for speech recognition in exercises)
- Firebase Admin credentials (project ID, private key, client email, storage bucket)
- External ML analysis service URL (for speech analysis)
- Performance limits (max analysis files, max audio files)

---

## 9. Deployment Architecture

**Frontend Deployment (Netlify):**
- Build process configured
- SPA routing handled via redirects
- Automatic HTTPS/SSL
- CDN distribution
- Continuous deployment from Git

**Backend Deployment (Render.com):**
- Node.js service configuration
- Health check endpoint
- Environment variable management
- Auto-scaling capabilities
- Log aggregation

**Integration:**
- Frontend and backend communicate via API
- CORS configured for security
- Secure authentication flow
- Error handling and logging

---

## 10. Feature Summary Checklist

✅ **Authentication**: Google OAuth via Firebase  
✅ **Speech Therapy Exercises**: English and Hindi letters, words, MCQs, matras  
✅ **Reading Passages**: AI-generated passages with analysis  
✅ **JAM Sessions**: 60-second timed speaking exercises  
✅ **DAF Sessions**: Delayed auditory feedback therapy  
✅ **Speech Analysis**: Comprehensive ML-powered analysis  
✅ **AI Conversations**: VAPI-powered voice therapy sessions  
✅ **Progress Dashboard**: Analytics and trend visualization  
✅ **PWA Support**: Offline capability and app installation  
✅ **Multi-language**: English and Hindi support  
✅ **Visual Assets**: Professional Figma-designed graphics  

---

## 11. Model Performance Metrics

**Speech Analysis Accuracy:**
- **Training Accuracy**: 75%
- **Test Accuracy**: 79%

The ML model analyzes speech recordings and identifies stutter patterns with these accuracy levels. The model processes audio in segments and provides confidence scores for each detection, allowing users to understand the reliability of the analysis.

---

## 12. User Experience Highlights

**Accessibility:**
- Keyboard navigation support
- Screen reader compatibility
- Clear visual feedback
- Error prevention and recovery
- Multiple input methods

**Performance:**
- Fast page load times
- Smooth animations
- Responsive interactions
- Optimized asset loading
- Efficient data fetching

**User Support:**
- Clear instructions and guidance
- Helpful error messages
- Progressive feature disclosure
- Tooltips and hints
- Tutorial flows

---

*This document reflects the current state of the Speech Therapy AI Platform as implemented in the codebase. All features described are functional and available to users.*
