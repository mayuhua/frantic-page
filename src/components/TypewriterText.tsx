import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 100,
  delay = 0,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay + (currentIndex === 0 ? 0 : speed));

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay]);

  // Add cursor
  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-zaku-accent">|</span>
    </span>
  );
};