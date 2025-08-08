import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { mockData } from '../mock';

const Hero = ({ setActiveTab }) => {
  const heroRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = heroRef.current;
      
      const xPos = (clientX / offsetWidth - 0.5) * 30;
      const yPos = (clientY / offsetHeight - 0.5) * 30;
      
      setMousePosition({ x: xPos, y: yPos });
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
      {/* Dynamic animated background */}
      <div className="absolute inset-0">
        {/* Large animated orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-128 h-128 bg-gradient-to-l from-yellow-500/15 to-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translate3d(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px, 0)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-orange-500/8 to-transparent rotate-12 animate-spin-slow"
        ></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,165,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,165,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Animated logo with glow effect */}
        <div className="mb-12 animate-fade-in-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
            <img 
              src="https://customer-assets.emergentagent.com/job_dcc79c07-a5aa-45b6-be19-8cf05bb4f544/artifacts/hzwmjw3s_FlammanTech%209.png"
              alt="Flamman Tech" 
              className="relative h-40 w-auto mx-auto filter drop-shadow-2xl animate-pulse-slow hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Main heading with enhanced effects */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-yellow-400 bg-clip-text text-transparent animate-fade-in-up delay-300 hover:scale-105 transition-transform duration-500 cursor-default">
            {mockData.company.name}
          </h1>
          
          {/* Animated underline */}
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Enhanced subtitle */}
        <div className="mb-6 animate-fade-in-up delay-500">
          <p className="text-3xl md:text-4xl text-gray-200 mb-2 font-light">
            {mockData.company.description}
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-orange-500"></div>
            <p className="text-xl text-orange-400 font-medium tracking-wider">
              {mockData.company.owner}
            </p>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-orange-500"></div>
          </div>
        </div>

        {/* Location badge */}
        <div className="inline-flex items-center px-6 py-2 bg-black/40 border border-orange-500/30 rounded-full mb-12 animate-fade-in-up delay-700 backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <span className="text-gray-300">Baserad i Jönköping</span>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-1000">
          <Button
            onClick={() => setActiveTab('tjanster')}
            className="group px-10 py-5 text-lg bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-1"
          >
            <span className="flex items-center">
              Se våra tjänster
              <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</div>
            </span>
          </Button>
          <Button
            onClick={() => setActiveTab('kontakt')}
            variant="outline"
            className="group px-10 py-5 text-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 backdrop-blur-sm"
          >
            <span className="flex items-center">
              Kontakta oss
              <div className="ml-2 group-hover:rotate-12 transition-transform duration-300">📞</div>
            </span>
          </Button>
        </div>

        {/* Stats section */}
        <div className="flex justify-center items-center space-x-12 mt-16 animate-fade-in-up delay-1200">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">100+</div>
            <div className="text-gray-400 text-sm">Nöjda kunder</div>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">24h</div>
            <div className="text-gray-400 text-sm">Svarstid</div>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">5★</div>
            <div className="text-gray-400 text-sm">Kundbetyg</div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center relative overflow-hidden">
              <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-scroll-indicator"></div>
            </div>
            <span className="text-orange-400 text-xs">Scrolla ner</span>
          </div>
        </div>
      </div>

      {/* Enhanced floating tech elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg rotate-12 animate-float border border-orange-500/20 backdrop-blur-sm"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-l from-yellow-500/20 to-orange-500/20 rounded-full animate-float delay-1000 border border-yellow-500/20 backdrop-blur-sm"></div>
      <div className="absolute top-1/2 right-10 w-12 h-12 bg-gradient-to-br from-orange-400/30 to-yellow-400/30 rounded-sm rotate-45 animate-float delay-500 border border-orange-400/20 backdrop-blur-sm"></div>
      <div className="absolute top-1/3 left-20 w-8 h-8 bg-orange-500/40 rounded-full animate-float delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-yellow-500/40 rounded-sm rotate-12 animate-float delay-1500"></div>
    </section>
  );
};

export default Hero;