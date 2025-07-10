import React, { useState, useEffect } from 'react';
import { NetworkType } from '../types';

interface TransformationBlockProps {
  type: NetworkType;
  index: number;
  depth: number;
  isActive: boolean;
  showGradient?: boolean;
  inputImage?: string;
}

export const getFilterStyle = (type: NetworkType, index: number, totalDepth: number): string => {
  const intensity = (index + 1) / totalDepth;
  if (type === 'plain') {
    const blur = intensity * 5;
    const grayscale = intensity * 0.8;
    const brightness = Math.max(0.2, 1 - intensity * 0.6);
    return `blur(${blur}px) grayscale(${grayscale}) brightness(${brightness})`;
  } else {
    const blur = intensity * 1.5;
    const grayscale = intensity * 0.2;
    const brightness = Math.max(0.7, 1 - intensity * 0.2);
    return `blur(${blur}px) grayscale(${grayscale}) brightness(${brightness})`;
  }
};

export const TransformationBlock: React.FC<TransformationBlockProps> = ({ 
  type, 
  index, 
  depth, 
  isActive, 
  showGradient = false,
  inputImage
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setAnimationPhase(prev => (prev + 1) % 3);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive, animationPhase]);

  const filterStyle = getFilterStyle(type, index, depth);
  
  // Use uploaded image or default
  const currentImage = inputImage || "https://picsum.photos/seed/resnet/200";
  
  return (
    <div className="flex flex-col items-center flex-shrink-0 relative">
      <span className="text-xs font-semibold text-slate-400 mb-2 truncate">
        Block {index + 1}
      </span>
      
      {/* Processing indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse z-10"></div>
      )}
      
      <div 
        className={`w-20 h-20 rounded-lg border-2 transition-all duration-500 ease-in-out relative overflow-hidden ${
          isActive ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-400/30' : 'border-slate-600'
        }`}
      >
        <img 
          src={currentImage}
          alt={`Transformation ${index+1}`}
          className="w-full h-full rounded-md object-cover transition-all duration-500"
          style={{
            filter: isActive ? filterStyle : 'none'
          }}
        />
        
        {/* Gradient flow visualization */}
        {showGradient && isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
        )}
      </div>
      
      {/* Information degradation indicator */}
      {isActive && (
        <div className="mt-1 text-xs text-center">
          <div className={`w-16 h-1 rounded-full ${
            type === 'plain' 
              ? 'bg-red-500' 
              : 'bg-green-500'
          }`} 
          style={{
            opacity: type === 'plain' ? 1 - (index + 1) / depth : 0.8
          }}></div>
          <span className="text-slate-500 text-xs">
            {type === 'plain' ? 'Degrading' : 'Preserved'}
          </span>
        </div>
      )}
    </div>
  );
};