import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { VisualizationArea } from './components/VisualizationArea';
import { ExplanationModal } from './components/ExplanationModal';
import { NetworkType } from './types';

const App: React.FC = () => {
  const [depth, setDepth] = useState(4);
  const [activeBlock, setActiveBlock] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showGradients, setShowGradients] = useState(false);
  const [inputImage, setInputImage] = useState<string>('');
  const [explanationModal, setExplanationModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: ''
  });

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveBlock(0);
    
    // Simulate processing through blocks + final output
    const processBlocks = (blockIndex: number) => {
      if (blockIndex <= depth + 1) { // Changed from depth to depth + 1 to include output
        setTimeout(() => {
          setActiveBlock(blockIndex);
          processBlocks(blockIndex + 1);
        }, 800);
      } else {
        setIsSimulating(false);
      }
    };
    
    processBlocks(1);
  };

  const handleGetExplanation = (networkType: NetworkType) => {
    const explanations = {
      plain: {
        title: 'Plain Neural Network',
        content: `A plain neural network processes information sequentially through layers. Each layer transforms the input, but as information passes through many layers, it can become degraded due to:

• Vanishing gradients during training
• Information loss through transformations
• Lack of direct connections between distant layers

This is why deeper plain networks often perform worse than shallower ones.`
      },
      resnet: {
        title: 'Residual Network (ResNet)',
        content: `ResNet introduces "skip connections" that allow information to flow directly from earlier layers to later layers. This solves the degradation problem by:

• Allowing gradients to flow backward more easily
• Preserving original information through skip connections
• Enabling the network to learn identity mappings when needed
• Making it possible to train very deep networks (100+ layers)

The key insight: instead of learning H(x), learn F(x) = H(x) - x, then output F(x) + x.`
      }
    };

    setExplanationModal({
      isOpen: true,
      title: explanations[networkType].title,
      content: explanations[networkType].content
    });
  };

  const closeExplanationModal = () => {
    setExplanationModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ResNet vs Plain Network Visualizer
          </h1>
          <p className="text-slate-300 text-lg">
            See how skip connections preserve information flow in deep networks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              depth={depth}
              setDepth={setDepth}
              onRunSimulation={handleRunSimulation}
              isSimulating={isSimulating}
              showGradients={showGradients}
              setShowGradients={setShowGradients}
              inputImage={inputImage}
              setInputImage={setInputImage}
            />
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-2">
            <VisualizationArea
              depth={depth}
              activeBlock={activeBlock}
              isSimulating={isSimulating}
              onGetExplanation={handleGetExplanation}
              showGradients={showGradients}
              inputImage={inputImage}
            />
          </div>
        </div>

        {/* Explanation Modal */}
        <ExplanationModal
          isOpen={explanationModal.isOpen}
          onClose={closeExplanationModal}
          title={explanationModal.title}
          content={explanationModal.content}
        />
      </div>
    </div>
  );
};

export default App;