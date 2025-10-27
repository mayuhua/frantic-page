# Frontend Design Specification

## Project Overview
智能3D模型选择器UI系统，专为React Three Fiber应用设计，能够根据用户的网络状况和设备性能自动推荐最适合的3D模型版本，同时提供高级用户手动切换选项。

## Technology Stack
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **3D Rendering**: React Three Fiber + @react-three/drei
- **Theme**: 暗色背景 + 绿色强调色 (高达风格)

## Design System Foundation

### Color Palette
```typescript
const colors = {
  // Primary Colors (Zaku Gundam inspired)
  'zaku-dark': '#0a0a0a',           // 主背景色
  'zaku-darker': '#050505',         // 深色变体
  'zaku-green': '#00ff41',          // 主绿色 (Zaku经典绿)
  'zaku-light-green': '#66ff66',    // 浅绿色
  'zaku-accent': '#ff6b35',         // 强调色 (橙红色)
  'zaku-blue': '#00d4ff',           // 科技蓝
  'zaku-light-blue': '#66e0ff',     // 浅蓝色

  // Status Colors
  'success': '#00c896',
  'warning': '#ffa947',
  'error': '#ff4757',
  'info': '#3742fa',

  // Neutral Colors
  'gray-900': '#111827',
  'gray-800': '#1f2937',
  'gray-700': '#374151',
  'gray-600': '#4b5563',
  'gray-500': '#6b7280',
  'gray-400': '#9ca3af',
  'gray-300': '#d1d5db',
  'gray-200': '#e5e7eb',
  'gray-100': '#f3f4f6',
}
```

### Typography Scale
```typescript
const typography = {
  fontFamily: {
    'mono': ['JetBrains Mono', 'monospace'],
    'sans': ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    'xs': '0.75rem',    // 12px
    'sm': '0.875rem',   // 14px
    'base': '1rem',     // 16px
    'lg': '1.125rem',   // 18px
    'xl': '1.25rem',    // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  fontWeight: {
    'light': '300',
    'normal': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
    'black': '900',
  },
}
```

### Spacing System
```typescript
const spacing = {
  '0': '0',
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px
  '5': '1.25rem',   // 20px
  '6': '1.5rem',    // 24px
  '8': '2rem',      // 32px
  '10': '2.5rem',   // 40px
  '12': '3rem',     // 48px
  '16': '4rem',     // 64px
  '20': '5rem',     // 80px
}
```

### Animations & Transitions
```typescript
const animations = {
  duration: {
    'fast': '150ms',
    'normal': '300ms',
    'slow': '500ms',
  },
  easing: {
    'ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'ease-in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    'ease-in-out': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  },
}
```

## Component Architecture

### SmartModelSelector
**Purpose**: 智能模型选择器主组件，整合性能检测、推荐算法和UI界面

**Props Interface**:
```typescript
interface SmartModelSelectorProps {
  models: ModelConfiguration[];
  onModelChange: (modelId: string) => void;
  currentModelId?: string;
  showAdvancedControls?: boolean;
  className?: string;
}

interface ModelConfiguration {
  id: string;
  name: string;
  url: string;
  fileSize: number; // in bytes
  quality: 'low' | 'medium' | 'high' | 'ultra';
  description: string;
  minRequirements?: {
    networkSpeed?: number; // in Mbps
    deviceMemory?: number; // in GB
    gpuTier?: 'low' | 'medium' | 'high';
  };
}
```

**States**:
- `loading`: 检测过程中的加载状态
- `error`: 错误状态
- `recommendation`: 智能推荐结果
- `selectedModel`: 当前选择的模型
- `isAdvancedMode`: 高级控制模式

**Visual Specifications**:
- [ ] 屏幕右下角浮动面板设计
- [ ] 展开式UI，默认紧凑模式
- [ ] 绿色主题配色，科技感边框
- [ ] 支持键盘导航 (Tab, Enter, Escape)
- [ ] 移动端友好的触控区域

**Implementation Example**:
```tsx
const SmartModelSelector: React.FC<SmartModelSelectorProps> = ({
  models,
  onModelChange,
  currentModelId,
  showAdvancedControls = false,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recommendation, setRecommendation] = useState<ModelRecommendation | null>(null);
  const [selectedModel, setSelectedModel] = useState(currentModelId);

  // Performance detection and recommendation logic

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Compact mode button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-zaku-dark/90 backdrop-blur-sm border border-zaku-green rounded-lg p-3 hover:bg-zaku-green/10 transition-all duration-300"
      >
        <ModelIcon />
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="absolute bottom-0 right-0 w-80 bg-zaku-dark/95 backdrop-blur-md border border-zaku-green rounded-lg shadow-2xl">
          {/* Panel content */}
        </div>
      )}
    </div>
  );
};
```

### PerformanceDetector
**Purpose**: 设备性能和网络状况检测工具类

**Props Interface**:
```typescript
interface PerformanceMetrics {
  networkSpeed: number; // Mbps
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  deviceMemory: number; // GB
  hardwareConcurrency: number; // CPU cores
  gpuTier: 'low' | 'medium' | 'high';
  webglSupport: boolean;
  webgpuSupport: boolean;
  screenResolution: { width: number; height: number };
  batteryLevel?: number; // 0-1
}

interface PerformanceDetectorProps {
  onDetectionComplete: (metrics: PerformanceMetrics) => void;
  onError?: (error: Error) => void;
  autoDetect?: boolean;
}
```

**Visual Specifications**:
- [ ] 非侵入式检测，无UI显示
- [ ] 异步检测，不阻塞主线程
- [ ] 缓存检测结果，避免重复检测
- [ ] 支持手动刷新检测

**Implementation Example**:
```typescript
class PerformanceDetector {
  async detectPerformance(): Promise<PerformanceMetrics> {
    const networkInfo = await this.detectNetworkPerformance();
    const deviceInfo = this.detectDeviceCapabilities();
    const gpuInfo = await this.detectGPUCapabilities();

    return {
      ...networkInfo,
      ...deviceInfo,
      ...gpuInfo,
    };
  }

  private async detectNetworkPerformance() {
    // Network API + speed test implementation
  }

  private detectDeviceCapabilities() {
    // Hardware detection implementation
  }

  private async detectGPUCapabilities() {
    // WebGL/WebGPU benchmark implementation
  }
}
```

### ModelRecommendationEngine
**Purpose**: 智能推荐算法引擎

**Props Interface**:
```typescript
interface RecommendationEngine {
  calculateRecommendation(
    metrics: PerformanceMetrics,
    models: ModelConfiguration[]
  ): ModelRecommendation;
}

interface ModelRecommendation {
  modelId: string;
  confidence: number; // 0-1
  reasoning: string[];
  alternative: ModelConfiguration[];
}
```

**Implementation Example**:
```typescript
const createRecommendationEngine = (): RecommendationEngine => {
  return {
    calculateRecommendation(metrics, models) {
      const scores = models.map(model => ({
        modelId: model.id,
        score: this.calculateScore(metrics, model)
      }));

      const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

      return {
        modelId: bestMatch.modelId,
        confidence: Math.min(bestMatch.score / 100, 1),
        reasoning: this.generateReasoning(metrics, bestMatch.modelId),
        alternative: models.filter(m => m.id !== bestMatch.modelId)
      };
    }
  };
};
```

### ModelLoadingIndicator
**Purpose**: 模型加载状态指示器

**States**:
- `pending`: 等待加载
- `loading`: 正在加载
- `processing`: 处理模型
- `ready`: 加载完成
- `error`: 加载失败

**Visual Specifications**:
- [ ] 进度条显示加载百分比
- [ ] 实时显示下载速度
- [ ] 错误状态重试按钮
- [ ] 可取消加载操作
- [ ] 移动端优化的触摸目标

**Implementation Example**:
```tsx
const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({
  status,
  progress,
  downloadSpeed,
  onCancel,
  onRetry
}) => {
  return (
    <div className="fixed inset-0 bg-zaku-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zaku-darker border border-zaku-green rounded-lg p-6 max-w-sm w-full mx-4">
        {/* Loading content */}
      </div>
    </div>
  );
};
```

### ModelInfoPanel
**Purpose**: 模型详细信息面板

**Visual Specifications**:
- [ ] 显示模型名称、大小、质量等级
- [ ] 技术规格 (多边形数量、纹理分辨率)
- [ ] 推荐设备配置
- [ ] 切换历史记录
- [ ] 性能对比图表

### Layout Patterns

#### Floating Panel Layout
```typescript
interface FloatingPanelLayout {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  compact: {
    width: '48px';
    height: '48px';
  };
  expanded: {
    width: '320px';
    height: 'auto';
    maxHeight: '80vh';
  };
}
```

#### Mobile Responsive Layout
```typescript
interface MobileLayout {
  breakpoints: {
    sm: '640px';
    md: '768px';
    lg: '1024px';
  };
  adjustments: {
    fontSize: '0.875rem';
    spacing: '0.75rem';
    touchTarget: '44px';
  };
}
```

### Interaction Patterns

#### Smart Detection Flow
1. **Initial Load**: 自动检测设备性能
2. **Network Test**: 测试下载速度 (3秒)
3. **GPU Benchmark**: WebGL性能测试 (2秒)
4. **Generate Recommendation**: 计算最佳模型
5. **Auto Load**: 自动加载推荐模型
6. **Manual Override**: 用户可手动切换

#### Advanced User Controls
- **Manual Selection**: 下拉菜单选择模型
- **Performance Settings**: 自定义质量设置
- **Cache Management**: 清除已缓存模型
- **Debug Mode**: 显示详细性能指标

## Implementation Roadmap

### Phase 1: Core Infrastructure
1. [ ] Create `PerformanceDetector` utility class
2. [ ] Implement network speed detection
3. [ ] Add device capability detection
4. [ ] Create `ModelRecommendationEngine`
5. [ ] Define TypeScript interfaces and types

### Phase 2: UI Components
1. [ ] Build `SmartModelSelector` main component
2. [ ] Create `ModelLoadingIndicator` with progress tracking
3. [ ] Implement `ModelInfoPanel` for detailed information
4. [ ] Add responsive design for mobile devices
5. [ ] Integrate with existing Tailwind CSS theme

### Phase 3: Integration & Enhancement
1. [ ] Integrate with existing `KampferModel.tsx`
2. [ ] Add error handling and recovery mechanisms
3. [ ] Implement model caching strategies
4. [ ] Add keyboard navigation support
5. [ ] Optimize for performance and bundle size

### Phase 4: Advanced Features
1. [ ] Add A/B testing for recommendation accuracy
2. [ ] Implement analytics tracking for user preferences
3. [ ] Add progressive enhancement patterns
4. [ ] Create comprehensive documentation
5. [ ] Performance testing and optimization

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- [ ] **Keyboard Navigation**: 全功能键盘访问
- [ ] **Screen Reader Support**: 完整的ARIA标签支持
- [ ] **Color Contrast**: 符合4.5:1对比度要求
- [ ] **Focus Management**: 清晰的焦点指示器
- [ ] **Reduced Motion**: 支持`prefers-reduced-motion`

### ARIA Implementation
```tsx
<div
  role="dialog"
  aria-labelledby="model-selector-title"
  aria-describedby="model-selector-description"
  aria-modal="true"
>
  <h2 id="model-selector-title">Model Quality Selector</h2>
  <p id="model-selector-description">
    Choose the optimal 3D model quality based on your device performance
  </p>
</div>
```

## Performance Optimization

### Bundle Size Management
- **Code Splitting**: 按需加载检测模块
- **Tree Shaking**: 移除未使用的工具函数
- **Compression**: Gzip/Brotli压缩
- **Lazy Loading**: 高级功能延迟加载

### Runtime Optimization
- **Memoization**: 缓存检测结果和推荐计算
- **Debouncing**: 防抖网络检测
- **Web Workers**: 后台性能检测
- **RequestIdleCallback**: 空闲时执行非关键任务

## Error Handling & Edge Cases

### Network Failures
- 连接超时处理
- 离线模式降级
- 网络状态变化监听
- 自动重试机制

### Device Limitations
- WebGL不支持时的fallback
- 内存不足时的处理
- 低端设备的体验优化
- 移动设备电池优化

### Model Loading Issues
- 文件损坏检测
- 加载超时处理
- 内存泄漏防护
- 优雅的降级方案

## Testing Strategy

### Unit Tests
- Performance detection algorithms
- Recommendation engine logic
- Component state management
- Utility functions

### Integration Tests
- Model switching workflow
- Error recovery scenarios
- Network condition simulation
- Device capability testing

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile device testing
- Performance benchmarks

### Performance Tests
- Bundle size analysis
- Runtime performance monitoring
- Memory usage tracking
- Network impact assessment

## Analytics & Monitoring

### User Behavior Tracking
```typescript
interface AnalyticsEvents {
  'model-selector-opened': { source: 'auto' | 'manual' };
  'model-recommendation-applied': { modelId: string; confidence: number };
  'model-manually-changed': { fromModel: string; toModel: string };
  'model-loading-failed': { modelId: string; error: string };
  'performance-detected': { metrics: PerformanceMetrics };
}
```

### Performance Metrics
- Detection completion time
- Recommendation accuracy
- Model loading success rate
- User satisfaction scores

## Future Enhancements

### Advanced AI Recommendations
- Machine learning for personalized recommendations
- Historical usage pattern analysis
- Predictive model preloading
- Adaptive quality adjustment

### Enhanced Performance Monitoring
- Real-time performance tracking
- Dynamic quality adjustment
- Thermal throttling detection
- Battery-aware optimization

### Social Features
- User preference sharing
- Community ratings
- Performance comparison
- Tips and recommendations

## Feedback & Iteration Notes

### Initial Design Review Checklist
- [ ] Technical feasibility validation
- [ ] User experience flow mapping
- [ ] Performance impact assessment
- [ ] Accessibility compliance check
- [ ] Mobile responsiveness verification

### Stakeholder Feedback Collection
- [ ] Development team technical review
- [ ] UX/UI design team approval
- [ ] Product requirements validation
- [ ] Performance team benchmarks
- [ ] Security team assessment

### Iteration Planning
- **Version 1.0**: Core functionality with basic UI
- **Version 1.1**: Enhanced recommendations and analytics
- **Version 1.2**: Advanced features and personalization
- **Version 2.0**: AI-powered recommendations and ML integration

---

**Document Version**: 1.0
**Last Updated**: 2025-10-27
**Next Review**: 2025-11-27
**Maintainer**: Frantic Unit Design Team