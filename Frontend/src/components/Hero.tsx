import { ArrowRight } from 'lucide-react';
import CaFootIntro from "../assets/CaFooTIntro.mp4" // Adjust path as needed

export const Hero = () => {
  return (
    <div className="relative hero-gradient overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6 space-x-2">
                <span className="text-xl font-bold text-gray-800">CaFooT</span>
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Empowering</span>
                <span className="block gradient-text">Sustainability</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Track, Analyze, and Act! CaFooT makes understanding and reducing your carbon footprint effortless. From real-time tracking to AI-powered insights, we're here to help you take meaningful action for the planet.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-x-4">
                <a
                  href="/register"
                  className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-green-600 text-base font-medium rounded-full text-green-700 bg-transparent hover:bg-green-50 transform transition-all duration-300 hover:scale-105"
                >
                  Login
                </a>
              </div>
              
              <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center lg:text-left">
                <div className="animate-float" style={{ animationDelay: '0s' }}>
                  <h3 className="text-2xl font-bold text-green-600">1M+</h3>
                  <p className="text-gray-600">Active Users</p>
                </div>
                <div className="animate-float" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-2xl font-bold text-green-600">50K+</h3>
                  <p className="text-gray-600">Trees Planted</p>
                </div>
                <div className="animate-float" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-2xl font-bold text-green-600">100K+</h3>
                  <p className="text-gray-600">CO₂ Reduced</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Video Section */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="relative h-56 sm:h-72 md:h-96 lg:h-full">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={CaFootIntro} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};
