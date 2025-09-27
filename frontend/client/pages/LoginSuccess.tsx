import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useAuthContext } from '../components/auth/AuthProvider';

export default function LoginSuccess() {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home if not authenticated
        if (!user) {
            navigate('/login');
            return;
        }

        // Redirect to dashboard after 3 seconds
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 3000);

        return () => clearTimeout(timer);
    }, [user, navigate]);

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-speech-bg">
            <Navigation />

            {/* Success Section */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="relative bg-[#F9E6D0] rounded-[70px] overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[668px] flex items-center justify-center">
                    {/* Left Illustration */}
                    <div className="absolute left-0 top-0 h-full w-32 md:w-48 lg:w-80 overflow-hidden">
                        <img
                            src="/Gemini_Generated_Image_4bd4v34bd4v34bd4.png"
                            alt="Decorative illustration"
                            className="h-full w-auto object-cover object-right -ml-4 md:-ml-8 lg:-ml-12"
                        />
                    </div>

                    {/* Right Illustration */}
                    <div className="absolute right-0 top-0 h-full w-32 md:w-48 lg:w-80 overflow-hidden">
                        <img
                            src="/Gemini_Generated_Image_y3u95dy3u95dy3u9.png"
                            alt="Decorative illustration"
                            className="h-full w-auto object-cover object-left -mr-4 md:-mr-8 lg:-mr-12"
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
                        {/* Success Icon */}
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-speech-green rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20 6L9 17L4 12"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-speech-green mb-6 md:mb-8 leading-tight">
                            Welcome back, {user.displayName || user.email?.split('@')[0]}!
                        </h1>

                        {/* Subtitle */}
                        <p className="font-bricolage text-lg sm:text-xl md:text-2xl lg:text-2xl text-speech-green mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
                            You've successfully logged in to your Spasht account.
                            Redirecting you to your dashboard...
                        </p>

                        {/* Loading Animation */}
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-speech-green"></div>
                        </div>

                        {/* Manual Navigation */}
                        <div className="mt-8">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}


