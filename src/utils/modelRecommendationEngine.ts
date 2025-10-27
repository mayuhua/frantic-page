/**
 * Model Recommendation Engine
 *
 * Intelligent recommendation system for selecting optimal 3D models
 * based on device performance, network conditions, and user preferences
 */

import { PerformanceMetrics } from './performanceDetector';

export interface ModelConfiguration {
  id: string;
  name: string;
  url: string;
  fileSize: number; // in bytes
  quality: 'low' | 'medium' | 'high' | 'ultra';
  description: string;
  features: string[];
  position?: [number, number, number]; // 3D position [x, y, z]
  scale?: [number, number, number]; // 3D scale [x, y, z]
  minRequirements?: {
    networkSpeed?: number; // in Mbps
    deviceMemory?: number; // in GB
    gpuTier?: 'low' | 'medium' | 'high';
    webglVersion?: number;
    storageSpace?: number; // in MB
  };
  recommendedFor?: string[];
  tags?: string[];
  version?: string;
  lastUpdated?: string;
}

export interface ModelRecommendation {
  modelId: string;
  confidence: number; // 0-1
  reasoning: string[];
  alternative: ModelConfiguration[];
  estimatedLoadTime: number; // in seconds
  estimatedMemoryUsage: number; // in MB
  performanceImpact: 'low' | 'medium' | 'high';
  warnings?: string[];
  benefits?: string[];
}

export interface RecommendationWeights {
  networkSpeed: number; // 0-1
  deviceMemory: number; // 0-1
  gpuPerformance: number; // 0-1
  batteryLevel: number; // 0-1
  dataSaver: number; // 0-1
  userPreference: number; // 0-1
}

export interface UserPreferences {
  prioritizeQuality?: boolean;
  prioritizePerformance?: boolean;
  dataSaverMode?: boolean;
  maxLoadTime?: number; // in seconds
  preferredQuality?: 'low' | 'medium' | 'high' | 'ultra';
  excludedModels?: string[];
  autoLoadBest?: boolean;
}

class ModelRecommendationEngine {
  private defaultWeights: RecommendationWeights = {
    networkSpeed: 0.25,
    deviceMemory: 0.20,
    gpuPerformance: 0.25,
    batteryLevel: 0.10,
    dataSaver: 0.10,
    userPreference: 0.10
  };

  /**
   * Calculate the best model recommendation based on performance metrics
   */
  calculateRecommendation(
    metrics: PerformanceMetrics,
    models: ModelConfiguration[],
    userPreferences: UserPreferences = {},
    customWeights?: Partial<RecommendationWeights>
  ): ModelRecommendation {
    const weights = { ...this.defaultWeights, ...customWeights };

    console.log('🧠 Calculating model recommendation...', { metrics, userPreferences, weights });

    // Filter models based on hard requirements
    const eligibleModels = this.filterEligibleModels(models, metrics);

    if (eligibleModels.length === 0) {
      throw new Error('No models meet the minimum requirements for this device');
    }

    // Score each model
    const scoredModels = eligibleModels.map(model => ({
      model,
      score: this.calculateModelScore(model, metrics, weights, userPreferences),
      reasoning: this.generateReasoning(model, metrics, userPreferences)
    }));

    // Sort by score (highest first)
    scoredModels.sort((a, b) => b.score - a.score);

    const bestMatch = scoredModels[0];
    const alternatives = scoredModels.slice(1, 4).map(s => s.model); // Top 3 alternatives

    const recommendation: ModelRecommendation = {
      modelId: bestMatch.model.id,
      confidence: Math.min(bestMatch.score / 100, 1),
      reasoning: bestMatch.reasoning,
      alternative: alternatives,
      estimatedLoadTime: this.estimateLoadTime(bestMatch.model, metrics),
      estimatedMemoryUsage: this.estimateMemoryUsage(bestMatch.model, metrics),
      performanceImpact: this.assessPerformanceImpact(bestMatch.model, metrics),
      warnings: this.generateWarnings(bestMatch.model, metrics),
      benefits: this.generateBenefits(bestMatch.model, metrics)
    };

    console.log('✅ Recommendation calculated:', recommendation);
    return recommendation;
  }

  /**
   * Filter models that meet minimum requirements
   */
  private filterEligibleModels(
    models: ModelConfiguration[],
    metrics: PerformanceMetrics
  ): ModelConfiguration[] {
    return models.filter(model => {
      const requirements = model.minRequirements;
      if (!requirements) return true;

      // Check network speed
      if (requirements.networkSpeed && metrics.networkSpeed < requirements.networkSpeed) {
        console.log(`Model ${model.id} filtered out: insufficient network speed`);
        return false;
      }

      // Check device memory
      if (requirements.deviceMemory && metrics.deviceMemory < requirements.deviceMemory) {
        console.log(`Model ${model.id} filtered out: insufficient device memory`);
        return false;
      }

      // Check GPU tier
      if (requirements.gpuTier) {
        const tierOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        const modelTier = tierOrder[requirements.gpuTier];
        const deviceTier = tierOrder[metrics.gpuTier];
        if (deviceTier < modelTier) {
          console.log(`Model ${model.id} filtered out: insufficient GPU performance`);
          return false;
        }
      }

      // Check WebGL version
      if (requirements.webglVersion && metrics.webglVersion < requirements.webglVersion) {
        console.log(`Model ${model.id} filtered out: insufficient WebGL version`);
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate a score for a specific model (0-100)
   */
  private calculateModelScore(
    model: ModelConfiguration,
    metrics: PerformanceMetrics,
    weights: RecommendationWeights,
    userPreferences: UserPreferences
  ): number {
    let score = 50; // Base score

    // Network compatibility score
    const networkScore = this.calculateNetworkScore(model, metrics);
    score += (networkScore - 50) * weights.networkSpeed;

    // Memory compatibility score
    const memoryScore = this.calculateMemoryScore(model, metrics);
    score += (memoryScore - 50) * weights.deviceMemory;

    // GPU compatibility score
    const gpuScore = this.calculateGPUScore(model, metrics);
    score += (gpuScore - 50) * weights.gpuPerformance;

    // Battery consideration
    const batteryScore = this.calculateBatteryScore(model, metrics);
    score += (batteryScore - 50) * weights.batteryLevel;

    // Data saver consideration
    const dataSaverScore = this.calculateDataSaverScore(model, metrics, userPreferences);
    score += (dataSaverScore - 50) * weights.dataSaver;

    // User preference consideration
    const preferenceScore = this.calculatePreferenceScore(model, userPreferences);
    score += (preferenceScore - 50) * weights.userPreference;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate network compatibility score
   */
  private calculateNetworkScore(model: ModelConfiguration, metrics: PerformanceMetrics): number {
    const fileSizeMB = model.fileSize / (1024 * 1024);
    const networkSpeedMbps = metrics.networkSpeed;

    // Estimate download time in seconds
    const estimatedTime = (fileSizeMB * 8) / networkSpeedMbps;

    if (estimatedTime < 2) return 90; // Excellent
    if (estimatedTime < 5) return 75; // Good
    if (estimatedTime < 10) return 60; // Fair
    if (estimatedTime < 20) return 40; // Poor
    return 20; // Very Poor
  }

  /**
   * Calculate memory compatibility score
   */
  private calculateMemoryScore(model: ModelConfiguration, metrics: PerformanceMetrics): number {
    const modelMemoryMB = this.estimateMemoryUsage(model, metrics);
    const availableMemoryGB = metrics.deviceMemory;

    // Assume 70% of device memory is available for applications
    const availableMemoryMB = availableMemoryGB * 1024 * 0.7;

    const memoryUsageRatio = modelMemoryMB / availableMemoryMB;

    if (memoryUsageRatio < 0.1) return 90; // Excellent
    if (memoryUsageRatio < 0.2) return 75; // Good
    if (memoryUsageRatio < 0.4) return 60; // Fair
    if (memoryUsageRatio < 0.6) return 40; // Poor
    return 20; // Very Poor
  }

  /**
   * Calculate GPU compatibility score
   */
  private calculateGPUScore(model: ModelConfiguration, metrics: PerformanceMetrics): number {
    const qualityScores = {
      'low': { low: 90, medium: 95, high: 98 },
      'medium': { low: 60, medium: 80, high: 95 },
      'high': { low: 30, medium: 60, high: 85 },
      'ultra': { low: 20, medium: 40, high: 70 }
    };

    return qualityScores[model.quality]?.[metrics.gpuTier] || 50;
  }

  /**
   * Calculate battery impact score
   */
  private calculateBatteryScore(model: ModelConfiguration, metrics: PerformanceMetrics): number {
    if (metrics.batteryLevel === undefined || metrics.isCharging) {
      return 80; // Assume good if charging or unknown
    }

    const batteryLevel = metrics.batteryLevel;
    const qualityImpact = {
      'low': 0.1,
      'medium': 0.3,
      'high': 0.6,
      'ultra': 1.0
    }[model.quality];

    if (batteryLevel < 0.2 && qualityImpact > 0.5) return 20; // Bad - will drain battery fast
    if (batteryLevel < 0.5 && qualityImpact > 0.7) return 40; // Poor
    if (batteryLevel < 0.3) return 60; // Fair
    return 85; // Good
  }

  /**
   * Calculate data saver score
   */
  private calculateDataSaverScore(
    model: ModelConfiguration,
    metrics: PerformanceMetrics,
    userPreferences: UserPreferences
  ): number {
    const fileSizeMB = model.fileSize / (1024 * 1024);

    if (userPreferences.dataSaverMode || metrics.saveData) {
      if (fileSizeMB < 1) return 90;
      if (fileSizeMB < 5) return 70;
      if (fileSizeMB < 20) return 40;
      return 20;
    }

    // Normal scoring based on file size
    if (fileSizeMB < 10) return 80;
    if (fileSizeMB < 50) return 70;
    if (fileSizeMB < 100) return 60;
    return 50;
  }

  /**
   * Calculate user preference score
   */
  private calculatePreferenceScore(model: ModelConfiguration, userPreferences: UserPreferences): number {
    let score = 50;

    // Quality preference
    if (userPreferences.preferredQuality === model.quality) {
      score += 30;
    }

    // Quality vs performance preference
    if (userPreferences.prioritizeQuality) {
      const qualityBonus = { 'low': 10, 'medium': 20, 'high': 30, 'ultra': 40 }[model.quality];
      score += qualityBonus;
    } else if (userPreferences.prioritizePerformance) {
      const performanceBonus = { 'ultra': 10, 'high': 20, 'medium': 30, 'low': 40 }[model.quality];
      score += performanceBonus;
    }

    // Excluded models
    if (userPreferences.excludedModels?.includes(model.id)) {
      score = 0;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Estimate model load time in seconds
   */
  private estimateLoadTime(model: ModelConfiguration, metrics: PerformanceMetrics): number {
    const fileSizeMB = model.fileSize / (1024 * 1024);
    const networkSpeedMbps = metrics.networkSpeed;

    // Download time
    const downloadTime = (fileSizeMB * 8) / networkSpeedMbps;

    // Processing time (based on model complexity and device performance)
    const processingTimes = {
      'low': 0.5,
      'medium': 1.0,
      'high': 2.0,
      'ultra': 4.0
    };

    const baseProcessingTime = processingTimes[model.quality];
    const gpuMultiplier = { 'low': 2.0, 'medium': 1.0, 'high': 0.5 }[metrics.gpuTier];
    const processingTime = baseProcessingTime * gpuMultiplier;

    return Math.round((downloadTime + processingTime) * 10) / 10;
  }

  /**
   * Estimate memory usage in MB
   */
  private estimateMemoryUsage(model: ModelConfiguration, metrics: PerformanceMetrics): number {
    const fileSizeMB = model.fileSize / (1024 * 1024);

    // Base memory usage is file size plus additional overhead
    const qualityMultipliers = {
      'low': 1.5,
      'medium': 2.0,
      'high': 3.0,
      'ultra': 4.0
    };

    return Math.round(fileSizeMB * qualityMultipliers[model.quality]);
  }

  /**
   * Assess performance impact
   */
  private assessPerformanceImpact(model: ModelConfiguration, metrics: PerformanceMetrics): 'low' | 'medium' | 'high' {
    const memoryUsage = this.estimateMemoryUsage(model, metrics);
    const availableMemory = metrics.deviceMemory * 1024 * 0.7; // 70% of available memory
    const memoryRatio = memoryUsage / availableMemory;

    if (memoryRatio > 0.5) return 'high';
    if (memoryRatio > 0.2) return 'medium';
    return 'low';
  }

  /**
   * Generate reasoning for recommendation
   */
  private generateReasoning(
    model: ModelConfiguration,
    metrics: PerformanceMetrics,
    userPreferences: UserPreferences
  ): string[] {
    const reasoning: string[] = [];

    // Network reasoning
    const loadTime = this.estimateLoadTime(model, metrics);
    if (loadTime < 3) {
      reasoning.push(`Fast download expected (${loadTime}s)`);
    } else if (loadTime > 10) {
      reasoning.push(`Longer load time due to large file size (${loadTime}s)`);
    }

    // GPU reasoning
    if (model.quality === 'ultra' && metrics.gpuTier === 'high') {
      reasoning.push('Your high-end GPU can handle ultra quality models');
    } else if (model.quality === 'high' && metrics.gpuTier === 'medium') {
      reasoning.push('Good balance of quality and performance for your device');
    } else if (model.quality === 'low' && metrics.gpuTier === 'low') {
      reasoning.push('Optimized for your device capabilities');
    }

    // Memory reasoning
    const memoryUsage = this.estimateMemoryUsage(model, metrics);
    if (memoryUsage < 100) {
      reasoning.push('Low memory footprint');
    } else if (memoryUsage > 500) {
      reasoning.push('Higher memory usage but provides better visual quality');
    }

    // Network type reasoning
    if (metrics.effectiveType === '4g' && model.quality !== 'low') {
      reasoning.push('4G connection supports higher quality models');
    } else if (metrics.effectiveType === '2g' && model.quality === 'low') {
      reasoning.push('Optimized for slower connections');
    }

    // Battery reasoning
    if (metrics.batteryLevel && metrics.batteryLevel < 0.3 && !metrics.isCharging) {
      reasoning.push('Selected to conserve battery life');
    }

    return reasoning;
  }

  /**
   * Generate warnings for the recommended model
   */
  private generateWarnings(model: ModelConfiguration, metrics: PerformanceMetrics): string[] {
    const warnings: string[] = [];

    const loadTime = this.estimateLoadTime(model, metrics);
    if (loadTime > 15) {
      warnings.push(`Long load time expected (${loadTime}s)`);
    }

    const memoryUsage = this.estimateMemoryUsage(model, metrics);
    if (memoryUsage > 500) {
      warnings.push('High memory usage may affect performance');
    }

    if (metrics.batteryLevel && metrics.batteryLevel < 0.2 && !metrics.isCharging) {
      warnings.push('May drain battery quickly');
    }

    if (model.quality === 'ultra' && metrics.gpuTier !== 'high') {
      warnings.push('May experience reduced performance on your device');
    }

    return warnings;
  }

  /**
   * Generate benefits for the recommended model
   */
  private generateBenefits(model: ModelConfiguration, metrics: PerformanceMetrics): string[] {
    const benefits: string[] = [];

    if (model.quality === 'ultra') {
      benefits.push('Maximum visual quality and detail');
      benefits.push('Best possible lighting and textures');
    } else if (model.quality === 'high') {
      benefits.push('High quality visuals with good performance');
      benefits.push('Detailed textures and lighting');
    } else if (model.quality === 'medium') {
      benefits.push('Balanced quality and performance');
      benefits.push('Good visual quality with fast loading');
    } else {
      benefits.push('Fast loading and smooth performance');
      benefits.push('Optimized for all devices');
    }

    const loadTime = this.estimateLoadTime(model, metrics);
    if (loadTime < 3) {
      benefits.push('Quick load time');
    }

    if (this.assessPerformanceImpact(model, metrics) === 'low') {
      benefits.push('Minimal performance impact');
    }

    return benefits;
  }

  /**
   * Get recommended quality based on metrics alone (without specific models)
   */
  getRecommendedQualityLevel(metrics: PerformanceMetrics): 'low' | 'medium' | 'high' | 'ultra' {
    const score = metrics.overallScore;

    if (score >= 85 && metrics.networkSpeed > 20 && metrics.gpuTier === 'high') {
      return 'ultra';
    } else if (score >= 70 && metrics.networkSpeed > 10 && metrics.gpuTier !== 'low') {
      return 'high';
    } else if (score >= 50 && metrics.networkSpeed > 2) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Validate model configuration
   */
  validateModelConfiguration(model: ModelConfiguration): string[] {
    const errors: string[] = [];

    if (!model.id || model.id.trim() === '') {
      errors.push('Model ID is required');
    }

    if (!model.name || model.name.trim() === '') {
      errors.push('Model name is required');
    }

    if (!model.url || model.url.trim() === '') {
      errors.push('Model URL is required');
    }

    if (!model.fileSize || model.fileSize <= 0) {
      errors.push('File size must be greater than 0');
    }

    if (!['low', 'medium', 'high', 'ultra'].includes(model.quality)) {
      errors.push('Quality must be one of: low, medium, high, ultra');
    }

    return errors;
  }
}

// Export singleton instance
export const modelRecommendationEngine = new ModelRecommendationEngine();

