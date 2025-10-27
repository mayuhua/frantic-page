# Smart 3D Model Selector System

An intelligent React Three Fiber component system for automatic 3D model selection based on device performance and network conditions.

## Features

🧠 **Intelligent Detection** - Automatically detects device capabilities, GPU performance, and network speed

🎯 **Smart Recommendations** - AI-powered algorithm suggests optimal model quality for each user

🎨 **Beautiful UI** - Sleek, responsive interface with cyberpunk/ Gundam-inspired design

⚡ **Performance Optimized** - Lightweight, fast loading with minimal performance impact

♿ **Accessible** - Full WCAG 2.1 AA compliance with keyboard navigation and screen reader support

🔄 **Real-time Switching** - Seamless model switching without page reload

## Quick Start

```tsx
import SmartModelSelector from './SmartModelSelector';
import { ModelConfiguration } from '../utils/modelRecommendationEngine';

const models: ModelConfiguration[] = [
  {
    id: 'kampfer-compressed',
    name: 'Kampfer (Optimized)',
    url: '/models/kampfer-compressed.glb',
    fileSize: 78.6 * 1024, // 78.6 KB
    quality: 'low',
    description: 'Lightweight version optimized for fast loading',
    minRequirements: {
      networkSpeed: 0.5,
      deviceMemory: 2,
      gpuTier: 'low'
    }
  },
  {
    id: 'kampfer',
    name: 'Kampfer (Standard)',
    url: '/models/kampfer.glb',
    fileSize: 10.8 * 1024 * 1024, // 10.8 MB
    quality: 'medium',
    description: 'Balanced version with good quality',
    minRequirements: {
      networkSpeed: 2,
      deviceMemory: 4,
      gpuTier: 'medium'
    }
  },
  {
    id: 'kampfer-hd',
    name: 'Kampfer (HD)',
    url: '/models/kampfer-1.glb',
    fileSize: 67.8 * 1024 * 1024, // 67.8 MB
    quality: 'high',
    description: 'Maximum detail and quality',
    minRequirements: {
      networkSpeed: 10,
      deviceMemory: 8,
      gpuTier: 'high'
    }
  }
];

function My3DComponent() {
  const [selectedModel, setSelectedModel] = useState('kampfer');

  return (
    <>
      {/* Your 3D Canvas */}
      <MyCanvas modelUrl={models.find(m => m.id === selectedModel)?.url} />

      {/* Smart Model Selector */}
      <SmartModelSelector
        models={models}
        onModelChange={setSelectedModel}
        currentModelId={selectedModel}
        autoDetect={true}
        showAdvancedControls={true}
      />
    </>
  );
}
```

## Component Architecture

### Core Components

- **`SmartModelSelector`** - Main UI component with expandable panel
- **`ModelLoadingIndicator`** - Loading states and progress tracking
- **`PerformanceDetector`** - Device and network performance analysis
- **`ModelRecommendationEngine`** - AI-powered recommendation algorithm

### Utility Classes

- **`performanceDetector`** - Singleton for performance detection
- **`modelRecommendationEngine`** - Recommendation calculation engine

### Updated Components

- **`KampferModel`** - Enhanced with smart selection integration
- **`GLBModelLoader`** - Added progress callbacks and loading states

## Key Features

### 1. Automatic Performance Detection

- Network speed testing with real-time measurements
- GPU capability detection (WebGL/WebGPU)
- Device memory and CPU core detection
- Battery level and charging status
- Screen resolution and pixel density

### 2. Intelligent Recommendations

- Multi-factor scoring algorithm
- Network, GPU, memory, and battery consideration
- User preference learning
- Adaptive quality adjustment

### 3. User Interface

- Compact/expanded modes
- Real-time performance metrics display
- Loading progress with download speed
- Error handling with retry options
- Mobile-responsive design

### 4. Advanced Controls

- Manual model selection
- Quality vs performance preferences
- Data saver mode
- Custom weight configuration
- Model exclusion lists

## Design System

The system follows your existing Zaku Gundam-inspired theme:

- **Colors**: Dark background with green accent colors
- **Typography**: Monospace fonts for technical feel
- **Animations**: Smooth transitions and hover effects
- **Layout**: Floating panels with backdrop blur

## Performance Metrics

The system evaluates:

- **Network Speed** (30% weight): Download speed, latency, connection type
- **Device Memory** (25% weight): Available RAM, memory pressure
- **GPU Performance** (30% weight): Tier classification, capabilities
- **Battery Level** (10% weight): Power consumption consideration
- **Data Saver** (10% weight): User data preferences

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Limited support for older browsers

## File Structure

```
src/
├── components/
│   ├── SmartModelSelector.tsx      # Main selector component
│   ├── ModelLoadingIndicator.tsx   # Loading states UI
│   ├── KampferModel.tsx            # Updated with smart selection
│   └── GLBModelLoader.tsx          # Enhanced loader
├── utils/
│   ├── performanceDetector.ts      # Performance detection
│   └── modelRecommendationEngine.ts # Recommendation algorithm
└── docs/
    ├── design/
    │   └── frontend-design-spec.md  # Complete design specification
    └── usage/
        └── smart-model-selector-usage.md # Usage guide
```

## Configuration

### Model Requirements

Define minimum requirements for each model:

```typescript
{
  minRequirements: {
    networkSpeed: 5,        // Mbps
    deviceMemory: 4,        // GB
    gpuTier: 'medium',      // 'low' | 'medium' | 'high'
    webglVersion: 2,        // WebGL version
    storageSpace: 100       // MB
  }
}
```

### User Preferences

Configure user behavior:

```typescript
{
  prioritizeQuality: false,     // Quality over performance
  prioritizePerformance: true,  // Performance over quality
  dataSaverMode: false,         // Reduce data usage
  maxLoadTime: 10,             // Maximum load time (seconds)
  preferredQuality: 'medium',   // User's preferred quality
  excludedModels: [],           // Models to exclude
  autoLoadBest: true           // Auto-load recommended model
}
```

## Best Practices

1. **Model Organization**: Use consistent file naming and directory structure
2. **File Optimization**: Compress GLB files and optimize textures
3. **Progressive Enhancement**: Start with low quality, offer upgrades
4. **User Feedback**: Provide clear loading indicators and error messages
5. **Performance Monitoring**: Track usage patterns and optimize accordingly

## Debugging

Enable debug mode in development:

```typescript
// Console will show detailed detection and recommendation logs
console.log('Performance Detection:', metrics);
console.log('Model Recommendation:', recommendation);
```

## Contributing

When adding new features:

1. Update TypeScript interfaces
2. Add comprehensive error handling
3. Include accessibility features
4. Test on multiple devices
5. Update documentation

## License

This component system is part of the Frantic Unit personal website project.