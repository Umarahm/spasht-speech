import Navigation from "@/components/Navigation";

export default function Index() {
  return (
    <div className="min-h-screen bg-speech-bg">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-bricolage text-4xl md:text-6xl lg:text-7xl font-bold text-speech-green mb-6">
            Welcome to Speech
          </h1>
          <p className="font-bricolage text-xl md:text-2xl text-speech-green/80 max-w-3xl mx-auto mb-12">
            Your voice, amplified. Transform the way you communicate with cutting-edge speech technology.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-xl font-semibold px-12 py-4 rounded-full tracking-wide capitalize transition-colors">
              Get Started
            </button>
            <button className="border-2 border-speech-green text-speech-green hover:bg-speech-green hover:text-white font-bricolage text-xl font-semibold px-12 py-4 rounded-full tracking-wide capitalize transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
