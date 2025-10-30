import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Music, Timer, Lightbulb, BarChart3, Clock, Zap } from "lucide-react";
import { useAuthContext } from '../components/auth/AuthProvider';

export default function Jams() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  const handleStartJam = () => {
    navigate('/jam');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-speech-bg via-speech-bg to-speech-green/5">
      <Navigation />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-speech-green/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-speech-green/3 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-speech-green/4 rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-full px-8 py-3 mb-8 border border-speech-green/20 shadow-lg">
            <div className="p-2 bg-speech-green/20 rounded-full">
              <Timer className="w-5 h-5 text-speech-green" />
            </div>
            <span className="font-bricolage text-sm font-semibold text-speech-green tracking-wider uppercase">
              Just A Minute
            </span>
          </div>

          <h1 className="font-bricolage text-5xl md:text-7xl font-bold bg-gradient-to-r from-speech-green to-speech-green/80 bg-clip-text text-transparent mb-6 tracking-wide">
            Speech Jams
          </h1>
          <p className="font-bricolage text-xl text-speech-green/80 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Challenge yourself with Just A Minute (JAM) sessions! Speak continuously for exactly one minute on engaging topics,
            with helpful hints available if you get stuck. Get AI-powered analysis of your speech patterns.
          </p>
        </div>

        {/* Main JAM Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-16 shadow-xl border border-speech-green/10">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-speech-green/20">
              <Timer className="w-12 h-12 text-speech-green" />
            </div>

            <h2 className="font-bricolage text-3xl md:text-4xl font-bold bg-gradient-to-r from-speech-green to-speech-green/80 bg-clip-text text-transparent mb-4 tracking-wide">
              Just A Minute Sessions
            </h2>
            <p className="font-bricolage text-lg text-speech-green/70 max-w-2xl mx-auto mb-8 leading-relaxed tracking-wide">
              Experience our revolutionary Just A Minute speech therapy. Choose from beginner, intermediate, or advanced topics,
              speak for exactly 60 seconds, and receive detailed AI analysis of your speech patterns.
            </p>

            <Button
              onClick={handleStartJam}
              className="bg-gradient-to-r from-speech-green to-speech-green/90 hover:from-speech-green/90 hover:to-speech-green text-white font-bricolage font-semibold px-12 py-4 text-lg rounded-full tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Timer className="w-6 h-6 mr-3" />
              Start Your JAM
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-speech-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-xl flex items-center justify-center mb-4 border border-speech-green/20">
              <Clock className="w-6 h-6 text-speech-green" />
            </div>
            <h3 className="font-bricolage font-bold text-lg text-speech-green mb-2 tracking-wide">
              Exactly 60 Seconds
            </h3>
            <p className="font-bricolage text-sm text-speech-green/70 leading-relaxed tracking-wide">
              Practice continuous speech with precise timing. Our timer ensures you speak for exactly one minute every session.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-speech-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-xl flex items-center justify-center mb-4 border border-speech-green/20">
              <Lightbulb className="w-6 h-6 text-speech-green" />
            </div>
            <h3 className="font-bricolage font-bold text-lg text-speech-green mb-2 tracking-wide">
              Smart Hints System
            </h3>
            <p className="font-bricolage text-sm text-speech-green/70 leading-relaxed tracking-wide">
              Get stuck? Reveal up to 3 helpful hints to keep your JAM session flowing smoothly without breaking momentum.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-speech-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-xl flex items-center justify-center mb-4 border border-speech-green/20">
              <BarChart3 className="w-6 h-6 text-speech-green" />
            </div>
            <h3 className="font-bricolage font-bold text-lg text-speech-green mb-2 tracking-wide">
              AI-Powered Analysis
            </h3>
            <p className="font-bricolage text-sm text-speech-green/70 leading-relaxed tracking-wide">
              Receive detailed analysis of your speech patterns, fluency, and areas for improvement from advanced AI models.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-16 shadow-lg border border-speech-green/10">
          <h3 className="font-bricolage text-2xl font-bold text-center text-speech-green mb-8 tracking-wide">
            How JAM Sessions Work
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-speech-green/20">
                <span className="font-bricolage font-bold text-speech-green text-xl">1</span>
              </div>
              <h4 className="font-bricolage font-semibold text-speech-green mb-2">Choose Difficulty</h4>
              <p className="text-sm text-speech-green/70">Select beginner, intermediate, or advanced topics</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-speech-green/20">
                <span className="font-bricolage font-bold text-speech-green text-xl">2</span>
              </div>
              <h4 className="font-bricolage font-semibold text-speech-green mb-2">Get Your Topic</h4>
              <p className="text-sm text-speech-green/70">Receive an engaging topic to speak about</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-speech-green/20">
                <span className="font-bricolage font-bold text-speech-green text-xl">3</span>
              </div>
              <h4 className="font-bricolage font-semibold text-speech-green mb-2">JAM for 60 Seconds</h4>
              <p className="text-sm text-speech-green/70">Speak continuously with timer guidance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-speech-green/10 to-speech-green/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-speech-green/20">
                <span className="font-bricolage font-bold text-speech-green text-xl">4</span>
              </div>
              <h4 className="font-bricolage font-semibold text-speech-green mb-2">Get AI Analysis</h4>
              <p className="text-sm text-speech-green/70">Receive detailed speech pattern feedback</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="font-bricolage text-lg text-speech-green/70 mb-6 tracking-wide">
            Ready to challenge yourself with a JAM session?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartJam}
              className="bg-gradient-to-r from-speech-green to-speech-green/90 hover:from-speech-green/90 hover:to-speech-green text-white font-bricolage font-semibold px-8 py-3 rounded-full tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start JAM Session Now
            </Button>
            <Button
              variant="outline"
              className="font-bricolage border-2 border-speech-green text-speech-green hover:bg-speech-green hover:text-white transition-all duration-300 px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 bg-white/80 backdrop-blur-sm"
              onClick={() => window.history.back()}
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

