
import React from 'react';
import { NetworkType } from '../types';

interface TransformationBlockProps {
  type: NetworkType;
  index: number;
  depth: number;
  isActive: boolean;
}

export const getFilterStyle = (type: NetworkType, index: number, totalDepth: number): string => {
  const intensity = (index + 1) / totalDepth;
  if (type === 'plain') {
    // Plain network: degradation is aggressive
    const blur = intensity * 5; // up to 5px blur
    const grayscale = intensity * 0.8; // up to 80% grayscale
    return `blur(${blur}px) grayscale(${grayscale})`;
  } else {
    // ResNet: degradation is much milder
    const blur = intensity * 1.5; // up to 1.5px blur
    const grayscale = intensity * 0.2; // up to 20% grayscale
    return `blur(${blur}px) grayscale(${grayscale})`;
  }
};

export const TransformationBlock: React.FC<TransformationBlockProps> = ({ type, index, depth, isActive }) => {
  const filterStyle = getFilterStyle(type, index, depth);
  
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <span className="text-xs font-semibold text-slate-400 mb-2 truncate">Block {index + 1}</span>
      <div 
        className={`w-20 h-20 rounded-lg object-cover border-2 transition-all duration-500 ease-in-out ${isActive ? 'border-emerald-400 scale-105' : 'border-slate-600'}`}
      >
        <img 
            src="https://picsum.photos/seed/resnet/200" 
            alt={`Transformation ${index+1}`}
            className="w-full h-full rounded-md object-cover transition-all duration-500"
            style={{
                filter: isActive ? filterStyle : 'none'
            }}
        />
      </div>
    </div>
  );
};
