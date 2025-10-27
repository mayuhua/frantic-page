/**
 * Smart Model Selector Component
 *
 * Intelligent 3D model selection interface with automatic performance detection
 * and recommendation system. Features compact/expandable UI with advanced controls.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { performanceDetector, PerformanceMetrics } from '../utils/performanceDetector';
import {
  modelRecommendationEngine,
  ModelConfiguration,
  ModelRecommendation,
  UserPreferences
} from '../utils/modelRecommendationEngine';

interface SmartModelSelectorProps {
  models: ModelConfiguration[];
  onModelChange: (modelId: string) => void;
  currentModelId?: string;
  showAdvancedControls?: boolean;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  autoDetect?: boolean;
  initialPreferences?: Partial<UserPreferences>;
}

interface LoadingState {
  detecting: boolean;
  loading: boolean;
  progress: number;
  currentOperation: string;
}

const SmartModelSelector: React.FC<SmartModelSelectorProps> = ({
  models,
  onModelChange,
  currentModelId,
  showAdvancedControls = false,
  className = '',
  position = 'bottom-right',
  autoDetect = true,
  initialPreferences = {}
}) => {
  // UI State
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(showAdvancedControls);
  const [isMinimized, setIsMinimized] = useState(false);

  // Data State
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [recommendation, setRecommendation] = useState<ModelRecommendation | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(currentModelId || '');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    autoLoadBest: true,
    ...initialPreferences
  });

  // Loading State
  const [loadingState, setLoadingState] = useState<LoadingState>({
    detecting: false,
    loading: false,
    progress: 0,
    currentOperation: ''
  });

  // Error State
  const [error, setError] = useState<string | null>(null);

  // Refs
  const panelRef = useRef<HTMLDivElement>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  // Auto-detect performance on mount
  useEffect(() => {
    if (autoDetect && models.length > 0) {
      detectPerformance();
    }
  }, [autoDetect, models.length]);

  // Apply recommendation when available
  useEffect(() => {
    if (recommendation && userPreferences.autoLoadBest && !selectedModel) {
      applyRecommendation(recommendation.modelId);
    }
  }, [recommendation, userPreferences.autoLoadBest, selectedModel]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  /**
   * Detect device performance and generate recommendation
   */
  const detectPerformance = useCallback(async () => {
    if (loadingState.detecting) return;

    setLoadingState(prev => ({ ...prev, detecting: true, currentOperation: 'Analyzing device performance...' }));
    setError(null);

    try {
      // Step 1: Detect performance metrics
      setLoadingState(prev => ({ ...prev, progress: 25, currentOperation: 'Testing network speed...' }));
      const metrics = await performanceDetector.detectPerformance();
      setPerformanceMetrics(metrics);

      // Step 2: Generate recommendation
      setLoadingState(prev => ({ ...prev, progress: 75, currentOperation: 'Finding optimal model...' }));
      const rec = modelRecommendationEngine.calculateRecommendation(
        metrics,
        models,
        userPreferences
      );
      setRecommendation(rec);

      setLoadingState(prev => ({ ...prev, detecting: false, progress: 100, currentOperation: 'Complete!' }));

      // Reset loading state after delay
      setTimeout(() => {
        setLoadingState(prev => ({ ...prev, detecting: false, progress: 0, currentOperation: '' }));
      }, 1000);

    } catch (err) {
      console.error('Performance detection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to detect performance');
      setLoadingState(prev => ({ ...prev, detecting: false, progress: 0, currentOperation: '' }));
    }
  }, [models, userPreferences, loadingState.detecting]);

  /**
   * Apply model recommendation
   */
  const applyRecommendation = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    onModelChange(modelId);
    setIsExpanded(false);
  }, [onModelChange]);

  /**
   * Handle manual model selection
   */
  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    onModelChange(modelId);
  }, [onModelChange]);

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  /**
   * Get quality color based on level
   */
  const getQualityColor = (quality: string): string => {
    const colors = {
      'low': 'text-yellow-500',
      'medium': 'text-blue-500',
      'high': 'text-green-500',
      'ultra': 'text-purple-500'
    };
    return colors[quality as keyof typeof colors] || 'text-gray-500';
  };

  /**
   * Get quality icon
   */
  const getQualityIcon = (quality: string): string => {
    const icons = {
      'low': '⚡',
      'medium': '🚀',
      'high': '✨',
      'ultra': '💎'
    };
    return icons[quality as keyof typeof icons] || '📦';
  };

  // Compact mode button
  const renderCompactButton = () => (
    <button
      onClick={() => setIsExpanded(true)}
      className="w-12 h-12 bg-zaku-dark/90 backdrop-blur-sm border border-zaku-green/50 rounded-lg flex items-center justify-center hover:bg-zaku-green/10 hover:border-zaku-green transition-all duration-300 group relative"
      title={`Model Quality: ${models.find(m => m.id === selectedModel)?.quality || 'Unknown'}`}
    >
      <div className="text-zaku-green text-xl group-hover:scale-110 transition-transform">
        {getQualityIcon(models.find(m => m.id === selectedModel)?.quality || 'medium')}
      </div>

      {/* Loading indicator */}
      {loadingState.detecting && (
        <div className="absolute inset-0 border-2 border-zaku-green/30 border-t-zaku-green rounded-full animate-spin" />
      )}
    </button>
  );

  // Performance summary
  const renderPerformanceSummary = () => {
    if (!performanceMetrics) return null;

    return (
      <div className="p-3 border-b border-zaku-green/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zaku-light-green font-mono">SYSTEM STATUS</span>
          <span className="text-xs text-gray-400">{performanceMetrics.overallScore}/100</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Network:</span>
            <span className="text-zaku-light-blue ml-1">
              {performanceMetrics.networkSpeed.toFixed(1)} Mbps
            </span>
          </div>
          <div>
            <span className="text-gray-500">GPU:</span>
            <span className="text-zaku-light-blue ml-1 capitalize">
              {performanceMetrics.gpuTier}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Memory:</span>
            <span className="text-zaku-light-blue ml-1">
              {performanceMetrics.deviceMemory} GB
            </span>
          </div>
          <div>
            <span className="text-gray-500">Quality:</span>
            <span className={`ml-1 capitalize ${getQualityColor(performanceMetrics.recommendedQuality)}`}>
              {performanceMetrics.recommendedQuality}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Recommendation panel
  const renderRecommendation = () => {
    if (!recommendation) return null;

    const recommendedModel = models.find(m => m.id === recommendation.modelId);
    if (!recommendedModel) return null;

    return (
      <div className="p-3 border-b border-zaku-green/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zaku-light-green font-mono">RECOMMENDED</span>
          <span className="text-xs text-gray-400">
            {Math.round(recommendation.confidence * 100)}% match
          </span>
        </div>

        <button
          onClick={() => applyRecommendation(recommendation.modelId)}
          className="w-full text-left p-2 bg-zaku-green/10 border border-zaku-green/30 rounded hover:bg-zaku-green/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-zaku-light-green flex items-center gap-1">
                {getQualityIcon(recommendedModel.quality)}
                {recommendedModel.name}
              </div>
              <div className="text-xs text-gray-400">
                {formatFileSize(recommendedModel.fileSize)} • {recommendation.estimatedLoadTime}s
              </div>
            </div>
            <div className="text-xs text-zaku-green">APPLY</div>
          </div>
        </button>

        {recommendation.reasoning.length > 0 && (
          <div className="mt-2 space-y-1">
            {recommendation.reasoning.slice(0, 2).map((reason, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-start gap-1">
                <span className="text-zaku-green">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Model list
  const renderModelList = () => (
    <div className="p-3 border-b border-zaku-green/20">
      <div className="text-xs text-zaku-light-green font-mono mb-2">ALL MODELS</div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => handleModelSelect(model.id)}
            className={`w-full text-left p-2 rounded transition-colors ${
              selectedModel === model.id
                ? 'bg-zaku-green/20 border border-zaku-green/50'
                : 'bg-zaku-dark/50 border border-zaku-green/20 hover:bg-zaku-green/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-semibold flex items-center gap-1 ${
                  selectedModel === model.id ? 'text-zaku-light-green' : 'text-gray-300'
                }`}>
                  {getQualityIcon(model.quality)}
                  {model.name}
                  {selectedModel === model.id && (
                    <span className="text-xs bg-zaku-green text-black px-1 rounded">ACTIVE</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(model.fileSize)} • {model.quality}
                </div>
              </div>
              <div className={`text-xs capitalize ${getQualityColor(model.quality)}`}>
                {model.quality}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Advanced controls
  const renderAdvancedControls = () => (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zaku-light-green font-mono">ADVANCED</span>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-zaku-light-blue hover:text-zaku-green transition-colors"
        >
          {showAdvanced ? 'HIDE' : 'SHOW'}
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-3">
          {/* Auto-load best */}
          <label className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Auto-load best model</span>
            <input
              type="checkbox"
              checked={userPreferences.autoLoadBest}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, autoLoadBest: e.target.checked }))}
              className="w-3 h-3 accent-zaku-green"
            />
          </label>

          {/* Prioritize quality */}
          <label className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Prioritize quality</span>
            <input
              type="checkbox"
              checked={userPreferences.prioritizeQuality}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, prioritizeQuality: e.target.checked }))}
              className="w-3 h-3 accent-zaku-green"
            />
          </label>

          {/* Data saver */}
          <label className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Data saver mode</span>
            <input
              type="checkbox"
              checked={userPreferences.dataSaverMode}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, dataSaverMode: e.target.checked }))}
              className="w-3 h-3 accent-zaku-green"
            />
          </label>

          {/* Re-detect button */}
          <button
            onClick={detectPerformance}
            disabled={loadingState.detecting}
            className="w-full py-1 text-xs bg-zaku-dark/50 border border-zaku-green/30 rounded hover:bg-zaku-green/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingState.detecting ? 'DETECTING...' : 'RE-DETECT PERFORMANCE'}
          </button>
        </div>
      )}
    </div>
  );

  // Loading overlay
  const renderLoadingOverlay = () => {
    if (!loadingState.detecting && !loadingState.loading) return null;

    return (
      <div className="absolute inset-0 bg-zaku-dark/90 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zaku-green/30 border-t-zaku-green rounded-full animate-spin mx-auto mb-2" />
          <div className="text-xs text-zaku-light-green font-mono">
            {loadingState.currentOperation}
          </div>
          {loadingState.progress > 0 && (
            <div className="mt-2 w-32 h-1 bg-zaku-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-zaku-green transition-all duration-300"
                style={{ width: `${loadingState.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Compact mode */}
      {!isExpanded && !isMinimized && renderCompactButton()}

      {/* Expanded panel */}
      {isExpanded && (
        <div
          ref={panelRef}
          className="w-80 bg-zaku-dark/95 backdrop-blur-md border border-zaku-green/50 rounded-lg shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-zaku-green/20">
            <h3 className="text-sm font-bold text-zaku-light-green font-mono">MODEL SELECTOR</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-zaku-light-blue hover:text-zaku-green transition-colors"
                title="Minimize"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-zaku-light-blue hover:text-zaku-green transition-colors"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {error ? (
              <div className="p-3">
                <div className="text-xs text-red-500 mb-2">Error: {error}</div>
                <button
                  onClick={detectPerformance}
                  className="text-xs text-zaku-light-green hover:text-zaku-green underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {renderPerformanceSummary()}
                {renderRecommendation()}
                {renderModelList()}
                {renderAdvancedControls()}
              </>
            )}
          </div>

          {/* Loading overlay */}
          {renderLoadingOverlay()}
        </div>
      )}

      {/* Minimized indicator */}
      {isMinimized && (
        <button
          onClick={() => {
            setIsMinimized(false);
            setIsExpanded(true);
          }}
          className="w-8 h-8 bg-zaku-green/20 border border-zaku-green/50 rounded flex items-center justify-center hover:bg-zaku-green/30 transition-colors"
          title="Model Selector (minimized)"
        >
          <div className="w-2 h-2 bg-zaku-green rounded-full animate-pulse" />
        </button>
      )}
    </div>
  );
};

export default SmartModelSelector;