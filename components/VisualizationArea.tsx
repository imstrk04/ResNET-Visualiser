import React from 'react';
import { NetworkVisualizer } from './NetworkVisualizer';
import { NetworkType } from '../types';

interface VisualizationAreaProps {
  depth: number;
  activeBlock: number;
  isSimulating: boolean;
  onGetExplanation: (networkType: NetworkType) => void;
  showGradients?: boolean;
  inputImage?: string; // Add this prop
}

export const VisualizationArea: React.FC<VisualizationAreaProps> = ({ 
  depth, 
  activeBlock, 
  isSimulating, 
  onGetExplanation,
  showGradients = false,
  inputImage // Receive the inputImage prop
}) => {
  return (
    <div className="space-y-8">
      <NetworkVisualizer
        type="plain"
        depth={depth}
        activeBlock={activeBlock}
        isSimulating={isSimulating}
        onGetExplanation={onGetExplanation}
        showGradients={showGradients}
        inputImage={inputImage} // Pass inputImage to NetworkVisualizer
      />
      <NetworkVisualizer
        type="resnet"
        depth={depth}
        activeBlock={activeBlock}
        isSimulating={isSimulating}
        onGetExplanation={onGetExplanation}
        showGradients={showGradients}
        inputImage={inputImage} // Pass inputImage to NetworkVisualizer
      />
    </div>
  );
};