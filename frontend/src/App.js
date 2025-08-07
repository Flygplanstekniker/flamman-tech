import React, { useState } from "react";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Info from "./components/Info";
import Contact from "./components/Contact";

function App() {
  const [activeTab, setActiveTab] = useState('hem');

  const renderContent = () => {
    switch (activeTab) {
      case 'hem':
        return <Hero setActiveTab={setActiveTab} />;
      case 'tjanster':
        return <Services />;
      case 'info':
        return <Info />;
      case 'kontakt':
        return <Contact />;
      default:
        return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="App min-h-screen bg-black text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-0">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;