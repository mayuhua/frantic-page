import React, { useState, useEffect } from 'react';

const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    { id: 'hero', name: 'Home', icon: '🏠' },
    { id: 'klarna', name: 'Klarna', icon: '💼' },
    { id: 'logos', name: 'Partners', icon: '🤝' },
    { id: 'vibe', name: 'Projects', icon: '🚀' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Side Navigation */}
      <nav
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isExpanded ? 'translate-x-0' : '-translate-x-12'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative">
          {/* Navigation Container */}
          <div className="bg-zaku-dark/95 backdrop-blur-md border border-zaku-blue/30 rounded-2xl p-3 shadow-2xl">
            {/* Navigation Items */}
            <div className="flex flex-col space-y-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group relative p-4 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-zaku-green text-white zaku-border shadow-lg shadow-zaku-green/25'
                      : 'text-gray-300 hover:text-zaku-light-green hover:bg-zaku-green/10'
                  }`}
                  title={section.name}
                >
                  {/* Icon */}
                  <span className="text-2xl block">{section.icon}</span>

                  {/* Tooltip - shown when expanded */}
                  <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-zaku-dark border border-zaku-blue/30 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                  }`}>
                    <span className="text-sm font-medium text-zaku-light-green">
                      {section.name}
                    </span>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-zaku-dark border-l border-t border-zaku-blue/30 rotate-45"></div>
                  </div>

                  {/* Active Indicator */}
                  {activeSection === section.id && (
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-zaku-green rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Logo at bottom */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-16 h-16 bg-zaku-green rounded-xl zaku-border flex items-center justify-center shadow-lg shadow-zaku-green/25">
              <span className="text-black font-black text-xl">K</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zaku-dark/95 backdrop-blur-md border-t border-zaku-blue/30">
        <div className="flex justify-around items-center py-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                activeSection === section.id
                  ? 'text-zaku-light-green'
                  : 'text-gray-400 hover:text-zaku-light-green'
              }`}
            >
              <span className="text-xl mb-1">{section.icon}</span>
              <span className="text-xs font-medium">{section.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;