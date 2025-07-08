import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { VisualizationArea } from './components/VisualizationArea';
import { ExplanationModal } from './components/ExplanationModal';
import { NetworkType } from './types';
import { GithubIcon } from 'lucide-react'; 

const App: React.FC = () => {
  const [depth, setDepth] = useState(4);
  const [activeBlock, setActiveBlock] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showGradients, setShowGradients] = useState(false);
  const [showExplanation, setShowExplanation] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    setActiveBlock(0);
    
    // Simulate processing through each block
    for (let i = 0; i <= depth + 1; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActiveBlock(i);
    }
    
    setIsSimulating(false);
  };

  const getExplanation = (networkType: NetworkType) => {
    const explanations = {
      plain: {
        title: 'Plain Neural Network',
        content: `Plain networks stack layers sequentially, where each layer's output becomes the next layer's input. While simple, they suffer from the vanishing gradient problem - as networks get deeper, gradients become exponentially smaller, making training difficult.

Key Issues:
- Information degrades through layers
- Gradients vanish in backpropagation  
- Limited depth capability
- Poor feature preservation`
      },
      resnet: {
        title: 'Residual Network (ResNet)',
        content: `ResNet introduces skip connections that allow information to flow directly from earlier layers to later ones. The key insight: instead of learning H(x), learn the residual F(x) = H(x) - x.

Key Benefits:
- Preserves gradient flow
- Enables very deep networks (100+ layers)
- Better feature preservation
- Solves vanishing gradient problem

Formula: H(x) = F(x) + x`
      }
    };
    
    setShowExplanation(explanations[networkType]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ResNet vs Plain Network Visualizer
          </h1>
          <p className="text-slate-400 text-lg">
            Understand how residual connections solve the vanishing gradient problem
          </p>
          <a href="https://github.com/imstrk04/ResNET-Visualiser.git" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-slate-400 hover:text-sky-400 transition-colors">
            <GithubIcon className="w-5 h-5" />
            <span>View on GitHub</span>
          </a>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ControlPanel
              depth={depth}
              setDepth={setDepth}
              onRunSimulation={runSimulation}
              isSimulating={isSimulating}
              showGradients={showGradients}
              setShowGradients={setShowGradients}
            />
          </div>

          <div className="lg:col-span-3">
            <VisualizationArea
              depth={depth}
              activeBlock={activeBlock}
              isSimulating={isSimulating}
              onGetExplanation={getExplanation}
              showGradients={showGradients}
            />
          </div>
        </div>

        <ExplanationModal
          isOpen={!!showExplanation}
          onClose={() => setShowExplanation(null)}
          title={showExplanation?.title || ''}
          content={showExplanation?.content || ''}
        />
      </div>
    </div>
  );
};

export default App;