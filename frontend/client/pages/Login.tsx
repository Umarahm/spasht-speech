import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "../components/Navigation";
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../hooks/use-auth';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-speech-bg">
      <Navigation />
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-speech-green/10 to-speech-green/5" />
          <img
            src="/Gemini_Generated_Image_y3u95dy3u95dy3u9.png"
            alt="Authentication illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-speech-green/20" />
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="font-bricolage text-3xl font-bold text-white mb-4">
              Welcome to Spasht
            </h2>
            <p className="font-bricolage text-lg text-white/90 max-w-md">
              Your gateway to seamless speech and communication solutions. 
              Join our community today.
            </p>
          </div>
        </div>

        {/* Right Side - Authentication Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Google Auth Button */}
            <div className="space-y-4">
              <GoogleAuthButton />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-speech-green/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-speech-bg px-2 font-bricolage text-speech-green/60">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            {/* Login/Signup Forms */}
            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}