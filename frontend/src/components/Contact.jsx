import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send
} from 'lucide-react';
import { mockData } from '../mock';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    toast({
      title: "Meddelande skickat!",
      description: "Tack för ditt meddelande. Jag återkommer inom 24 timmar.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      value: mockData.company.contact.phone,
      action: `tel:${mockData.company.contact.phone}`
    },
    {
      icon: Mail,
      title: "E-post",
      value: mockData.company.contact.email,
      action: `mailto:${mockData.company.contact.email}`
    },
    {
      icon: MapPin,
      title: "Plats",
      value: mockData.company.contact.address,
      action: null
    },
    {
      icon: Clock,
      title: "Tillgänglighet",
      value: "Vardagar 08:00 - 18:00",
      action: null
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Kontakta Mig
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Har du frågor eller behöver hjälp med något? Hör av dig så löser vi det tillsammans!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-black/60 border border-orange-500/30 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange-400" />
                Skicka meddelande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="name"
                      placeholder="Ditt namn"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-black/40 border-orange-500/30 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Din e-post"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-black/40 border-orange-500/30 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors duration-300"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Telefonnummer (valfritt)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-black/40 border-orange-500/30 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <Input
                      name="subject"
                      placeholder="Ämne"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-black/40 border-orange-500/30 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors duration-300"
                    />
                  </div>
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Beskriv vad du behöver hjälp med..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="bg-black/40 border-orange-500/30 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Skicka meddelande
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card
                  key={info.title}
                  className="bg-black/40 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => info.action && window.open(info.action, '_self')}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{info.title}</h3>
                      <p className="text-gray-300">{info.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Quick Contact Image */}
            <Card className="bg-black/40 border border-orange-500/20 overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={mockData.images.tech[1]} 
                  alt="Contact us" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Snabb och personlig service
                  </h3>
                  <p className="text-gray-300">
                    Jag svarar vanligtvis inom några timmar och löser de flesta problem på plats samma dag.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-orange-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Redo att komma igång?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Ring mig direkt för akuta problem eller skicka ett meddelande så återkommer jag så snart som möjligt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open(`tel:${mockData.company.contact.phone}`, '_self')}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-4 h-4 mr-2" />
                Ring nu
              </Button>
              <Button
                onClick={() => window.open(`mailto:${mockData.company.contact.email}`, '_self')}
                variant="outline"
                className="px-8 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-4 h-4 mr-2" />
                Skicka e-post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;