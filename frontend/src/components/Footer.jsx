import React from 'react';
import { mockData } from '../mock';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-orange-500/20 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and company info */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img 
              src="https://customer-assets.emergentagent.com/job_dcc79c07-a5aa-45b6-be19-8cf05bb4f544/artifacts/a5h78o7e_FlammanTech%2014.png"
              alt="Flamman Tech" 
              className="h-8 w-auto filter drop-shadow-lg"
            />
            <div className="text-gray-300">
              <div className="font-semibold">{mockData.company.name}</div>
              <div className="text-sm text-gray-400">{mockData.company.description}</div>
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 md:mb-0">
            <a 
              href={`tel:${mockData.company.contact.phone}`}
              className="text-orange-400 hover:text-orange-300 transition-colors duration-300 flex items-center space-x-2"
            >
              <span>📞</span>
              <span>{mockData.company.contact.phone}</span>
            </a>
            <a 
              href={`mailto:${mockData.company.contact.email}`}
              className="text-orange-400 hover:text-orange-300 transition-colors duration-300 flex items-center space-x-2"
            >
              <span>📧</span>
              <span>{mockData.company.contact.email}</span>
            </a>
            <div className="text-gray-400 flex items-center space-x-2">
              <span>📍</span>
              <span>{mockData.company.contact.address}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent my-6"></div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} {mockData.company.name}. Alla rättigheter förbehållna.
          </p>
          <p className="mt-1">
            Byggt med ❤️ av {mockData.company.owner}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;