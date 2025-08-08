import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

const Header = ({ activeTab, setActiveTab }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hem', label: 'Hem' },
    { id: 'tjanster', label: 'Tjänster' },
    { id: 'info', label: 'Info' },
    { id: 'kontakt', label: 'Kontakt' }
  ];

  const logoUrl = "https://customer-assets.emergentagent.com/job_dcc79c07-a5aa-45b6-be19-8cf05bb4f544/artifacts/hzwmjw3s_FlammanTech%209.png";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-lg shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => setActiveTab('hem')}
          >
            <img 
              src={logoUrl} 
              alt="Flamman Tech" 
              className="h-24 w-auto filter drop-shadow-lg"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 text-lg font-medium transition-all duration-300 hover:scale-105 ${
                  activeTab === item.id
                    ? 'text-orange-400 bg-orange-400/10'
                    : 'text-white hover:text-orange-300 hover:bg-white/5'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 animate-pulse" />
                )}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2">
            <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;