import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-4 py-4 md:px-6 lg:px-8 bg-speech-bg">
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
            <Link 
              to="/about" 
              className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
            >
              About
            </Link>
            <Link 
              to="/services" 
              className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className="font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
            >
              Contact
            </Link>
          </div>

          {/* Center Brand */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="font-bricolage text-5xl font-bold text-speech-green tracking-wide capitalize">
              Speech
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
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
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            {/* Mobile Brand */}
            <Link to="/" className="font-bricolage text-3xl md:text-4xl font-bold text-speech-green tracking-wide capitalize">
              Speech
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
              <Link 
                to="/about" 
                className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 space-y-3">
                <Button 
                  asChild
                  className="w-full bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg font-semibold py-4 rounded-full tracking-wide capitalize"
                >
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                </Button>
                <Button 
                  asChild
                  className="w-full bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg font-semibold py-4 rounded-full tracking-wide capitalize"
                >
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login / SignUp</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
