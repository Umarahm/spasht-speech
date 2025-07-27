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
              Connect with licensed AI therapists, counselors, and community to
              support your speech journey.
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
              Browse exercises, connect, and start your healing journey with our
              tried and tested professional AI Voice Coach.
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

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
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

              <button className="border border-speech-green text-speech-green hover:bg-speech-green hover:text-white font-bricolage text-lg md:text-xl font-semibold px-8 py-3 rounded-full tracking-wide capitalize transition-colors self-start">
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

              <button className="border border-speech-green text-speech-green hover:bg-speech-green hover:text-white font-bricolage text-lg md:text-xl font-semibold px-8 py-3 rounded-full tracking-wide capitalize transition-colors self-start">
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
                <button className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-8 py-3 rounded-full tracking-wide capitalize transition-colors">
                  Learn More
                </button>
              </div>

              {/* Illustration */}
              <div className="flex justify-center lg:justify-end">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/38bc7dc4b09c2ea5265fe9d32320e9d2f70b0ce9?width=1020"
                  alt="Wellness coaching illustration"
                  className="w-full max-w-md lg:max-w-lg h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
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

            {/* Navigation Arrows */}
            <div className="flex items-center space-x-4 pt-8">
              <button className="w-14 h-14 bg-white border border-speech-green rounded-full flex items-center justify-center hover:bg-speech-green hover:text-white transition-colors group">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.7071 6.29289C13.0976 6.68342 13.0976 7.31658 12.7071 7.70711L9.41421 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H9.41421L12.7071 16.2929C13.0976 16.6834 13.0976 17.3166 12.7071 17.7071C12.3166 18.0976 11.6834 18.0976 11.2929 17.7071L6.29289 12.7071C5.90237 12.3166 5.90237 11.6834 6.29289 11.2929L11.2929 6.29289C11.6834 5.90237 12.3166 5.90237 12.7071 6.29289Z"
                    className="fill-speech-green group-hover:fill-white"
                  />
                </svg>
              </button>

              <button className="w-14 h-14 bg-speech-green rounded-full flex items-center justify-center hover:bg-speech-green/90 transition-colors">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.29289 6.29289C6.90237 6.68342 6.90237 7.31658 7.29289 7.70711L10.5858 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H10.5858L7.29289 16.2929C6.90237 16.6834 6.90237 17.3166 7.29289 17.7071C7.68342 18.0976 8.31658 18.0976 8.70711 17.7071L13.7071 12.7071C14.0976 12.3166 14.0976 11.6834 13.7071 11.2929L8.70711 6.29289C8.31658 5.90237 7.68342 5.90237 7.29289 6.29289Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Testimonials */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-6">
            {/* Testimonial 1 */}
            <div className="bg-[#F9E6D0] rounded-[60px] p-8 md:p-12 lg:p-15 flex-1 min-h-[393px] flex flex-col justify-between">
              <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                "Solus made it so easy to find the right therapist for me. The
                sessions have truly transformed my mindset, and I feel more in
                control of my emotions than ever before!"
              </p>
              <p className="font-bricolage text-lg lg:text-xl text-speech-green leading-relaxed tracking-wide lg:leading-[26px]">
                — Anna R., 32
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-speech-green rounded-[60px] p-8 md:p-12 lg:p-15 flex-1 min-h-[393px] flex flex-col justify-between">
              <p className="font-bricolage text-lg lg:text-xl text-white leading-relaxed tracking-wide lg:leading-[26px] mb-8">
                "I was struggling with stress and anxiety, but the mindfulness
                programs on Solus have helped me regain balance. I finally feel
                like I'm prioritizing my mental well-being."
              </p>
              <p className="font-bricolage text-lg lg:text-xl text-white leading-relaxed tracking-wide lg:leading-[26px]">
                — Mark S., 41
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="bg-white rounded-[60px] px-8 md:px-12 lg:px-15 py-12 md:py-16">
          <h3 className="font-bricolage text-xl md:text-2xl lg:text-[22px] font-medium text-speech-green tracking-wide leading-relaxed">
            Our Tech
            <br />
            Partners
          </h3>
          {/* Partner logos would go here */}
        </div>
      </div>
    </div>
  );
}
