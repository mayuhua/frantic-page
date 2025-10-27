import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// E-commerce and brand partners with file-based logos
const logoData = [
  {
    name: 'SHEIN',
    category: 'E-commerce',
    color: '#000000',
    logoText: 'SHEIN',
    logoUrl: '/logos/SHEIN.png'
  },
  {
    name: 'AliExpress',
    category: 'E-commerce',
    color: '#000000',
    logoText: 'AliExpress',
    logoUrl: '/logos/aliexpress.png'
  },
  {
    name: 'TikTok',
    category: 'Social',
    color: '#000000',
    logoText: 'TikTok',
    logoUrl: '/logos/tiktok.png'
  },
  {
    name: 'Temu',
    category: 'E-commerce',
    color: '#000000',
    logoText: 'Temu',
    logoUrl: '/logos/temu.png'
  },
  {
    name: 'Alibaba',
    category: 'E-commerce',
    color: '#000000',
    logoText: 'Alibaba',
    logoUrl: '/logos/alibaba.png'
  },
  {
    name: 'Cider',
    category: 'Fashion',
    color: '#000000',
    logoText: 'CIDER',
    logoUrl: '/logos/Cider.png'
  },
  {
    name: 'Nintendo',
    category: 'Gaming',
    color: '#000000',
    logoText: 'Nintendo',
    logoUrl: '/logos/nintendo.png'
  },
  {
    name: 'LightInTheBox',
    category: 'E-commerce',
    color: '#000000',
    logoText: 'LightInTheBox',
    logoUrl: '/logos/lightinthebox.png'
  },
  {
    name: 'Ochama',
    category: 'E-commerce',
    color: '#000000',
    logoText: 'OCHAMA',
    logoUrl: '/logos/ochama.png'
  },
  {
    name: 'More & More',
    category: 'E-commerce',
    color: '#000000',
    logoText: 'More & More',
    logoUrl: null
  }
];

// Floating Logo Cube Component
function LogoCube({ logo, index }: { logo: typeof logoData[0]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const offset = index * 0.5;

      // Individual floating animation
      meshRef.current.position.y = Math.sin(time + offset) * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.5 + offset) * 0.1;
      meshRef.current.rotation.y = Math.cos(time * 0.3 + offset) * 0.1;
    }
  });

  // Enhanced horizontal layout with better left-right distribution
  const cols = 4; // Increased columns for better horizontal spread
  const totalLogos = logoData.length;
  const rows = Math.ceil(totalLogos / cols);

  const col = index % cols;
  const row = Math.floor(index / cols);

  // Calculate position with better horizontal spread
  const xPos = (col - (cols - 1) / 2) * 2.2; // Wider horizontal spacing
  const yPos = (row - (rows - 1) / 2) * 1.8; // Adjust vertical spacing

  return (
    <mesh
      ref={meshRef}
      position={[xPos, yPos, 0]}
    >
      <boxGeometry args={[1.2, 1.2, 0.3]} />
      <meshStandardMaterial
        color={logo.color}
        metalness={0.8}
        roughness={0.2}
        emissive={logo.color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// 3D Logo Display
function LogoScene() {
  return (
    <>
      {logoData.map((logo, index) => (
        <LogoCube key={logo.name} logo={logo} index={index} />
      ))}
    </>
  );
}

const LogoGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  const categories = ['All', 'E-commerce', 'Fashion', 'Social', 'Gaming'];

  const filteredLogos = selectedCategory === 'All'
    ? logoData
    : logoData.filter(logo => logo.category === selectedCategory);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zaku-green to-zaku-light-green mb-4 zaku-text">
            PARTNERS
          </h2>
          <p className="text-xl text-gray-300">
            Leading global brands and platforms I've had the privilege to work with
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-zaku-green text-white zaku-border'
                  : 'bg-zaku-dark/60 text-gray-300 border border-zaku-green/30 hover:border-zaku-green'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Logo Grid Display */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {filteredLogos.map((logo) => (
            <div
              key={logo.name}
              onMouseEnter={() => setHoveredLogo(logo.name)}
              onMouseLeave={() => setHoveredLogo(null)}
              className={`zaku-border rounded-lg p-4 bg-zaku-dark/60 backdrop-blur-sm text-center transition-all duration-300 cursor-pointer ${
                hoveredLogo === logo.name ? 'transform scale-105 shadow-lg' : ''
              }`}
              style={{
                boxShadow: hoveredLogo === logo.name
                  ? `0 0 20px ${logo.color}40`
                  : undefined
              }}
            >
              {/* Brand Logo - Image or Text */}
              <div className="h-16 mb-3 flex items-center justify-center">
                {logo.logoUrl ? (
                  // PNG/JPG logo with proper black treatment
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                    style={{
                      filter: 'saturate(0) brightness(0.3)',
                      opacity: 1
                    }}
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const textDiv = document.createElement('div');
                        textDiv.className = 'text-xl font-black text-center';
                        textDiv.style.color = logo.color;
                        textDiv.textContent = logo.logoText || logo.name;
                        parent.appendChild(textDiv);
                      }
                    }}
                  />
                ) : (
                  // Text fallback if no logoUrl (for "More & More")
                  <div
                    className="text-xl font-black text-center"
                    style={{ color: logo.color }}
                  >
                    {logo.logoText || logo.name}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {logo.name}
              </div>
            </div>
          ))}
        </div>
      
      </div>
    </section>
  );
};

export default LogoGallery;