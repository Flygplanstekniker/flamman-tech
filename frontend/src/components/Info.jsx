import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { mockData } from '../mock';

const Info = () => {
  const skills = [
    'Datorreparation', 'Mobilsupport', 'IT-konsultation', 
    'Fotografi', 'Drönartjänster', 'Molntjänster', 
    'Smarta hem', 'BankID-hjälp', 'Säkerhet'
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Main Info Card */}
        <Card className="bg-black/60 border border-orange-500/30 backdrop-blur-lg shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative h-64 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20"></div>
              <img 
                src={mockData.images.tech[1]} 
                alt="Tech workspace" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Content Side */}
            <CardContent className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Hej, jag är Melvin!
                </h2>
                <p className="text-orange-400 text-lg font-medium">
                  {mockData.company.owner}
                </p>
              </div>

              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Jag är en lokal tech-entusiast med bred IT-kunskap och passion för att hjälpa andra. 
                  Som ung entreprenör förstår jag både den senaste tekniken och utmaningarna som 
                  många upplever med IT.
                </p>

                <p className="text-lg leading-relaxed">
                  Min specialitet ligger i att förklara komplexa tekniska lösningar på ett enkelt 
                  och begripligt sätt. Oavsett om du behöver hjälp med din dator, vill lära dig 
                  använda BankID eller behöver professionella drone-foton, så finns jag här för dig.
                </p>

                <p className="text-lg leading-relaxed">
                  Baserad i <span className="text-orange-400 font-semibold">Jönköping</span> och 
                  alltid redo att hjälpa till med dina IT-utmaningar!
                </p>
              </div>

              {/* Skills */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Specialområden:</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-orange-500/50 text-orange-300 hover:bg-orange-500/20 transition-colors duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Photography Focus */}
          <Card className="bg-black/40 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 group">
            <CardContent className="p-6">
              <div className="mb-4 h-32 rounded-lg overflow-hidden">
                <img 
                  src={mockData.images.camera[0]} 
                  alt="Professional camera" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fotografi & Media</h3>
              <p className="text-gray-300">
                Professionell fotografering och videoproduktion för företag, fastigheter och evenemang.
              </p>
            </CardContent>
          </Card>

          {/* Tech Support Focus */}
          <Card className="bg-black/40 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 group">
            <CardContent className="p-6">
              <div className="mb-4 h-32 rounded-lg overflow-hidden">
                <img 
                  src={mockData.images.tech[2]} 
                  alt="Tech repair" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">IT-Support</h3>
              <p className="text-gray-300">
                Personlig och tålmodig hjälp med allt från grundläggande datoranvändning till avancerade IT-lösningar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Info;