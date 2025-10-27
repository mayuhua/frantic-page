import React from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import KlarnaTimer from './components/KlarnaTimer';
import LogoGallery from './components/LogoGallery';
import VibeCodingSection from './components/VibeCodingSection';

function App() {
  return (
    <div className="min-h-screen bg-zaku-dark">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="md:pl-20 pb-20 md:pb-0">
        {/* Hero Section with 3D Kampfer */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* Klarna Timer Section */}
        <section id="klarna">
          <KlarnaTimer />
        </section>

        {/* Logo Gallery Section */}
        <section id="logos">
          <LogoGallery />
        </section>

        {/* Vibe Coding Section */}
        <section id="vibe">
          <VibeCodingSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-8 px-4 md:pl-20 border-t border-zaku-green/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <div className="w-12 h-12 bg-zaku-green rounded-lg zaku-border mx-auto flex items-center justify-center mb-2">
              <span className="text-black font-black text-lg">K</span>
            </div>
            <h3 className="text-xl font-black text-zaku-light-green zaku-text mb-2">
              Frantic Unit
            </h3>
            <p className="text-gray-400 text-sm">
              Engineering the future, one line of code at a time
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-4">
            <a
              href="https://www.linkedin.com/in/franticma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zaku-light-green hover:text-zaku-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/mayuhua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zaku-light-green hover:text-zaku-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:frantic.ma@gmail.com"
              className="text-zaku-light-green hover:text-zaku-accent transition-colors"
            >
              Email
            </a>
          </div>

          <div className="text-xs text-gray-500">
            © 2025 Frantic Unit. Built with React, Three.js, and lots of ☕
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
