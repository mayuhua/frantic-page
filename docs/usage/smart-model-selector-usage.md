# Smart Model Selector Usage Guide

## Overview

The Smart Model Selector is an intelligent 3D model selection system that automatically detects user device capabilities and network conditions to recommend the optimal model quality. It provides both automatic recommendations and manual override options.

## Quick Start

### Basic Usage

```tsx
import SmartModelSelector from './components/SmartModelSelector';
import { ModelConfiguration } from './utils/modelRecommendationEngine';

// Define your available models
const models: ModelConfiguration[] = [
  {
    id: 'model-low',
    name: 'Low Quality Model',
    url: '/models/model-low.glb',
    fileSize: 1024 * 1024, // 1 MB
    quality: 'low',
    description: 'Optimized for low-end devices',
    minRequirements: {
      networkSpeed: 0.5,
      deviceMemory: 2,
      gpuTier: 'low'
    }
  },
  {
    id: 'model-high',
    name: 'High Quality Model',
    url: '/models/model-high.glb',
    fileSize: 50 * 1024 * 1024, // 50 MB
    quality: 'high',
    description: 'Maximum quality for high-end devices',
    minRequirements: {
      networkSpeed: 10,
      deviceMemory: 8,
      gpuTier: 'high'
    }
  }
];

function App() {
  const [selectedModel, setSelectedModel] = useState('model-medium');

  return (
    <div>
      {/* Your 3D Canvas Component */}
      <My3DCanvas modelUrl={models.find(m => m.id === selectedModel)?.url} />

      {/* Smart Model Selector */}
      <SmartModelSelector
        models={models}
        onModelChange={setSelectedModel}
        currentModelId={selectedModel}
        autoDetect={true}
        showAdvancedControls={true}
      />
    </div>
  );
}
```

## Configuration Options

### SmartModelSelector Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `models` | `ModelConfiguration[]` | **Required** | Array of available model configurations |
| `onModelChange` | `(modelId: string) => void` | **Required** | Callback when model selection changes |
| `currentModelId` | `string` | `undefined` | Currently selected model ID |
| `showAdvancedControls` | `boolean` | `false` | Show advanced options in the UI |
| `className` | `string` | `''` | Additional CSS classes |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position of the selector on screen |
| `autoDetect` | `boolean` | `true` | Automatically detect performance on mount |
| `initialPreferences` | `Partial<UserPreferences>` | `{}` | Initial user preference settings |

### ModelConfiguration Interface

```typescript
interface ModelConfiguration {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  url: string;                   // Model file URL
  fileSize: number;              // File size in bytes
  quality: 'low' | 'medium' | 'high' | 'ultra';
  description: string;           // Model description
  features: string[];            // List of features
  minRequirements?: {            // Minimum requirements
    networkSpeed?: number;       // in Mbps
    deviceMemory?: number;       // in GB
    gpuTier?: 'low' | 'medium' | 'high';
    webglVersion?: number;
    storageSpace?: number;       // in MB
  };
  recommendedFor?: string[];     // Recommended use cases
  tags?: string[];               // Search/filter tags
  version?: string;              // Model version
  lastUpdated?: string;          // Last update date
}
```

### UserPreferences Interface

```typescript
interface UserPreferences {
  prioritizeQuality?: boolean;   // Prioritize quality over performance
  prioritizePerformance?: boolean; // Prioritize performance over quality
  dataSaverMode?: boolean;       // Enable data saver mode
  maxLoadTime?: number;          // Maximum acceptable load time (seconds)
  preferredQuality?: 'low' | 'medium' | 'high' | 'ultra';
  excludedModels?: string[];     // Models to exclude from selection
  autoLoadBest?: boolean;        // Automatically load recommended model
}
```

## Advanced Usage

### Custom Performance Weights

You can customize how the recommendation engine weighs different factors:

```tsx
import { modelRecommendationEngine } from './utils/modelRecommendationEngine';

// Custom weights for mobile-first approach
const mobileWeights = {
  networkSpeed: 0.4,      // Prioritize network speed
  deviceMemory: 0.3,      // Consider device memory
  gpuPerformance: 0.2,    // Less emphasis on GPU
  batteryLevel: 0.05,     // Consider battery life
  dataSaver: 0.03,        // Data saver consideration
  userPreference: 0.02    // Minimal user preference override
};

// Apply custom weights in recommendation calculation
const recommendation = modelRecommendationEngine.calculateRecommendation(
  metrics,
  models,
  userPreferences,
  mobileWeights
);
```

### Manual Performance Detection

```tsx
import { performanceDetector } from './utils/performanceDetector';

async function analyzeDevice() {
  try {
    const metrics = await performanceDetector.detectPerformance();
    console.log('Device performance:', metrics);

    // Get specific metrics
    const networkSpeed = await performanceDetector.getNetworkSpeed();
    const gpuTier = await performanceDetector.getGPUTier();

    return metrics;
  } catch (error) {
    console.error('Performance detection failed:', error);
  }
}
```

### Custom Model Validation

```tsx
import { modelRecommendationEngine } from './utils/modelRecommendationEngine';

function validateModel(model: ModelConfiguration) {
  const errors = modelRecommendationEngine.validateModelConfiguration(model);

  if (errors.length > 0) {
    console.error('Model validation failed:', errors);
    return false;
  }

  return true;
}

// Usage
const myModel = {
  id: 'test-model',
  name: 'Test Model',
  url: '/models/test.glb',
  fileSize: 10 * 1024 * 1024,
  quality: 'medium',
  description: 'A test model',
  features: ['Testing']
};

if (validateModel(myModel)) {
  console.log('Model is valid!');
}
```

## Integration with Existing 3D Components

### React Three Fiber Integration

```tsx
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function ModelViewer({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);

  return <primitive object={scene} />;
}

function App() {
  const [selectedModel, setSelectedModel] = useState('model-medium');
  const models = getModelConfigurations(); // Your model configurations

  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div>
      <Canvas>
        <ModelViewer modelUrl={currentModel?.url || ''} />
        {/* Your 3D scene setup */}
      </Canvas>

      <SmartModelSelector
        models={models}
        onModelChange={setSelectedModel}
        currentModelId={selectedModel}
      />
    </div>
  );
}
```

### Three.js Integration

```tsx
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function ThreeJSViewer({ modelUrl }: { modelUrl: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Load model
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      scene.add(gltf.scene);
    });

    sceneRef.current = scene;

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelUrl]);

  return <div ref={mountRef} />;
}
```

## Styling and Theming

The Smart Model Selector uses Tailwind CSS classes and follows your existing theme system. You can customize the appearance by:

### Custom CSS Classes

```tsx
<SmartModelSelector
  models={models}
  onModelChange={setSelectedModel}
  className="custom-model-selector"
  position="bottom-left"
/>
```

### CSS Customization

```css
/* Custom styles for the model selector */
.custom-model-selector {
  /* Your custom styles */
}

/* Override default colors */
.custom-model-selector .border-zaku-green {
  border-color: #your-custom-color !important;
}
```

## Performance Monitoring

### Track User Behavior

```tsx
function App() {
  const [selectedModel, setSelectedModel] = useState('model-medium');

  const handleModelChange = useCallback((modelId: string) => {
    // Track model changes
    console.log('Model changed to:', modelId);

    // Send analytics
    analytics.track('model_changed', {
      fromModel: selectedModel,
      toModel: modelId,
      timestamp: Date.now()
    });

    setSelectedModel(modelId);
  }, [selectedModel]);

  return (
    <SmartModelSelector
      models={models}
      onModelChange={handleModelChange}
      currentModelId={selectedModel}
    />
  );
}
```

### Performance Metrics

```tsx
import { performanceDetector } from './utils/performanceDetector';

function PerformanceMonitor() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const detectPerformance = async () => {
      const result = await performanceDetector.detectPerformance();
      setMetrics(result);

      // Log performance for debugging
      console.log('Performance metrics:', {
        score: result.overallScore,
        network: result.networkSpeed,
        gpu: result.gpuTier,
        memory: result.deviceMemory
      });
    };

    detectPerformance();
  }, []);

  if (!metrics) return <div>Detecting performance...</div>;

  return (
    <div>
      <p>Performance Score: {metrics.overallScore}/100</p>
      <p>Network: {metrics.networkSpeed} Mbps</p>
      <p>GPU Tier: {metrics.gpuTier}</p>
    </div>
  );
}
```

## Error Handling

### Global Error Handling

```tsx
function App() {
  const [error, setError] = useState(null);

  const handleError = useCallback((error: Error) => {
    console.error('Model selector error:', error);
    setError(error.message);

    // Track errors
    analytics.track('model_selector_error', {
      error: error.message,
      timestamp: Date.now()
    });
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return (
    <SmartModelSelector
      models={models}
      onModelChange={setSelectedModel}
      onError={handleError}
    />
  );
}
```

## Best Practices

### 1. Model Organization

Organize your models in a consistent structure:

```
/models/
  ├── low/
  │   ├── model-low.glb
  │   └── model-low-textures/
  ├── medium/
  │   ├── model-medium.glb
  │   └── model-medium-textures/
  └── high/
      ├── model-high.glb
      └── model-high-textures/
```

### 2. Performance Optimization

- Use compressed GLB files
- Implement proper LOD (Level of Detail) systems
- Cache models in localStorage when appropriate
- Preload critical models

### 3. User Experience

- Show loading indicators for all model changes
- Provide clear feedback about model quality
- Allow users to manually override recommendations
- Remember user preferences

### 4. Testing

- Test on various devices and network conditions
- Simulate slow connections
- Test error scenarios
- Verify accessibility compliance

## Troubleshooting

### Common Issues

1. **Model not loading**: Check file paths and network connectivity
2. **Poor recommendations**: Verify model requirements are accurate
3. **UI not appearing**: Ensure proper z-index and positioning
4. **Performance issues**: Check model file sizes and complexity

### Debug Mode

Enable debug logging:

```tsx
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Smart Model Selector Debug Mode Enabled');
}
```

## Support

For issues and feature requests, please refer to the project documentation or create an issue in the repository.