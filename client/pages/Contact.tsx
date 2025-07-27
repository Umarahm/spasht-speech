import Navigation from "@/components/Navigation";

export default function Contact() {
  return (
    <div className="min-h-screen bg-speech-bg">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-bricolage text-4xl md:text-6xl font-bold text-speech-green mb-6">
            Contact Us
          </h1>
          <p className="font-bricolage text-xl text-speech-green/80 max-w-2xl mx-auto">
            This page is ready for content. Continue prompting to add your contact information and forms.
          </p>
        </div>
      </div>
    </div>
  );
}
