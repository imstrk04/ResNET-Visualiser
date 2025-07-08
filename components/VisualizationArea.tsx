import React from 'react';
import { NetworkVisualizer } from './NetworkVisualizer';
import { NetworkType } from '../types';

interface VisualizationAreaProps {
  depth: number;
  activeBlock: number;
  isSimulating: boolean;
  onGetExplanation: (networkType: NetworkType) => void;
  showGradients?: boolean;
}

export const VisualizationArea: React.FC<VisualizationAreaProps> = ({ 
  depth, 
  activeBlock, 
  isSimulating, 
  onGetExplanation,
  showGradients = false 
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
      />
      <NetworkVisualizer
        type="resnet"
        depth={depth}
        activeBlock={activeBlock}
        isSimulating={isSimulating}
        onGetExplanation={onGetExplanation}
        showGradients={showGradients}
      />
    </div>
  );
};