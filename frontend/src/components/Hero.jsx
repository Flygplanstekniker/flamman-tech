import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { mockData } from '../mock';

const Hero = ({ setActiveTab }) => {
  const heroRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = heroRef.current;
      
      const xPos = (clientX / offsetWidth - 0.5) * 20;
      const yPos = (clientY / offsetHeight - 0.5) * 20;
      
      heroRef.current.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-orange-500/5 to-transparent rotate-12 animate-spin-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Animated logo */}
        <div className="mb-8 animate-fade-in-up">
          <img 
            src="https://customer-assets.emergentagent.com/job_dcc79c07-a5aa-45b6-be19-8cf05bb4f544/artifacts/hzwmjw3s_FlammanTech%209.png"
            alt="Flamman Tech" 
            className="h-32 w-auto mx-auto filter drop-shadow-2xl animate-pulse-slow"
          />
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-orange-300 bg-clip-text text-transparent animate-fade-in-up delay-300">
          {mockData.company.name}
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-gray-300 mb-4 animate-fade-in-up delay-500">
          {mockData.company.description}
        </p>

        {/* Owner name */}
        <p className="text-xl text-orange-400 mb-12 animate-fade-in-up delay-700">
          {mockData.company.owner}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-1000">
          <Button
            onClick={() => setActiveTab('tjanster')}
            className="px-8 py-4 text-lg bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/25"
          >
            Se våra tjänster
          </Button>
          <Button
            onClick={() => setActiveTab('kontakt')}
            variant="outline"
            className="px-8 py-4 text-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Kontakta oss
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Floating tech elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-lg rotate-12 animate-float"></div>
      <div className="absolute bottom-32 right-16 w-12 h-12 bg-yellow-500/20 rounded-full animate-float delay-1000"></div>
      <div className="absolute top-1/2 right-10 w-8 h-8 bg-orange-400/30 rounded-sm rotate-45 animate-float delay-500"></div>
    </section>
  );
};

export default Hero;