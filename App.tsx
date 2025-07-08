
import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { VisualizationArea } from './components/VisualizationArea';
import { getExplanation } from './services/geminiService';
import { Modal } from './components/ui/Modal';
import { NetworkType } from './types';
import { GithubIcon } from './components/Icon';

const App: React.FC = () => {
  const [depth, setDepth] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeBlock, setActiveBlock] = useState<number>(-1);
  const [explanation, setExplanation] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);
  const [explanationTitle, setExplanationTitle] = useState<string>('');

  const handleRunSimulation = useCallback(() => {
    setIsSimulating(true);
    setActiveBlock(-1);
  }, []);

  useEffect(() => {
    if (isSimulating) {
      const timers: number[] = [];
      for (let i = 0; i <= depth; i++) {
        const timer = setTimeout(() => {
          setActiveBlock(i);
          if (i === depth) {
            setIsSimulating(false);
          }
        }, i * 600);
        timers.push(timer);
      }
      return () => timers.forEach(clearTimeout);
    }
  }, [isSimulating, depth]);
  
  const handleGetExplanation = useCallback(async (networkType: NetworkType) => {
    setIsLoadingExplanation(true);
    setIsModalOpen(true);
    setExplanationTitle(`Explaining ${networkType === 'resnet' ? 'Residual' : 'Plain'} Networks`);
    try {
      const result = await getExplanation(networkType);
      setExplanation(result);
    } catch (error) {
      console.error('Failed to get explanation:', error);
      setExplanation('Sorry, I couldn\'t fetch the explanation. Please check the console for more details.');
    } finally {
      setIsLoadingExplanation(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
            ResNet Visualization
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Comparing Plain vs. Residual Networks for Deep Learning.
          </p>
           <a href="" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-slate-400 hover:text-sky-400 transition-colors">
            <GithubIcon className="w-5 h-5" />
            <span>View on GitHub</span>
          </a>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <ControlPanel
              depth={depth}
              setDepth={setDepth}
              onRunSimulation={handleRunSimulation}
              isSimulating={isSimulating}
            />
          </div>
          <div className="lg:col-span-9">
            <VisualizationArea
              depth={depth}
              activeBlock={activeBlock}
              isSimulating={isSimulating}
              onGetExplanation={handleGetExplanation}
            />
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={explanationTitle}
      >
        {isLoadingExplanation ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-400"></div>
          </div>
        ) : (
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: explanation }}/>
        )}
      </Modal>
    </div>
  );
};

export default App;
