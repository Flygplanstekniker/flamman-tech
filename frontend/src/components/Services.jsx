import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Wrench, 
  ShoppingCart, 
  Users, 
  Settings, 
  Camera, 
  Brain 
} from 'lucide-react';
import { mockData } from '../mock';

const iconMap = {
  Wrench,
  ShoppingCart,
  Users,
  Settings,
  Camera,
  Brain
};

const Services = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Våra Tjänster
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Vi erbjuder ett brett utbud av IT-tjänster för privatpersoner och företag
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockData.services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <Card
                key={service.id}
                className="group bg-black/40 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-black" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Service Highlight */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-orange-500/20">
            <h3 className="text-3xl font-bold text-white mb-4">
              Specialiserat på IT-stöd för äldre
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Vi har tålamod och förståelse för att teknik kan kännas överväldigande. 
              Vårt mål är att göra IT enkelt och begripligt för alla.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;