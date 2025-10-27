/**
 * Model Loading Indicator Component
 *
 * Comprehensive loading state display for 3D models with progress tracking,
 * error handling, and performance metrics
 */

import React, { useState, useEffect } from 'react';

export type LoadingStatus = 'pending' | 'loading' | 'processing' | 'ready' | 'error';

export interface LoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
  downloadSpeed?: number; // in Mbps
  estimatedTimeRemaining?: number; // in seconds
}

export interface ModelLoadingIndicatorProps {
  status: LoadingStatus;
  progress?: LoadingProgress;
  modelName?: string;
  fileSize?: number;
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({
  status,
  progress,
  modelName = 'Model',
  fileSize,
  error,
  onCancel,
  onRetry,
  showDetails = true,
  className = ''
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime] = useState(Date.now());

  // Update elapsed time
  useEffect(() => {
    if (status === 'loading' || status === 'processing') {
      const interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format time
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Format speed
  const formatSpeed = (mbps: number): string => {
    if (mbps < 1) return `${(mbps * 1024).toFixed(0)} KB/s`;
    return `${mbps.toFixed(1)} MB/s`;
  };

  // Get status icon
  const getStatusIcon = (): string => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'loading':
        return '⬇️';
      case 'processing':
        return '⚙️';
      case 'ready':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📦';
    }
  };

  // Get status color
  const getStatusColor = (): string => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'loading':
        return 'text-blue-500';
      case 'processing':
        return 'text-purple-500';
      case 'ready':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status message
  const getStatusMessage = (): string => {
    switch (status) {
      case 'pending':
        return 'Preparing to load...';
      case 'loading':
        return 'Downloading model...';
      case 'processing':
        return 'Processing 3D data...';
      case 'ready':
        return 'Model loaded successfully!';
      case 'error':
        return error || 'Failed to load model';
      default:
        return 'Loading...';
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    if (progress) return progress.percentage;
    if (status === 'pending') return 0;
    if (status === 'processing') return 90;
    if (status === 'ready') return 100;
    return 0;
  };

  // Don't render if ready and no error
  if (status === 'ready' && !error) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-zaku-dark/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="bg-zaku-darker border border-zaku-green/50 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zaku-light-green">
                {modelName}
              </h3>
              <p className="text-sm text-gray-400">
                {getStatusMessage()}
              </p>
            </div>
          </div>

          {/* Cancel button */}
          {(status === 'loading' || status === 'processing') && onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-zaku-green transition-colors"
              title="Cancel loading"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Progress bar */}
        {(status === 'loading' || status === 'processing' || status === 'pending') && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full h-2 bg-zaku-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-zaku-green to-zaku-light-green transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Detailed progress information */}
        {showDetails && (status === 'loading' || status === 'processing') && (
          <div className="space-y-2 text-xs text-gray-400 mb-4">
            {progress && (
              <>
                <div className="flex justify-between">
                  <span>Downloaded:</span>
                  <span>{formatFileSize(progress.loaded)} / {formatFileSize(progress.total)}</span>
                </div>

                {progress.downloadSpeed && (
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="text-zaku-light-blue">
                      {formatSpeed(progress.downloadSpeed)}
                    </span>
                  </div>
                )}

                {progress.estimatedTimeRemaining && (
                  <div className="flex justify-between">
                    <span>Time remaining:</span>
                    <span className="text-zaku-light-blue">
                      {formatTime(progress.estimatedTimeRemaining)}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between">
              <span>Elapsed time:</span>
              <span>{formatTime(elapsedTime)}</span>
            </div>

            {fileSize && (
              <div className="flex justify-between">
                <span>File size:</span>
                <span>{formatFileSize(fileSize)}</span>
              </div>
            )}
          </div>
        )}

        {/* Processing stage indicator */}
        {status === 'processing' && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Processing 3D geometry and textures...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-sm text-red-400">
                {error || 'An error occurred while loading the model. Please try again.'}
              </p>
            </div>

            <div className="flex gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 py-2 px-4 bg-zaku-green hover:bg-zaku-light-green text-black font-medium rounded transition-colors"
                >
                  Retry
                </button>
              )}

              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2 px-4 bg-zaku-dark hover:bg-zaku-darker border border-zaku-green/30 text-zaku-light-green font-medium rounded transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}

        {/* Tips for slow loading */}
        {status === 'loading' && progress && progress.downloadSpeed && progress.downloadSpeed < 1 && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <p className="text-xs text-yellow-400">
              💡 <strong>Slow connection detected.</strong> Consider selecting a smaller model for faster loading.
            </p>
          </div>
        )}

        {/* Success state (brief display) */}
        {status === 'ready' && (
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Ready to display!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelLoadingIndicator;