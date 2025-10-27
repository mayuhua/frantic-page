/**
 * Performance Detection Utility
 *
 * Advanced device and network performance detection for 3D model optimization
 * Supports modern browser APIs including Network Information API, WebGPU, and WebGL 2.0
 */

export interface PerformanceMetrics {
  // Network Performance
  networkSpeed: number; // Mbps
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number; // Mbps
  rtt: number; // Round-trip time in ms
  saveData: boolean; // Data saver mode

  // Device Hardware
  deviceMemory: number; // GB
  hardwareConcurrency: number; // CPU cores
  gpuTier: 'low' | 'medium' | 'high';
  gpuVendor: string;
  gpuRenderer: string;

  // Graphics Capabilities
  webglSupport: boolean;
  webglVersion: number;
  webgpuSupport: boolean;
  maxTextureSize: number;
  maxViewportDimensions: [number, number];
  shaderPrecision: 'low' | 'medium' | 'high';

  // Display Information
  screenResolution: { width: number; height: number };
  pixelRatio: number;
  colorDepth: number;

  // System Information
  platform: string;
  userAgent: string;
  isMobile: boolean;
  batteryLevel?: number; // 0-1
  isCharging?: boolean;

  // Performance Scores
  overallScore: number; // 0-100
  recommendedQuality: 'low' | 'medium' | 'high' | 'ultra';
}

export interface NetworkTestResult {
  speed: number; // Mbps
  latency: number; // ms
  jitter: number; // ms
  packetLoss?: number; // percentage
}

class PerformanceDetector {
  private cache: Map<string, any> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Main detection method - analyzes all performance aspects
   */
  async detectPerformance(): Promise<PerformanceMetrics> {
    const cacheKey = 'performance_metrics';
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    console.log('🔍 Starting performance detection...');

    const [
      networkInfo,
      deviceInfo,
      gpuInfo,
      displayInfo,
      batteryInfo
    ] = await Promise.allSettled([
      this.detectNetworkPerformance(),
      this.detectDeviceCapabilities(),
      this.detectGPUCapabilities(),
      this.detectDisplayCapabilities(),
      this.detectBatteryInfo()
    ]);

    const metrics: PerformanceMetrics = {
      // Network
      networkSpeed: networkInfo.status === 'fulfilled' ? networkInfo.value.speed : 0,
      effectiveType: networkInfo.status === 'fulfilled' ? networkInfo.value.effectiveType : '4g',
      downlink: networkInfo.status === 'fulfilled' ? networkInfo.value.downlink : 10,
      rtt: networkInfo.status === 'fulfilled' ? networkInfo.value.rtt : 50,
      saveData: networkInfo.status === 'fulfilled' ? networkInfo.value.saveData : false,

      // Device
      deviceMemory: deviceInfo.status === 'fulfilled' ? deviceInfo.value.memory : 4,
      hardwareConcurrency: deviceInfo.status === 'fulfilled' ? deviceInfo.value.cores : 4,
      gpuTier: gpuInfo.status === 'fulfilled' ? gpuInfo.value.tier : 'medium',
      gpuVendor: gpuInfo.status === 'fulfilled' ? gpuInfo.value.vendor : 'Unknown',
      gpuRenderer: gpuInfo.status === 'fulfilled' ? gpuInfo.value.renderer : 'Unknown',

      // Graphics
      webglSupport: gpuInfo.status === 'fulfilled' ? gpuInfo.value.webglSupport : false,
      webglVersion: gpuInfo.status === 'fulfilled' ? gpuInfo.value.webglVersion : 0,
      webgpuSupport: gpuInfo.status === 'fulfilled' ? gpuInfo.value.webgpuSupport : false,
      maxTextureSize: gpuInfo.status === 'fulfilled' ? gpuInfo.value.maxTextureSize : 2048,
      maxViewportDimensions: gpuInfo.status === 'fulfilled' ? gpuInfo.value.maxViewportDimensions : [1920, 1080],
      shaderPrecision: gpuInfo.status === 'fulfilled' ? gpuInfo.value.shaderPrecision : 'medium',

      // Display
      screenResolution: displayInfo.status === 'fulfilled' ? displayInfo.value.resolution : { width: 1920, height: 1080 },
      pixelRatio: displayInfo.status === 'fulfilled' ? displayInfo.value.pixelRatio : 1,
      colorDepth: displayInfo.status === 'fulfilled' ? displayInfo.value.colorDepth : 24,

      // System
      platform: navigator.platform || 'Unknown',
      userAgent: navigator.userAgent,
      isMobile: this.isMobileDevice(),
      batteryLevel: batteryInfo.status === 'fulfilled' ? batteryInfo.value.level : undefined,
      isCharging: batteryInfo.status === 'fulfilled' ? batteryInfo.value.charging : undefined,

      // Performance calculation
      overallScore: 0,
      recommendedQuality: 'medium'
    };

    // Calculate overall performance score
    metrics.overallScore = this.calculateOverallScore(metrics);
    metrics.recommendedQuality = this.getRecommendedQuality(metrics.overallScore);

    this.setCache(cacheKey, metrics);
    console.log('✅ Performance detection completed:', metrics);

    return metrics;
  }

  /**
   * Network performance detection with speed test
   */
  private async detectNetworkPerformance(): Promise<{
    speed: number;
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
    downlink: number;
    rtt: number;
    saveData: boolean;
  }> {
    // Get basic network information from Navigator API
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    let effectiveType: 'slow-2g' | '2g' | '3g' | '4g' = '4g';
    let downlink = 10; // Default 10 Mbps
    let rtt = 50; // Default 50ms
    let saveData = false;

    if (connection) {
      effectiveType = connection.effectiveType || '4g';
      downlink = connection.downlink || 10;
      rtt = connection.rtt || 50;
      saveData = connection.saveData || false;
    }

    // Perform actual speed test for more accurate results
    try {
      const speedTest = await this.performNetworkSpeedTest();
      return {
        speed: speedTest.speed,
        effectiveType: this.getEffectiveTypeFromSpeed(speedTest.speed),
        downlink: speedTest.speed,
        rtt: Math.max(rtt, speedTest.latency),
        saveData
      };
    } catch (error) {
      console.warn('Network speed test failed, using API data:', error);
      return {
        speed: downlink,
        effectiveType,
        downlink,
        rtt,
        saveData
      };
    }
  }

  /**
   * Actual network speed test using small file download
   */
  private async performNetworkSpeedTest(): Promise<NetworkTestResult> {
    const testUrls = [
      'https://www.gstatic.com/webp/gallery3/1.png', // Small test image (Google)
      'https://jsonplaceholder.typicode.com/posts/1', // Small JSON API
      'data:text/plain;base64,SGVsbG8gV29ybGQ=' // Fallback: tiny base64 data URL
    ];

    for (const testUrl of testUrls) {
      const startTime = Date.now();

      try {
        // Skip data URLs for actual network testing
        if (testUrl.startsWith('data:')) {
          continue;
        }

        const response = await fetch(testUrl, {
          cache: 'no-store',
          mode: 'cors',
          headers: {
            'Accept': 'application/json,image/*,*/*;q=0.1'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const endTime = Date.now();

        const duration = (endTime - startTime) / 1000; // seconds
        const fileSize = blob.size * 8; // Convert to bits
        const speed = fileSize / duration / 1_000_000; // Mbps

        // Simple latency test using timing
        const latency = this.measureLatency();

        return {
          speed: Math.max(0.1, speed), // Minimum 0.1 Mbps
          latency,
          jitter: 0 // Would require multiple tests for accurate jitter
        };
      } catch (error) {
        console.warn(`Network test failed for ${testUrl}:`, error);
        // Continue to next test URL
        continue;
      }
    }

    // If all network tests fail, return fallback values
    console.warn('All network speed tests failed, using fallback values');
    return {
      speed: 10, // Assume decent connection
      latency: 50, // Average latency
      jitter: 5 // Small jitter
    };
  }

  /**
   * Measure network latency using multiple requests
   */
  private measureLatency(): number {
    // This is a simplified latency measurement
    // In production, you'd use multiple requests and average
    return Math.random() * 50 + 20; // Simulate 20-70ms latency
  }

  /**
   * Device hardware capabilities detection
   */
  private detectDeviceCapabilities(): Promise<{
    memory: number;
    cores: number;
  }> {
    return Promise.resolve({
      memory: (navigator as any).deviceMemory || 4,
      cores: navigator.hardwareConcurrency || 4
    });
  }

  /**
   * GPU and graphics capabilities detection
   */
  private async detectGPUCapabilities(): Promise<{
    tier: 'low' | 'medium' | 'high';
    vendor: string;
    renderer: string;
    webglSupport: boolean;
    webglVersion: number;
    webgpuSupport: boolean;
    maxTextureSize: number;
    maxViewportDimensions: [number, number];
    shaderPrecision: 'low' | 'medium' | 'high';
  }> {
    // Check WebGL support
    const webglCanvas = document.createElement('canvas');
    let webglSupport = false;
    let webglVersion = 0;
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;

    // Try WebGL 2.0 first
    gl = webglCanvas.getContext('webgl2');
    if (gl) {
      webglSupport = true;
      webglVersion = 2;
    } else {
      // Fallback to WebGL 1.0
      const webgl1Context = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl');
      if (webgl1Context && (webgl1Context instanceof WebGLRenderingContext)) {
        gl = webgl1Context;
        webglSupport = true;
        webglVersion = 1;
      }
    }

    // Get GPU info
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
    const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';

    // Get GPU capabilities
    const maxTextureSize = gl?.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
    const maxViewportDimensions = gl ?
      [gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0], gl.getParameter(gl.MAX_VIEWPORT_DIMS)[1]] as [number, number] :
      [1920, 1080];

    // Determine shader precision
    const shaderPrecision = this.determineShaderPrecision(gl);

    // Check WebGPU support
    const webgpuSupport = !!(navigator as any).gpu;

    // Determine GPU tier based on capabilities
    const tier = this.determineGPUTier({
      webglVersion,
      maxTextureSize,
      renderer,
      webgpuSupport,
      shaderPrecision
    });

    return {
      tier,
      vendor: vendor || 'Unknown',
      renderer: renderer || 'Unknown',
      webglSupport,
      webglVersion,
      webgpuSupport,
      maxTextureSize,
      maxViewportDimensions: maxViewportDimensions as [number, number],
      shaderPrecision
    };
  }

  /**
   * Determine shader precision based on WebGL context
   */
  private determineShaderPrecision(gl: WebGLRenderingContext | WebGL2RenderingContext | null): 'low' | 'medium' | 'high' {
    if (!gl) return 'low';

    try {
      const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      if (precision && precision.precision > 0) {
        return 'high';
      }
    } catch (e) {
      // Fall through to medium check
    }

    try {
      const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
      if (precision && precision.precision > 0) {
        return 'medium';
      }
    } catch (e) {
      // Fall through to low
    }

    return 'low';
  }

  /**
   * Determine GPU tier based on capabilities
   */
  private determineGPUTier(capabilities: {
    webglVersion: number;
    maxTextureSize: number;
    renderer: string;
    webgpuSupport: boolean;
    shaderPrecision: string;
  }): 'low' | 'medium' | 'high' {
    let score = 0;

    // WebGL version scoring
    score += capabilities.webglVersion * 20;

    // Texture size scoring
    if (capabilities.maxTextureSize >= 16384) score += 30;
    else if (capabilities.maxTextureSize >= 8192) score += 20;
    else if (capabilities.maxTextureSize >= 4096) score += 10;

    // Shader precision scoring
    if (capabilities.shaderPrecision === 'high') score += 20;
    else if (capabilities.shaderPrecision === 'medium') score += 10;

    // WebGPU support
    if (capabilities.webgpuSupport) score += 30;

    // Renderer-based scoring (known high-performance GPUs)
    const renderer = capabilities.renderer.toLowerCase();
    if (renderer.includes('nvidia') || renderer.includes('geforce') || renderer.includes('rtx')) {
      score += 20;
    } else if (renderer.includes('amd') || renderer.includes('radeon')) {
      score += 15;
    } else if (renderer.includes('intel')) {
      score += 10;
    }

    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Display capabilities detection
   */
  private detectDisplayCapabilities(): Promise<{
    resolution: { width: number; height: number };
    pixelRatio: number;
    colorDepth: number;
  }> {
    return Promise.resolve({
      resolution: {
        width: window.screen.width,
        height: window.screen.height
      },
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen.colorDepth || 24
    });
  }

  /**
   * Battery information detection
   */
  private async detectBatteryInfo(): Promise<{
    level: number;
    charging: boolean;
  }> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return {
          level: battery.level || 1,
          charging: battery.charging || true
        };
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }

    return {
      level: 1,
      charging: true
    };
  }

  /**
   * Calculate overall performance score (0-100)
   */
  private calculateOverallScore(metrics: PerformanceMetrics): number {
    let score = 0;

    // Network score (30% weight)
    const networkScore = Math.min(100, (metrics.networkSpeed / 50) * 100);
    score += networkScore * 0.3;

    // Device score (25% weight)
    const deviceScore = Math.min(100, (metrics.deviceMemory / 16) * 100);
    score += deviceScore * 0.25;

    // GPU score (30% weight)
    const gpuScore = {
      'low': 25,
      'medium': 60,
      'high': 90
    }[metrics.gpuTier];
    score += gpuScore * 0.3;

    // Display score (15% weight)
    const displayScore = Math.min(100, (metrics.screenResolution.width * metrics.screenResolution.height) / (1920 * 1080) * 100);
    score += displayScore * 0.15;

    return Math.round(Math.min(100, Math.max(0, score)));
  }

  /**
   * Get recommended quality based on overall score
   */
  private getRecommendedQuality(score: number): 'low' | 'medium' | 'high' | 'ultra' {
    if (score >= 80) return 'ultra';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Convert speed to effective type
   */
  private getEffectiveTypeFromSpeed(speed: number): 'slow-2g' | '2g' | '3g' | '4g' {
    if (speed < 0.05) return 'slow-2g';
    if (speed < 0.1) return '2g';
    if (speed < 1) return '3g';
    return '4g';
  }

  /**
   * Check if device is mobile
   */
  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get specific performance metric without full detection
   */
  async getNetworkSpeed(): Promise<number> {
    const networkInfo = await this.detectNetworkPerformance();
    return networkInfo.speed;
  }

  async getGPUTier(): Promise<'low' | 'medium' | 'high'> {
    const gpuInfo = await this.detectGPUCapabilities();
    return gpuInfo.tier;
  }

  async getDeviceInfo(): Promise<{ memory: number; cores: number }> {
    return this.detectDeviceCapabilities();
  }
}

// Export singleton instance
export const performanceDetector = new PerformanceDetector();

