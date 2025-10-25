import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, BookOpen } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "./auth/AuthProvider";
import Profile from "./Profile";

interface NavigationProps {
  showDailyStreak?: boolean;
  dailyStreak?: number;
  onScrollToSection?: (sectionId: string) => void;
}

export default function Navigation({ showDailyStreak = false, dailyStreak = 0, onScrollToSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <nav className="w-full px-4 py-4 md:px-6 lg:px-8 bg-speech-bg overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
            >
              Home
            </Link>
            {isLandingPage && (
              <>
                {onScrollToSection ? (
                  <button
                    onClick={() => onScrollToSection('about')}
                    className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                  >
                    About
                  </button>
                ) : (
                  <Link
                    to="/about"
                    className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                  >
                    About
                  </Link>
                )}
                {onScrollToSection ? (
                  <button
                    onClick={() => onScrollToSection('services')}
                    className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                  >
                    Services
                  </button>
                ) : (
                  <Link
                    to="/services"
                    className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                  >
                    Services
                  </Link>
                )}
                {onScrollToSection ? (
                  <button
                    onClick={() => onScrollToSection('contact')}
                    className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                  >
                    Contact
                  </button>
                ) : (
                  <Link
                    to="/contact"
                    className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                  >
                    Contact
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Center Brand */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to={user ? "/dashboard" : "/"}
              className="font-bricolage text-5xl font-bold text-speech-green tracking-wide capitalize"
            >
              Spasht
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Blog/Resources Button */}
                <Button
                  asChild
                  variant="outline"
                  className="bg-white hover:bg-speech-bg border-speech-green text-speech-green hover:text-speech-green font-bricolage text-lg font-semibold px-4 py-3 rounded-full tracking-wide transition-all duration-200 flex items-center space-x-2"
                >
                  <Link to="/blog">
                    <BookOpen size={18} />
                    <span className="hidden lg:inline">Resources</span>
                  </Link>
                </Button>

                {/* Daily Streak Display */}
                {showDailyStreak && (
                  <div className="hidden md:flex items-center gap-2">
                    <img
                      src="/assets/daily_streak_icon.svg"
                      alt="Daily Streak"
                      className="w-5 h-5"
                    />
                    <span className="font-bricolage text-sm text-orange-600 font-semibold tracking-wide">
                      {dailyStreak} day streak
                    </span>
                  </div>
                )}

                {/* Profile */}
                <Profile />
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-xl font-semibold px-10 py-6 rounded-full tracking-wide capitalize"
                >
                  <Link to="/about">About Us</Link>
                </Button>
                <Button
                  asChild
                  className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-xl font-semibold px-10 py-6 rounded-full tracking-wide capitalize"
                >
                  <Link to="/login">Login / SignUp</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            {/* Mobile Brand */}
            <Link
              to="/"
              className="font-bricolage text-3xl md:text-4xl font-bold text-speech-green tracking-wide capitalize"
            >
              Spasht
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-speech-green hover:opacity-70 transition-opacity"
            >
              <Menu size={32} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-6 pb-6 space-y-4">
              <Link
                to="/"
                className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {isLandingPage && (
                <>
                  {onScrollToSection ? (
                    <button
                      onClick={() => {
                        onScrollToSection('about');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2 text-left"
                    >
                      About
                    </button>
                  ) : (
                    <Link
                      to="/about"
                      className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                  )}
                  {onScrollToSection ? (
                    <button
                      onClick={() => {
                        onScrollToSection('services');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2 text-left"
                    >
                      Services
                    </button>
                  ) : (
                    <Link
                      to="/services"
                      className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Services
                    </Link>
                  )}
                  {onScrollToSection ? (
                    <button
                      onClick={() => {
                        onScrollToSection('contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2 text-left"
                    >
                      Contact
                    </button>
                  ) : (
                    <Link
                      to="/contact"
                      className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  )}
                </>
              )}

              <div className="pt-4 space-y-3">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    {/* Blog/Resources Button */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-white hover:bg-speech-bg border-speech-green text-speech-green hover:text-speech-green font-bricolage text-lg font-semibold py-3 rounded-full tracking-wide transition-all duration-200 flex items-center justify-center space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to="/blog" className="flex items-center space-x-2">
                        <BookOpen size={18} />
                        <span>Resources</span>
                      </Link>
                    </Button>

                    {/* Daily Streak Display */}
                    {showDailyStreak && (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <img
                          src="/assets/daily_streak_icon.svg"
                          alt="Daily Streak"
                          className="w-5 h-5"
                        />
                        <span className="font-bricolage text-sm text-orange-600 font-semibold tracking-wide">
                          {dailyStreak} day streak
                        </span>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <Profile />
                    </div>
                  </div>
                ) : (
                  <>
                    <Button
                      asChild
                      className="w-full bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg font-semibold py-4 rounded-full tracking-wide capitalize"
                    >
                      <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                        About Us
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg font-semibold py-4 rounded-full tracking-wide capitalize"
                    >
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Login / SignUp
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}