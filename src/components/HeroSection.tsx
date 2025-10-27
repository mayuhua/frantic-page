import React from 'react';
import KampferModel from './KampferModel';
import { TypewriterText } from './TypewriterText';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden md:pl-20">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* 3D Kampfer Model */}
      <div className="absolute inset-0 flex items-center justify-center">
        <KampferModel />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pb-20 md:pb-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zaku-blue to-zaku-light-blue mb-4 zaku-text">
            FRANTIC MA
          </h1>
          <div className="text-2xl md:text-3xl text-zaku-light-blue font-bold mb-4">
            <TypewriterText
              text="Solution Delivery & Creative Technologist"
              speed={50}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-12 zaku-border rounded-lg p-6 bg-zaku-dark/80 backdrop-blur-sm">
          <p className="text-lg text-gray-300 leading-relaxed zaku-text">
            [ SYSTEM PROFILE // KÄMPFER UNIT SUPPORT LOG ] <br />
                ID: Yuhua Ma <br />
                RANK: Solution Engineer, Klarna Tech Division <br />
                EXPERIENCE: 20+ Years // Payment Systems & Merchant Integration <br />
                SPECIALTY: Complex Mission Architecture / Customer Interface Engineering <br />
                MOTTO: "Adapt. Integrate. Evolve." <br />
                STATUS: Active // Embracing Change <br />
          </p>
        </div>

        {/* Navigation Call to Action */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              const element = document.getElementById('klarna');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-3 bg-zaku-blue hover:bg-zaku-light-blue text-white font-bold rounded-lg zaku-border transform hover:scale-105 transition-all duration-300"
          >
            Klarna Journey
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('logos');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-3 bg-zaku-green hover:bg-zaku-light-green text-white font-bold rounded-lg zaku-border transform hover:scale-105 transition-all duration-300"
          >
            Partners
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('vibe');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-3 bg-zaku-accent hover:bg-zaku-accent/80 text-white font-bold rounded-lg zaku-border transform hover:scale-105 transition-all duration-300"
          >
            Projects
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-zaku-light-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-zaku-light-blue rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;