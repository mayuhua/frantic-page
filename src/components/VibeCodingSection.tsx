import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';

// 3D Floating Text Component
function FloatingText({ text, position, color = '#2d6a4f' }: {
  text: string;
  position: [number, number, number];
  color?: string;
}) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        position={position}
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
      >
        {text}
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Text>
    </Float>
  );
}

// 3D Scene
function VibeScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#2d6a4f" />
      <pointLight position={[10, -10, 10]} intensity={0.2} color="#ff6b35" />

      <FloatingText text="VIBE" position={[-2, 1, 0]} color="#2d6a4f" />
      <FloatingText text="CODING" position={[2, 1, 0]} color="#ff6b35" />
      <FloatingText text="∞" position={[0, -1, 0]} color="#1a4d2e" />

      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

const VibeCodingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lists');

  const projects = {
    lists: [
      {
        title: 'AI-Powered SHEIN Invoice Dealer',
        description: 'Productivity tool that relieve our client manpower to next generation',
        tech: ['FastAPI','flask', 'pdfplumber', 'PyPDF2', 'pandas'],
        status: 'Delivered & Live',
        progress: 100
      },
      {
        title: 'K-Validator',
        description: 'Real-time 3D Klarna Integration readiness validator',
        tech: ['React','Google Vision', 'Node.js', 'TensorFlow.js', 'Playwright', 'Express.js'],
        status: 'Research Phase',
        progress: 20
      }
    ],
    toolbox: [
      {
        title: 'IDE & CLI',
        description: 'How to use the AI to manage the innovation',
        tech: ['VScode', 'Gemini CLI', 'Claude Code CLI', 'Trae', 'Kiro']
      },
      {
        title: 'LLM',
        description: 'What LLM in my toolbox',
        tech: ['GLM-4.6', 'Deepseek R3.2', 'Gemini 2.5', 'Sonnet-4.5', 'ChatGPT']
      }
    ]
  };

  const ProjectCard: React.FC<{ project: any; showProgress?: boolean }> = ({ project, showProgress = true }) => (
    <div className="zaku-border rounded-lg p-6 bg-zaku-dark/60 backdrop-blur-sm hover:bg-zaku-dark/80 transition-all duration-300">
      <h3 className="text-xl font-black text-zaku-light-green mb-2 zaku-text">
        {project.title}
      </h3>
      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech: string) => (
          <span
            key={tech}
            className="px-3 py-1 bg-zaku-green/20 text-zaku-light-green text-xs rounded-full border border-zaku-green/30"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Progress Bar - Only show if showProgress is true and project has status/progress */}
      {showProgress && project.status !== undefined && project.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Status: {project.status}</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-zaku-green/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-zaku-green to-zaku-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with 3D Text */}
        <div className="text-center mb-12">
          <div className="h-32 mb-6">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <VibeScene />
            </Canvas>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zaku-green to-zaku-accent mb-4 zaku-text">
            CURRENT FOCUS
          </h2>
          <p className="text-xl text-gray-300">
            Exploring the intersection of creativity and technology
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('lists')}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
              activeTab === 'lists'
                ? 'bg-zaku-green text-white zaku-border'
                : 'bg-zaku-dark/60 text-gray-300 border border-zaku-green/30 hover:border-zaku-green'
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab('toolbox')}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
              activeTab === 'toolbox'
                ? 'bg-zaku-green text-white zaku-border'
                : 'bg-zaku-dark/60 text-gray-300 border border-zaku-green/30 hover:border-zaku-green'
            }`}
          >
            Vibe Coding Toolbox
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {projects[activeTab as keyof typeof projects].map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              showProgress={activeTab === 'lists'}
            />
          ))}
        </div>

        {/* Innovation Philosophy */}
        <div className="zaku-border rounded-2xl p-8 bg-zaku-dark/80 backdrop-blur-sm">
          <h3 className="text-2xl font-black text-zaku-accent mb-4 text-center">
            Innovation Philosophy
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-bold text-zaku-light-green mb-2">Push Boundaries</h4>
              <p className="text-sm text-gray-400">
                Always exploring what's possible at the edge of technology
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💡</div>
              <h4 className="font-bold text-zaku-light-green mb-2">Creative Problem Solving</h4>
              <p className="text-sm text-gray-400">
                Finding innovative solutions to complex challenges
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔬</div>
              <h4 className="font-bold text-zaku-light-green mb-2">Continuous Learning</h4>
              <p className="text-sm text-gray-400">
                Staying curious and embracing emerging technologies
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-300 mb-4">
            Interested in collaboration or want to learn more?
          </p>
          <a
            href="https://klarna.enterprise.slack.com/archives/D0342AHJ3GW"
            className="inline-block px-8 py-3 bg-zaku-accent hover:bg-red-600 text-white font-bold rounded-lg zaku-border transform hover:scale-105 transition-all duration-300"
          >
            Let's Build Something Amazing
          </a>
        </div>
      </div>
    </section>
  );
};

export default VibeCodingSection;