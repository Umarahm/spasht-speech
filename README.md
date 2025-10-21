# 🎤 Speech Therapy App

A comprehensive AI-powered speech therapy platform designed to help individuals overcome speech challenges through personalized exercises, real-time analysis, and community support.

## ✨ Features

### 🗣️ Speech Analysis & Therapy
- **Real-time Speech Recognition**: Powered by Google Speech-to-Text API for accurate transcription
- **AI-Powered Analysis**: Advanced stutter pattern detection and analysis
- **Personalized Exercises**: JAM (Just-A-Minute) sessions and passage reading exercises
- **Progress Tracking**: Detailed analytics and improvement metrics over time

### 🤖 AI Integration
- **AI Therapists**: Connect with AI-powered therapy assistants
- **AI Counselors**: 24/7 emotional support and guidance
- **Voice Analysis**: Advanced speech pattern recognition using machine learning
- **Personalized Feedback**: Real-time feedback on speech clarity and fluency

### 📊 Analytics Dashboard
- **Comprehensive Charts**: Visual representation of speech patterns and progress
- **Stutter Pattern Analysis**: Detailed breakdown of blocking, prolongation, repetition patterns
- **Progress Trends**: Long-term improvement tracking with detailed metrics
- **Session History**: Complete record of all therapy sessions

### 🌐 Community & Support
- **Community Forums**: Connect with others on similar journeys
- **Expert Guidance**: Access to certified speech therapists
- **Support Groups**: Weekly challenges and community events
- **Blog & Resources**: Educational content and success stories

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Router 6** - Client-side routing
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase** - Authentication and cloud storage
- **Google Speech API** - Speech recognition
- **OpenAI** - AI-powered features

### Infrastructure
- **Vite** - Fast build tool and dev server
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality
- **Netlify** - Deployment platform

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Google Cloud Speech API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd speech-app
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Environment Configuration

#### Root .env
```bash
# Copy the example file
cp .env.example .env

# Configure your environment variables
NODE_ENV=development
```

#### Backend .env
```bash
cd backend
cp .env.example .env

# Configure backend environment variables
GOOGLE_SPEECH_API_KEY=your_google_speech_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
OPENAI_API_KEY=your_openai_api_key
```

#### Frontend .env
```bash
cd frontend/client
cp .env.example .env

# Configure frontend environment variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_VAPI_API_KEY=your_vapi_api_key
```

### 4. Firebase Setup
1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Set up Firestore Database
4. Configure Storage with appropriate security rules
5. Get your service account credentials

### 5. Google Cloud Speech API Setup
1. Enable Google Cloud Speech-to-Text API
2. Create a service account and download credentials
3. Add the API key to your backend environment

### 6. Development Server
```bash
# Start both frontend and backend servers
npm run dev

# Or run them separately:
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3001
```

### 7. Build for Production
```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
speech-app/
├── frontend/client/          # React SPA frontend
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Radix UI components
│   │   └── auth/            # Authentication components
│   ├── pages/               # Route components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and configurations
│   └── public/              # Static assets
├── backend/                  # Express API backend
│   ├── server/
│   │   ├── routes/          # API route handlers
│   │   └── index.ts         # Main server setup
│   └── shared/              # Shared types/interfaces
├── netlify/                  # Netlify deployment config
└── public/                   # Root static assets
```

## 🎯 Usage

### For Users
1. **Sign Up/Login**: Create an account or sign in with Google
2. **Complete Profile**: Set up your speech therapy goals
3. **Start Exercises**: Choose from JAM sessions or passage reading
4. **Record & Analyze**: Record your speech and get instant feedback
5. **Track Progress**: View detailed analytics and improvement trends
6. **Connect**: Join community discussions and get support

### For Developers
- **API Documentation**: Check `Jam&PassageApi.md` for detailed API specs
- **Component Library**: All UI components are in `frontend/client/components/ui/`
- **Type Safety**: Full TypeScript support with shared types in `backend/shared/`

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start dev servers (frontend + backend)
npm run dev:frontend        # Start frontend dev server only
npm run dev:backend         # Start backend dev server only

# Building
npm run build              # Build for production
npm run build:frontend     # Build frontend only
npm run build:backend      # Build backend only

# Production
npm start                  # Start production servers

# Testing & Quality
npm test                   # Run tests with Vitest
npm run typecheck          # TypeScript type checking
npm run format.fix         # Format code with Prettier

# Installation
npm run install:all        # Install all dependencies
```

## 🌐 Deployment

### Netlify (Recommended)
The app is pre-configured for Netlify deployment:

1. Connect your GitHub repository to Netlify
2. Use the `netlify.toml` configuration
3. Set environment variables in Netlify dashboard
4. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# The dist/ folder contains production-ready files
# Deploy the contents of dist/ to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Format code: `npm run format.fix`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

## 📝 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- 📧 Email: support@speechtherapyapp.com
- 💬 Community Forums: [Join our Discord]
- 📚 Documentation: [Link to docs]
- 🐛 Bug Reports: [GitHub Issues]

## 🔒 Security

- Never commit `.env` files containing sensitive information
- Use environment variables for all API keys and secrets
- Regularly update dependencies for security patches
- Follow Firebase security rules best practices

## 🙏 Acknowledgments

- **AI Partners**: VAPI, AssemblyAI, Google Cloud Speech, OpenAI
- **UI Framework**: Radix UI, Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Hosting**: Netlify

---

**Built with ❤️ for the speech therapy community**</content>
</xai:function_call">The user chose not to run this terminal command. ASK THE USER what they would like to do next. To proceed, they must switch to agent mode or manually apply the changes. 

Would you like me to help you with anything else regarding the README or the project setup?
