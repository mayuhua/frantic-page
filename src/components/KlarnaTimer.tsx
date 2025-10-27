import React, { useState, useEffect, useMemo } from 'react';

interface TimeElapsed {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

const KlarnaTimer: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });

  const startDate = useMemo(() => new Date('2021-09-08T00:00:00'), []);

  useEffect(() => {
    const calculateTimeElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const years = Math.floor(days / 365);

      setTimeElapsed({
        years,
        days: days % 365,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: totalSeconds % 60,
        totalSeconds
      });
    };

    calculateTimeElapsed();
    const interval = setInterval(calculateTimeElapsed, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const TimeUnit: React.FC<{ value: number; label: string; color?: string }> = ({
    value,
    label,
    color = 'text-zaku-light-green'
  }) => (
    <div className="text-center">
      <div className={`text-4xl md:text-6xl font-black ${color} zaku-text font-mono`}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zaku-blue to-zaku-light-blue mb-4 zaku-text">
            KLARNA JOURNEY
          </h2>
          <p className="text-xl text-gray-300">
            Building the future of fintech since September 8, 2021
          </p>
        </div>

        {/* Main Timer Display */}
        <div className="zaku-border rounded-2xl p-8 md:p-12 bg-zaku-dark/80 backdrop-blur-sm mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
            <TimeUnit value={timeElapsed.years} label="Years" />
            <TimeUnit value={timeElapsed.days} label="Days" />
            <TimeUnit value={timeElapsed.hours} label="Hours" />
            <TimeUnit value={timeElapsed.minutes} label="Minutes" />
            <TimeUnit
              value={timeElapsed.seconds}
              label="Seconds"
              color="text-pink-500"
            />
          </div>

          {/* Total Seconds Counter */}
          <div className="text-center mt-8 pt-8 border-t border-zaku-blue/30">
            <div className="text-lg text-gray-400 mb-2">Total Seconds of Service</div>
            <div className="text-3xl md:text-4xl font-black text-zaku-light-blue font-mono zaku-text">
              {timeElapsed.totalSeconds.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Service Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="zaku-border rounded-lg p-6 bg-zaku-dark/60 backdrop-blur-sm text-center">
            <div className="text-2xl md:text-3xl font-black text-zaku-light-blue mb-2">
              Solution Engineer
            </div>
            <div className="text-gray-400">
              Crafting seamless user experiences
            </div>
          </div>

          <div className="zaku-border rounded-lg p-6 bg-zaku-dark/60 backdrop-blur-sm text-center">
            <div className="text-2xl md:text-3xl font-black text-zaku-light-blue mb-2">
              Team Collaborator
            </div>
            <div className="text-gray-400">
              Working with amazing cross-functional teams
            </div>
          </div>

          <div className="zaku-border rounded-lg p-6 bg-zaku-dark/60 backdrop-blur-sm text-center">
            <div className="text-2xl md:text-3xl font-black text-zaku-light-blue mb-2">
              Innovation Driver
            </div>
            <div className="text-gray-400">
              Pushing boundaries in fintech technology
            </div>
          </div>
        </div>

        {/* Klarna Logo Area - Centered in second row */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div></div> {/* Empty div for left spacing */}
          <div className="zaku-border rounded-lg p-6 bg-zaku-dark/60 backdrop-blur-sm text-center">
            <img
              src="/logos/Klarna.png"
              alt="Klarna"
              className="h-16 max-w-full object-contain mx-auto"
              
            />
            <div className="text-lg text-gray-400 mt-2">Smoooth shopping since 2005</div>
          </div>
          <div></div> {/* Empty div for right spacing */}
        </div>
      </div>
    </section>
  );
};

export default KlarnaTimer;