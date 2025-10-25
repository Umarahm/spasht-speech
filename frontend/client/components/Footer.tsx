export default function Footer() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 md:px-6 lg:px-8 overflow-x-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Section - Navigation & Links */}
                <div className="bg-white rounded-l-[30px] md:rounded-l-[50px] lg:rounded-r-none rounded-r-[30px] md:rounded-r-[50px] p-6 md:p-12 lg:p-15 min-h-[300px] md:min-h-[460px] flex flex-col">
                    {/* Logo */}
                    <h2 className="font-bricolage text-2xl md:text-4xl lg:text-[40px] font-bold text-speech-green leading-tight tracking-wide capitalize mb-6 md:mb-8">
                        Spasht
                    </h2>

                    {/* Navigation Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4 flex-1">
                        {/* Column 1 - Main Pages */}
                        <div className="space-y-3 md:space-y-4">
                            <a
                                href="/about"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                About
                            </a>
                            <a
                                href="/services"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Services
                            </a>
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Therapists
                            </a>
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Resources
                            </a>
                            <a
                                href="/contact"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Contact
                            </a>
                        </div>

                        {/* Column 2 - Social Media */}
                        <div className="space-y-3 md:space-y-4">
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Instagram
                            </a>
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Facebook
                            </a>
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                YouTube
                            </a>
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                LinkedIn
                            </a>
                        </div>

                        {/* Column 3 - Legal */}
                        <div className="space-y-3 md:space-y-4">
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Terms Of Use
                            </a>
                            <a
                                href="#"
                                className="block font-bricolage text-base md:text-lg text-speech-green hover:opacity-70 transition-opacity tracking-wide"
                            >
                                Privacy Policy
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-6 md:mt-8 pt-4">
                        <p className="font-bricolage text-sm md:text-lg text-gray-400 tracking-wide">
                            © [2025] Spasht by Umar Ahmed. All Rights Reserved.
                        </p>
                    </div>
                </div>

                {/* Right Section - CTA */}
                <div className="bg-speech-green rounded-r-[30px] md:rounded-r-[50px] lg:rounded-l-none rounded-l-[30px] md:rounded-l-[50px] p-6 md:p-12 lg:p-15 min-h-[250px] md:min-h-[460px] flex flex-col justify-between relative overflow-hidden">
                    {/* Illustration */}
                    <div className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-9 lg:right-12"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <h3 className="font-bricolage text-2xl md:text-4xl lg:text-[44px] font-bold text-white leading-tight tracking-wide max-w-[295px]">
                            Find Support, Guidance, and Balance.
                        </h3>
                    </div>

                    {/* CTA Button */}
                    <div className="relative z-10 mt-6 md:mt-8">
                        <button className="bg-white hover:bg-white/90 text-speech-green font-bricolage text-base md:text-xl font-semibold px-8 md:px-12 py-3 md:py-4 rounded-full tracking-wide capitalize transition-colors w-full max-w-[480px]">
                            Find Support Now with AI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


