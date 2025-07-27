import Navigation from "@/components/Navigation";

export default function Index() {
  return (
    <div className="min-h-screen bg-speech-bg">
      <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="relative bg-[#F9E6D0] rounded-[70px] overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[668px] flex items-center justify-center">
          
          {/* Left Illustration */}
          <div className="absolute left-0 top-0 h-full w-32 md:w-48 lg:w-80 overflow-hidden">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/ba8eb9e5ca66cc2a29598ef1750fb1ea808c2d1e?width=761" 
              alt="Decorative illustration"
              className="h-full w-auto object-cover object-right -ml-4 md:-ml-8 lg:-ml-12"
            />
          </div>

          {/* Right Illustration */}
          <div className="absolute right-0 top-0 h-full w-32 md:w-48 lg:w-80 overflow-hidden">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/3f49dd94842b4269f37d4412715f16adc1acc0df?width=813" 
              alt="Decorative illustration"
              className="h-full w-auto object-cover object-left -mr-4 md:-mr-8 lg:-mr-12"
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
            
            {/* Main Heading */}
            <h1 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-speech-green mb-6 md:mb-8 leading-tight">
              Support for Your Speech
            </h1>
            
            {/* Subtitle */}
            <p className="font-bricolage text-lg sm:text-xl md:text-2xl lg:text-2xl text-speech-green mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
              Connect with licensed AI therapists, counselors, and community to support your speech journey.
            </p>
            
            {/* Call to Action Button */}
            <button className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">
            {/* Section Label */}
            <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase">
              HOW IT WORKS
            </p>
            
            {/* Main Heading */}
            <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide">
              We Help You Prioritize Your Speech Health
            </h2>
            
            {/* Description */}
            <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
              Browse exercises, connect, and start your healing journey with our tried and tested professional AI Voice Coach.
            </p>
            
            {/* Call to Action Button */}
            <div className="pt-4">
              <button className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors">
                Start Your Journey
              </button>
            </div>
          </div>

          {/* Right Illustration Container */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative bg-speech-green rounded-[60px] w-full max-w-[550px] aspect-[550/564] flex items-center justify-center overflow-hidden">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/94d811e65f6cd29f35f00f5fed21001c8bbdd9cf?width=832" 
                alt="AI Voice Coach illustration showing speech therapy process"
                className="w-[75%] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
