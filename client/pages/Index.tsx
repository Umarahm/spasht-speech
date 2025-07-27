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
            Explore expert insights, self-care guides, and tools to support your mental health.
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
                Practical tips on stress management, mindfulness, and emotional resilience.
              </p>
            </div>
            <div className="pt-8">
              <button
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
                Audio sessions for guided meditation and deep breathing exercises.
              </p>
            </div>
            <div className="pt-8">
              <button
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
                className="bg-[#F39CAC] hover:bg-[#F39CAC]/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 py-3 rounded-full tracking-wide capitalize transition-colors"
              >
                Explore
              </button>
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
                Connect with others, share experiences, and find encouragement in a safe, supportive space.
              </p>

              {/* Call to Action Button */}
              <div className="pt-4">
                <button className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage text-lg md:text-xl font-semibold px-10 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors">
                  Join the Community
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex justify-center lg:justify-end p-8 md:p-12 lg:p-15">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/c601bb1abad81b80a480a34170e5db0104f0dbd2?width=1425"
                alt="Community illustration with colorful shapes and expressions"
                className="w-auto max-w-[712px] h-auto object-contain flex-shrink-0"
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
            <div className="bg-[#F9E6D0] rounded-[60px] h-[385px] lg:h-[385px] w-full relative top-[217px]"></div>

            {/* Illustration */}
            <div className="absolute inset-0 flex items-end justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/11fe8ea888334345d57fe29279d18b112f5544fb?width=754"
                alt="FAQ illustration with colorful head and thoughts"
                className="w-[377px] h-[574px] object-contain"
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
                Find answers to common questions about our services, therapy, and mental well-being.
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-[30px] p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                  Is your app accredited by any professional organizations?
                </p>
                <button className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#F7F6F4"/>
                    <path d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z" fill="#00373E"/>
                  </svg>
                </button>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-[30px] p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                  What is DAF?
                </p>
                <button className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#F7F6F4"/>
                    <path d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z" fill="#00373E"/>
                  </svg>
                </button>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-[30px] p-6 lg:p-8 flex items-center justify-between min-h-[126px]">
                <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                  What's the difference between therapy and coaching?
                </p>
                <button className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#F7F6F4"/>
                    <path d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z" fill="#00373E"/>
                  </svg>
                </button>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-[30px] p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                  How does the AI work?
                </p>
                <button className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#F7F6F4"/>
                    <path d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z" fill="#00373E"/>
                  </svg>
                </button>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-[30px] p-6 lg:p-8 flex items-center justify-between min-h-[92px]">
                <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                  Is this app suitable for children?
                </p>
                <button className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#F7F6F4"/>
                    <path d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z" fill="#00373E"/>
                  </svg>
                </button>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-[30px] p-6 lg:p-8 flex items-center justify-between min-h-[126px]">
                <p className="font-bricolage text-lg lg:text-xl text-speech-green font-medium leading-relaxed tracking-wide lg:leading-[34px] pr-4">
                  Is my information and session history kept confidential?
                </p>
                <button className="flex-shrink-0 w-[42px] h-[42px] bg-speech-bg rounded-full flex items-center justify-center">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#F7F6F4"/>
                    <path d="M18.75 30.225V12H23.43V30.225H18.75ZM12 23.34V18.885H30.18V23.34H12Z" fill="#00373E"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
