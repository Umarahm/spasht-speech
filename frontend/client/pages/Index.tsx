import Navigation from "@/components/Navigation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/auth/AuthProvider";

export default function Index() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleButtonClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-speech-bg">
      <Navigation onScrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#F9E6D0] to-[#F5DCC4] rounded-[70px] overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[668px] flex items-center justify-center shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-speech-green rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-speech-green rounded-full blur-3xl"></div>
          </div>

          {/* Left Illustration */}
          <div className="absolute left-0 top-0 h-full w-32 md:w-48 lg:w-80 overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/ba8eb9e5ca66cc2a29598ef1750fb1ea808c2d1e?width=761"
              alt="Decorative illustration"
              className="h-full w-auto object-cover object-right -ml-4 md:-ml-8 lg:-ml-12 opacity-80"
            />
          </div>

          {/* Right Illustration */}
          <div className="absolute right-0 top-0 h-full w-32 md:w-48 lg:w-80 overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/3f49dd94842b4269f37d4412715f16adc1acc0df?width=813"
              alt="Decorative illustration"
              className="h-full w-auto object-cover object-left -mr-4 md:-mr-8 lg:-mr-12 opacity-80"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
            <h1 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-speech-green mb-6 md:mb-8 leading-tight drop-shadow-sm">
              Start Your Speech Journey
            </h1>

            <p className="font-bricolage text-lg sm:text-xl md:text-2xl lg:text-2xl text-speech-green/90 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
              Connect with AI therapists, AI counselors, and community to
              support your speech journey.
            </p>

            <button
              onClick={handleButtonClick}
              className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <div id="about" className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[550px]">
              <img
                src="/assets/Empowering.png"
                alt="Empowering Voices, Transforming Lives illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            {/* Section Label */}
            <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase">
              ABOUT US
            </p>

            {/* Main Heading */}
            <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide">
              Empowering Voices, Transforming Lives
            </h2>

            {/* Description */}
            <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
              Spasht is a cutting-edge speech therapy platform that combines AI technology with
              personalized coaching to help individuals overcome speech challenges and build
              confidence in their communication.
            </p>

            <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
              Our mission is to make professional speech therapy accessible to everyone,
              regardless of location or background, through innovative technology and
              evidence-based practices.
            </p>

            {/* Call to Action Button */}
            <div className="pt-4">
              <button
                onClick={handleButtonClick}
                className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
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
              Browse exercises, connect, and start your healing journey with our
              tried and tested professional AI Voice Coach.
            </p>

            {/* Call to Action Button */}
            <div className="pt-4">
              <button
                onClick={handleButtonClick}
                className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors"
              >
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

      {/* Services Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase mb-4">
            SERVICES
          </p>
          <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide mb-6">
            Your Path to Well-being
          </h2>
          <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px] max-w-2xl mx-auto">
            Discover expert guidance for a healthier speech, mind and balanced
            life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {/* Top Row - Services 1 & 2 */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Service 1 - Mindfulness & Meditation */}
            <div className="relative bg-[#F9E6D0] rounded-[60px] p-8 md:p-12 lg:p-15 min-h-[455px] flex flex-col justify-between overflow-hidden">
              <div>
                <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                  Mindfulness & Meditation
                </h3>
                <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                  Guided meditation sessions and stress management techniques.
                </p>
              </div>

              {/* Illustration */}
              <div className="absolute right-8 top-8 lg:right-12 lg:top-12 w-32 md:w-48 lg:w-56">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f96e34184b20fb2e857d59c9b440f2aed1ee678e?width=458"
                  alt="Mindfulness and meditation illustration"
                  className="w-full h-auto object-contain"
                />
              </div>

              <button
                onClick={handleButtonClick}
                className="border border-speech-green text-speech-green hover:bg-speech-green hover:text-white font-bricolage text-lg md:text-xl font-semibold px-8 py-3 rounded-full tracking-wide capitalize transition-colors self-start"
              >
                Learn More
              </button>
            </div>

            {/* Service 2 - Podcast/One-on-One */}
            <div className="relative bg-[#F8ECEC] rounded-[60px] p-8 md:p-12 lg:p-15 min-h-[455px] flex flex-col justify-between overflow-hidden">
              <div>
                <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide mb-6">
                  Podcast or One-on-One we have it all!
                </h3>
                <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                  Virtual therapy sessions with trained Voice AI models.
                </p>
              </div>

              <button
                onClick={handleButtonClick}
                className="border border-speech-green text-speech-green hover:bg-speech-green hover:text-white font-bricolage text-lg md:text-xl font-semibold px-8 py-3 rounded-full tracking-wide capitalize transition-colors self-start"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Bottom Row - Service 3 (Full Width) */}
          <div className="relative bg-white rounded-[60px] p-8 md:p-12 lg:p-15 min-h-[455px] overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
              {/* Content */}
              <div className="space-y-6">
                <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide">
                  Wellness Coaching
                </h3>
                <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                  Personalized exercises and activities to help you improve
                  communication skills, overcome speech challenges, and express
                  yourself with confidence.
                </p>
                <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                  Our certified speech-language pathologists guide you through
                  for clear, effective, and fluent communication.
                </p>
                <button
                  onClick={handleButtonClick}
                  className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-8 py-3 rounded-full tracking-wide capitalize transition-colors"
                >
                  Learn More
                </button>
              </div>

              {/* Illustration */}
              <div className="flex justify-center lg:justify-end">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/38bc7dc4b09c2ea5265fe9d32320e9d2f70b0ce9?width=1020"
                  alt="Wellness coaching illustration"
                  className="w-full max-w-md lg:max-w-[554px] h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase mb-4">
            EXPLORE & LEARN
          </p>
          <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide mb-6">
            Resources for Your Well-being
          </h2>
          <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px] max-w-2xl mx-auto">
            Explore expert insights, self-care guides, and tools to support your
            mental health.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Resource 1 - Articles & Guides */}
          <div className="bg-white rounded-[59px] p-8 md:p-10 lg:p-12 text-center flex flex-col justify-between min-h-[404px]">
            <div className="flex-1 space-y-6">
              <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                Articles & Guides
              </h3>
              <p className="font-bricolage text-lg lg:text-[18px] text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                Practical tips on stress management, mindfulness, and emotional
                resilience.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={handleButtonClick}
                className="bg-[#EFC01D] hover:bg-[#EFC01D]/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 py-3 rounded-full tracking-wide capitalize transition-colors"
              >
                Explore
              </button>
            </div>
          </div>

          {/* Resource 2 - Meditation & Relaxation */}
          <div className="bg-white rounded-[59px] p-8 md:p-10 lg:p-12 text-center flex flex-col justify-between min-h-[404px]">
            <div className="flex-1 space-y-6">
              <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                Meditation & Relaxation
              </h3>
              <p className="font-bricolage text-lg lg:text-[18px] text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                Audio sessions for guided meditation and deep breathing
                exercises.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={handleButtonClick}
                className="bg-[#4CCBBB] hover:bg-[#4CCBBB]/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 py-3 rounded-full tracking-wide capitalize transition-colors"
              >
                Explore
              </button>
            </div>
          </div>

          {/* Resource 3 - Webinars & Workshops */}
          <div className="bg-white rounded-[59px] p-8 md:p-10 lg:p-12 text-center flex flex-col justify-between min-h-[404px] md:col-span-2 lg:col-span-1">
            <div className="flex-1 space-y-6">
              <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                Webinars & Workshops
              </h3>
              <p className="font-bricolage text-lg lg:text-[18px] text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                Live and recorded sessions with mental health professionals.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={handleButtonClick}
                className="bg-[#F39CAC] hover:bg-[#F39CAC]/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 py-3 rounded-full tracking-wide capitalize transition-colors"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8 mt-16 md:mt-20 lg:mt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Section Label */}
            <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase">
              TESTIMONIALS
            </p>

            {/* Main Heading */}
            <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide">
              What Our Clients Are Saying
            </h2>

            {/* Description */}
            <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
              Positive experiences from users who have benefited from therapy or
              wellness programs.
            </p>

            {/* Spacer to align Sarah K. with Mark S. */}
            <div className="flex-1 min-h-[50px]"></div>

            {/* Testimonial 3 - Sarah K. */}
            <div className="bg-[#F8ECEC] rounded-[60px] p-8 md:p-12 lg:p-15 flex-1 min-h-[393px] flex flex-col justify-between">
              <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                "The speech therapy exercises on Spasht have been incredible for my confidence.
                I've overcome my stutter and now speak with clarity and poise in all situations.
                This platform truly changed my life!"
              </p>
              <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                — Sarah K., 28
              </p>
            </div>
          </div>

          {/* Right Testimonials */}
          <div className="flex flex-col gap-6">
            {/* Testimonial 1 - Anna R. */}
            <div className="bg-[#F9E6D0] rounded-[60px] p-8 md:p-12 lg:p-15 flex-1 min-h-[393px] flex flex-col justify-between">
              <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                "Spasht made it so easy to find the right therapist for me. The
                sessions have truly transformed my mindset, and I feel more in
                control of my emotions than ever before!"
              </p>
              <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                — Anna R., 32
              </p>
            </div>

            {/* Testimonial 2 - Mark S. */}
            <div className="bg-speech-green rounded-[60px] p-8 md:p-12 lg:p-15 flex-1 min-h-[393px] flex flex-col justify-between">
              <p className="font-bricolage text-lg lg:text-xl text-white leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                "I was struggling with stress and anxiety, but the mindfulness
                programs on Spasht have helped me regain balance. I finally feel
                like I'm prioritizing my mental well-being."
              </p>
              <p className="font-bricolage text-lg lg:text-xl text-white leading-relaxed tracking-wide lg:leading-[26px]">
                — Mark S., 41
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section (hidden on mobile, shown on md+) */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="bg-white rounded-[60px] px-8 md:px-12 lg:px-15 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <h3 className="font-bricolage text-xl md:text-2xl lg:text-[22px] font-medium text-speech-green tracking-wide leading-relaxed">
              Our Tech
              <br />
              Partners
            </h3>

            {/* Tech Partner Logos */}
            <div className="flex items-center justify-between flex-1 ml-4 md:ml-8">

              {/* AssemblyAI */}
              <img
                src="/techpartners/assemblyai.svg"
                alt="AssemblyAI"
                className="w-28 h-28 md:w-32 md:h-32 object-contain"
              />

              {/* Gemini */}
              <img
                src="/techpartners/gemini.svg"
                alt="Gemini"
                className="w-28 h-28 md:w-32 md:h-32 object-contain"
              />

              {/* Google Cloud */}
              <img
                src="/techpartners/googlecloud.svg"
                alt="Google Cloud"
                className="w-28 h-28 md:w-32 md:h-32 object-contain"
              />

              {/* Whisper AI */}
              <img
                src="/techpartners/whisperai.svg"
                alt="Whisper AI"
                className="w-28 h-28 md:w-32 md:h-32 object-contain"
              />

              {/* Vapi */}
              <img
                src="/techpartners/vapi.svg"
                alt="Vapi"
                className="w-24 h-24 md:w-28 md:h-28 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="bg-white rounded-[59px] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[587px]">
            {/* Left Content */}
            <div className="p-8 md:p-12 lg:p-15 space-y-6">
              {/* Section Label */}
              <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase">
                COMMUNITY
              </p>

              {/* Main Heading */}
              <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide">
                You're Not Alone on This Journey
              </h2>

              {/* Description */}
              <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
                Connect with others, share experiences, and find encouragement
                in a safe, supportive space.
              </p>

              {/* Call to Action Button */}
              <div className="pt-4">
                <button
                  onClick={handleButtonClick}
                  className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors"
                >
                  Join the Community
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex justify-end p-2 sm:p-4 md:p-6 lg:p-8 pr-0 md:pr-0 lg:pr-0">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/c601bb1abad81b80a480a34170e5db0104f0dbd2?width=1425"
                alt="Community illustration with colorful shapes and expressions"
                className="w-auto max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[712px] h-auto object-contain flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Content - Illustration */}
          <div className="relative">
            {/* Background container */}
            <div className="bg-[#F9E6D0] rounded-[60px] h-[352px] lg:h-[352px] w-full relative top-[217px]"></div>

            {/* Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/11fe8ea888334345d57fe29279d18b112f5544fb?width=754"
                alt="FAQ illustration with colorful head and thoughts"
                className="w-full h-[280px] sm:h-[350px] md:h-[438px] object-contain object-bottom flex-1 max-w-[300px] sm:max-w-[400px] md:max-w-[500px]"
              />
            </div>
          </div>

          {/* Right Content - FAQ */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-6">
              <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase">
                NEED HELP?
              </p>
              <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide">
                Frequently Asked Questions
              </h2>
              <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
                Find answers to common questions about our services, therapy,
                and mental well-being.
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-[30px] overflow-hidden">
                <div className="p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                  <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                    Is your app accredited by any professional organizations?
                  </p>
                  <button
                    onClick={() => toggleAccordion(0)}
                    className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center transition-transform duration-200"
                  >
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${openAccordion === 0 ? 'rotate-45' : ''}`}
                    >
                      <circle cx="21" cy="21" r="21" fill="#F7F6F4" />
                      <path
                        d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z"
                        fill="#00373E"
                      />
                    </svg>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <p className="font-bricolage text-base lg:text-lg text-speech-green/70 leading-relaxed tracking-wide">
                      Yes, our app is accredited by the American Speech-Language-Hearing Association (ASHA) and follows all HIPAA guidelines for data privacy and security.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-[30px] overflow-hidden">
                <div className="p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                  <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                    What is DAF?
                  </p>
                  <button
                    onClick={() => toggleAccordion(1)}
                    className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center transition-transform duration-200"
                  >
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${openAccordion === 1 ? 'rotate-45' : ''}`}
                    >
                      <circle cx="21" cy="21" r="21" fill="#F7F6F4" />
                      <path
                        d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z"
                        fill="#00373E"
                      />
                    </svg>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 1 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <p className="font-bricolage text-base lg:text-lg text-speech-green/70 leading-relaxed tracking-wide">
                      DAF stands for Delayed Auditory Feedback. It's a speech therapy technique that helps improve fluency by creating a slight delay in hearing your own voice, which can help reduce stuttering patterns.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-[30px] overflow-hidden">
                <div className="p-6 lg:p-8 flex items-center justify-between min-h-[126px]">
                  <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                    What's the difference between therapy and coaching?
                  </p>
                  <button
                    onClick={() => toggleAccordion(2)}
                    className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center transition-transform duration-200"
                  >
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${openAccordion === 2 ? 'rotate-45' : ''}`}
                    >
                      <circle cx="21" cy="21" r="21" fill="#F7F6F4" />
                      <path
                        d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z"
                        fill="#00373E"
                      />
                    </svg>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 2 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <p className="font-bricolage text-base lg:text-lg text-speech-green/70 leading-relaxed tracking-wide">
                      Therapy focuses on treating specific speech disorders and medical conditions with licensed professionals. Coaching is more about skill development, confidence building, and general communication improvement for personal or professional growth.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-[30px] overflow-hidden">
                <div className="p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                  <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                    How does the AI work?
                  </p>
                  <button
                    onClick={() => toggleAccordion(3)}
                    className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center transition-transform duration-200"
                  >
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${openAccordion === 3 ? 'rotate-45' : ''}`}
                    >
                      <circle cx="21" cy="21" r="21" fill="#F7F6F4" />
                      <path
                        d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z"
                        fill="#00373E"
                      />
                    </svg>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 3 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <p className="font-bricolage text-base lg:text-lg text-speech-green/70 leading-relaxed tracking-wide">
                      Our AI uses advanced natural language processing and speech recognition to analyze your speech patterns, provide real-time feedback, and guide you through personalized exercises tailored to your specific needs.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-[30px] overflow-hidden">
                <div className="p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                  <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                    Is this app suitable for children?
                  </p>
                  <button
                    onClick={() => toggleAccordion(4)}
                    className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center transition-transform duration-200"
                  >
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${openAccordion === 4 ? 'rotate-45' : ''}`}
                    >
                      <circle cx="21" cy="21" r="21" fill="#F7F6F4" />
                      <path
                        d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z"
                        fill="#00373E"
                      />
                    </svg>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 4 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <p className="font-bricolage text-base lg:text-lg text-speech-green/70 leading-relaxed tracking-wide">
                      Our app is designed for users aged 13 and above. For children under 13, we recommend consulting with a pediatric speech-language pathologist for appropriate therapeutic approaches.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-[30px] overflow-hidden">
                <div className="p-6 lg:p-8 flex items-center justify-between min-h-[126px]">
                  <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                    Is my information and session history kept confidential?
                  </p>
                  <button
                    onClick={() => toggleAccordion(5)}
                    className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center transition-transform duration-200"
                  >
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${openAccordion === 5 ? 'rotate-45' : ''}`}
                    >
                      <circle cx="21" cy="21" r="21" fill="#F7F6F4" />
                      <path
                        d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z"
                        fill="#00373E"
                      />
                    </svg>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 5 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <p className="font-bricolage text-base lg:text-lg text-speech-green/70 leading-relaxed tracking-wide">
                      Yes, we take privacy very seriously. All your information is encrypted, stored securely, and complies with HIPAA regulations. Your session data is only accessible to you and your assigned therapist with your explicit consent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-bricolage text-sm font-medium text-speech-green tracking-wide uppercase mb-4">
            GET IN TOUCH
          </p>
          <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-speech-green leading-tight tracking-wide mb-6">
            We're Here to Support You
          </h2>
          <p className="font-bricolage text-lg md:text-xl lg:text-[22px] text-speech-green leading-relaxed tracking-wide lg:leading-[34px] max-w-2xl mx-auto">
            Whether you have questions, need help getting started, or want to
            learn more — reach out anytime.
          </p>
        </div>

        {/* Contact Content */}
        <div className="bg-white rounded-[50px] p-8 md:p-12 lg:p-15">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Content - Contact Details */}
            <div className="space-y-8">
              <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide">
                Contact Details:
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="font-bricolage text-lg lg:text-xl text-speech-green font-bold tracking-wide lg:leading-[34px]">
                    Email: spasht.ai@gmail.com
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="font-bricolage text-lg lg:text-xl text-speech-green font-bold tracking-wide lg:leading-[34px]">
                    Phone: +91 8618688496
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="font-bricolage text-lg lg:text-xl text-speech-green font-bold tracking-wide lg:leading-[34px]">
                    Address: Karnataka, India
                  </span>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4 pt-8">
                <a
                  href="#"
                  className="text-speech-green hover:opacity-70 transition-opacity"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 1.76471V22.2353C24 22.7033 23.8141 23.1522 23.4831 23.4831C23.1522 23.8141 22.7033 24 22.2353 24H1.76471C1.29668 24 0.847817 23.8141 0.51687 23.4831C0.185924 23.1522 0 22.7033 0 22.2353L0 1.76471C0 1.29668 0.185924 0.847817 0.51687 0.51687C0.847817 0.185924 1.29668 0 1.76471 0L22.2353 0C22.7033 0 23.1522 0.185924 23.4831 0.51687C23.8141 0.847817 24 1.29668 24 1.76471ZM7.05882 9.17647H3.52941V20.4706H7.05882V9.17647ZM7.37647 5.29412C7.37833 5.02715 7.32759 4.76242 7.22714 4.51506C7.12669 4.2677 6.9785 4.04255 6.79103 3.85246C6.60357 3.66237 6.38049 3.51107 6.13455 3.4072C5.88861 3.30332 5.62462 3.24891 5.35765 3.24706H5.29412C4.7512 3.24706 4.23053 3.46273 3.84663 3.84663C3.46273 4.23053 3.24706 4.7512 3.24706 5.29412C3.24706 5.83703 3.46273 6.35771 3.84663 6.74161C4.23053 7.1255 4.7512 7.34118 5.29412 7.34118C5.56111 7.34774 5.82678 7.30164 6.07594 7.2055C6.32511 7.10936 6.55289 6.96506 6.74627 6.78086C6.93965 6.59666 7.09484 6.37616 7.20297 6.13196C7.3111 5.88775 7.37006 5.62464 7.37647 5.35765V5.29412ZM20.4706 13.6094C20.4706 10.2141 18.3106 8.89412 16.1647 8.89412C15.4621 8.85894 14.7626 9.00858 14.1358 9.32814C13.5091 9.64769 12.9771 10.126 12.5929 10.7153H12.4941V9.17647H9.17647V20.4706H12.7059V14.4635C12.6549 13.8483 12.8487 13.2378 13.2452 12.7646C13.6417 12.2915 14.2089 11.9939 14.8235 11.9365H14.9576C16.08 11.9365 16.9129 12.6424 16.9129 14.4212V20.4706H20.4424L20.4706 13.6094Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="text-speech-green hover:opacity-70 transition-opacity"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 12.0728C24 5.4048 18.628 0 12 0C5.372 0 0 5.4048 0 12.0728C0 18.1 4.3872 23.0944 10.1248 24V15.5632H7.0784V12.072H10.1248V9.4128C10.1248 6.3872 11.916 4.7152 14.6576 4.7152C15.9696 4.7152 17.344 4.9512 17.344 4.9512V7.9224H15.8296C14.3392 7.9224 13.8752 8.8536 13.8752 9.8088V12.0728H17.2032L16.6712 15.5624H13.8752V24C19.6128 23.0944 24 18.1 24 12.0728Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="text-speech-green hover:opacity-70 transition-opacity"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.63857 7.63857C8.79529 6.48184 10.3641 5.832 12 5.832C13.6359 5.832 15.2047 6.48184 16.3614 7.63857C17.5182 8.79529 18.168 10.3641 18.168 12C18.168 13.6359 17.5182 15.2047 16.3614 16.3614C15.2047 17.5182 13.6359 18.168 12 18.168C10.3641 18.168 8.79529 17.5182 7.63857 16.3614C6.48184 15.2047 5.832 13.6359 5.832 12C5.832 10.3641 6.48184 8.79529 7.63857 7.63857ZM10.4677 15.6992C10.9535 15.9004 11.4742 16.004 12 16.004C13.0619 16.004 14.0804 15.5822 14.8313 14.8313C15.5821 14.0804 16.004 13.0619 16.004 12C16.004 10.9381 15.5821 9.91964 14.8313 9.16875C14.0804 8.41785 13.0619 7.996 12 7.996C11.4742 7.996 10.9535 8.09957 10.4677 8.30079C9.98195 8.50201 9.54055 8.79694 9.16875 9.16875C8.79694 9.54055 8.50201 9.98195 8.30079 10.4677C8.09957 10.9535 7.996 11.4742 7.996 12C7.996 12.5258 8.09957 13.0465 8.30079 13.5323C8.50201 14.0181 8.79694 14.4595 9.16875 14.8313C9.54055 15.2031 9.98195 15.498 10.4677 15.6992Z"
                      fill="currentColor"
                    />
                    <path
                      d="M19.5354 6.75097C19.8088 6.47754 19.9624 6.10669 19.9624 5.72C19.9624 5.33332 19.8088 4.96247 19.5354 4.68904C19.2619 4.41561 18.8911 4.262 18.5044 4.262C18.1177 4.262 17.7469 4.41561 17.4734 4.68904C17.2 4.96247 17.0464 5.33332 17.0464 5.72C17.0464 6.10669 17.2 6.47754 17.4734 6.75097C17.7469 7.02439 18.1177 7.178 18.5044 7.178C18.8911 7.178 19.2619 7.02439 19.5354 6.75097Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.0528 0.0719999C8.3328 0.0136 8.7408 0 12 0C15.26 0 15.6672 0.0143998 16.9464 0.0719999C18.224 0.1304 19.0976 0.3344 19.8608 0.6296C20.6612 0.931087 21.3863 1.40338 21.9856 2.0136C22.596 2.61306 23.0683 3.33845 23.3696 4.1392C23.6664 4.9024 23.8696 5.7752 23.928 7.0528C23.9864 8.3328 24 8.7408 24 12C24 15.2592 23.9864 15.6672 23.928 16.9472C23.8696 18.2248 23.6664 19.0976 23.3704 19.8608C23.0689 20.6612 22.5966 21.3863 21.9864 21.9856C21.3864 22.5968 20.6608 23.0688 19.8608 23.3696C19.0976 23.6664 18.2248 23.8696 16.9472 23.928C15.6672 23.9864 15.2592 24 12 24C8.7408 24 8.3328 23.9864 7.0528 23.928C5.7752 23.8696 4.9024 23.6664 4.1392 23.3704C3.33881 23.0689 2.61372 22.5966 2.0144 21.9864C1.4032 21.3864 0.9312 20.6608 0.6304 19.8608C0.3336 19.0976 0.1304 18.2248 0.0719999 16.9472C0.0136 15.6672 0 15.26 0 12C0 8.74 0.0143998 8.3328 0.0719999 7.0536C0.1304 5.776 0.3344 4.9024 0.6296 4.1392C0.931087 3.3388 1.40338 2.61371 2.0136 2.0144C2.6136 1.4032 3.3392 0.9312 4.1392 0.6304C4.9024 0.3336 5.7752 0.1304 7.0528 0.0719999ZM16.8496 2.232C15.584 2.1744 15.204 2.1624 12 2.1624C8.796 2.1624 8.416 2.1744 7.1504 2.232C5.9808 2.2856 5.3456 2.4808 4.9224 2.6456C4.40113 2.83758 3.92955 3.14404 3.5424 3.5424C3.1232 3.9624 2.8624 4.3624 2.6456 4.9224C2.48 5.3456 2.2856 5.9808 2.232 7.1504C2.1744 8.416 2.1624 8.796 2.1624 12C2.1624 15.204 2.1744 15.584 2.232 16.8496C2.2856 18.0192 2.4808 18.6544 2.6456 19.0776C2.8377 19.5988 3.14414 20.0704 3.5424 20.4576C3.92961 20.8559 4.40116 21.1623 4.9224 21.3544C5.3456 21.52 5.9808 21.7144 7.1504 21.768C8.416 21.8256 8.7952 21.8376 12 21.8376C15.2048 21.8376 15.584 21.8256 16.8496 21.768C18.0192 21.7144 18.6544 21.5192 19.0776 21.3544C19.5989 21.1624 20.0705 20.856 20.4576 20.4576C20.8559 20.0704 21.1623 19.5988 21.3544 19.0776C21.52 18.6544 21.7144 18.0192 21.768 16.8496C21.8256 15.584 21.8376 15.204 21.8376 12C21.8376 8.796 21.8256 8.416 21.768 7.1504C21.7144 5.9808 21.5192 5.3456 21.3544 4.9224C21.1376 4.3624 20.8776 3.9624 20.4576 3.5424C20.0376 3.1232 19.6376 2.8624 19.0776 2.6456C18.6544 2.48 18.0192 2.2856 16.8496 2.232Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="text-speech-green hover:opacity-70 transition-opacity"
                >
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5524 0.90332C5.69113 0.90332 0.107258 6.28155 0.104839 12.8912C0.103226 15.0049 0.677419 17.0678 1.76613 18.8848L0 25.0969L6.59919 23.4299C8.43485 24.3902 10.4759 24.891 12.5476 24.8896H12.5524C19.4137 24.8896 24.9976 19.5106 25 12.9009C25.0016 9.69929 23.7081 6.68558 21.3573 4.42026C19.0073 2.15413 15.8823 0.904127 12.5524 0.90332ZM12.5524 22.8646H12.5484C10.6919 22.8646 8.87097 22.384 7.28226 21.4759L6.90323 21.2598L2.98871 22.2485L4.03387 18.5711L3.7879 18.1945C2.75476 16.6188 2.20478 14.7754 2.20564 12.8912C2.20806 7.39687 6.85 2.92832 12.5565 2.92832C15.3194 2.92913 17.9169 3.96703 19.871 5.85009C21.825 7.73316 22.9 10.2372 22.8984 12.9001C22.896 18.3944 18.2548 22.8646 12.5516 22.8646H12.5524ZM18.2274 15.4009C17.9161 15.2517 16.3871 14.5267 16.1016 14.4259C15.8169 14.3267 15.6097 14.2751 15.4024 14.5751C15.196 14.8751 14.5992 15.5501 14.4185 15.7493C14.2363 15.9493 14.0548 15.9735 13.7435 15.8243C13.4323 15.6743 12.4298 15.3582 11.2427 14.3372C10.3177 13.5436 9.69355 12.563 9.5121 12.2622C9.33064 11.963 9.49274 11.8009 9.64839 11.6517C9.7879 11.5186 9.95968 11.3025 10.1145 11.1275C10.2694 10.9525 10.321 10.8275 10.4258 10.6275C10.529 10.4283 10.4774 10.2525 10.3992 10.1033C10.321 9.95251 9.7 8.47832 9.43952 7.87913C9.1879 7.29526 8.93145 7.37348 8.74032 7.3638C8.55887 7.35574 8.35242 7.35332 8.14355 7.35332C7.9379 7.35332 7.6 7.42832 7.31452 7.72832C7.02984 8.02832 6.22581 8.75251 6.22581 10.2267C6.22581 11.7017 7.34032 13.1259 7.49597 13.3259C7.65161 13.5251 9.68952 16.5517 12.8097 17.8501C13.5516 18.1574 14.1306 18.342 14.5831 18.4807C15.3282 18.709 16.0065 18.6759 16.5419 18.5993C17.1387 18.513 18.3823 17.8751 18.6403 17.1759C18.9 16.4767 18.9 15.8767 18.8226 15.7517C18.7468 15.6267 18.5387 15.5517 18.2274 15.4009Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>

              <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[34px]">
                We typically respond within 12 hours.
              </p>
            </div>

            {/* Right Content - Contact Form */}
            <div className="bg-[#FDF7F1] rounded-[50px] p-8 md:p-10 lg:p-12">
              <h3 className="font-bricolage text-2xl md:text-3xl lg:text-[30px] font-bold text-speech-green leading-tight tracking-wide mb-8">
                Send Us a Message
              </h3>

              <form className="space-y-6">
                <div>
                  <label className="block font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[34px] mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border-b border-speech-green bg-transparent py-2 font-bricolage text-lg lg:text-xl text-speech-green/20 placeholder:text-speech-green/20 leading-relaxed tracking-wide lg:leading-[34px] focus:outline-none focus:border-speech-green/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[34px] mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full border-b border-speech-green bg-transparent py-2 font-bricolage text-lg lg:text-xl text-speech-green/20 placeholder:text-speech-green/20 leading-relaxed tracking-wide lg:leading-[34px] focus:outline-none focus:border-speech-green/50 transition-colors resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Section - Navigation & Links */}
          <div className="bg-white rounded-l-[50px] lg:rounded-r-none rounded-r-[50px] p-8 md:p-12 lg:p-15 min-h-[460px] flex flex-col">
            {/* Logo */}
            <h2 className="font-bricolage text-3xl md:text-4xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide capitalize mb-8">
              Speech
            </h2>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 flex-1">
              {/* Column 1 - Main Pages */}
              <div className="space-y-4">
                <button
                  onClick={() => scrollToSection('about')}
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide text-left"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide text-left"
                >
                  Services
                </button>
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  Therapists
                </a>
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  Resources
                </a>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide text-left"
                >
                  Contact
                </button>
              </div>

              {/* Column 2 - Social Media */}
              <div className="space-y-4">
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  YouTube
                </a>
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  LinkedIn
                </a>
              </div>

              {/* Column 3 - Legal */}
              <div className="space-y-4">
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  Terms Of Use
                </a>
                <a
                  href="#"
                  className="block font-bricolage text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-4">
              <p className="font-bricolage text-lg text-gray-400 tracking-wide">
                © [2025] Spasht. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* Right Section - CTA */}
          <div className="bg-speech-green rounded-r-[50px] lg:rounded-l-none rounded-l-[50px] p-8 md:p-12 lg:p-15 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            {/* Illustration */}
            <div className="absolute top-8 right-8 lg:top-9 lg:right-12"></div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="font-bricolage text-3xl md:text-4xl lg:text-[44px] font-bold text-white leading-tight tracking-wide max-w-[295px]">
                Find Support, Guidance, and Balance.
              </h3>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 mt-8">
              <button className="bg-white hover:bg-white/90 text-speech-green font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors w-full max-w-[480px]">
                Find Support Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
