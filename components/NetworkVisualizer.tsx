
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TransformationBlock, getFilterStyle } from './TransformationBlock';
import { ArrowRightIcon, PlusIcon } from './Icon';
import { NetworkType } from '../types';

interface NetworkVisualizerProps {
  type: NetworkType;
  depth: number;
  activeBlock: number;
  isSimulating: boolean;
  onGetExplanation: (networkType: NetworkType) => void;
}

const titles = {
  plain: 'Plain Network',
  resnet: 'Residual Network (ResNet)',
};

const descriptions = {
  plain: 'Layers are stacked sequentially. Information can degrade over depth.',
  resnet: 'Shortcut connections help preserve the original signal, enabling deeper networks.',
};

export const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({ type, depth, activeBlock, isSimulating, onGetExplanation }) => {
  const blocks = Array.from({ length: depth });
  const finalFilter = getFilterStyle(type, depth, depth);

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">{titles[type]}</h3>
            <p className="text-slate-400">{descriptions[type]}</p>
          </div>
          <Button
            variant="secondary"
            className="mt-4 sm:mt-0"
            onClick={() => onGetExplanation(type)}
            disabled={isSimulating}
          >
            Explain Concept
          </Button>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto p-4">
          {/* Input Block */}
          <div className="flex flex-col items-center flex-shrink-0">
             <span className="text-xs font-semibold text-slate-400 mb-2">Input 'x'</span>
             <img src="https://picsum.photos/seed/resnet/200" alt="Input" className="w-20 h-20 rounded-lg object-cover border-2 border-sky-500"/>
          </div>

          {/* Dynamic Blocks */}
          {blocks.map((_, i) => (
            <div key={`${type}-${i}`} className="flex items-center flex-shrink-0 relative">
              <ArrowRightIcon className="w-8 h-8 text-slate-500 mx-2"/>
              <TransformationBlock 
                type={type} 
                index={i} 
                depth={depth}
                isActive={activeBlock >= i + 1}
              />
              {type === 'resnet' && (
                <>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex flex-col items-center">
                    <div className="w-px h-6 bg-emerald-500/50"></div>
                    <PlusIcon className="w-6 h-6 text-emerald-400 bg-slate-800 rounded-full p-0.5" />
                  </div>
                  <div 
                    className="absolute bottom-full left-[-40px] w-[145px] h-10 border-b-2 border-l-2 border-r-2 border-emerald-400 rounded-bl-xl rounded-br-xl border-dashed"
                    style={{ transform: 'translateY(-10px)' }}
                  ></div>
                </>
              )}
            </div>
          ))}

          {/* Output Block */}
          <div className="flex items-center flex-shrink-0">
             <ArrowRightIcon className="w-8 h-8 text-slate-500 mx-2"/>
              <div className="flex flex-col items-center">
                 <span className="text-xs font-semibold text-slate-400 mb-2">Final Output</span>
                 <img 
                    src="https://picsum.photos/seed/resnet/200" 
                    alt="Output" 
                    className="w-20 h-20 rounded-lg object-cover border-2 border-rose-500 transition-all duration-500"
                    style={{
                      filter: activeBlock > depth ? finalFilter : 'none',
                    }}
                 />
              </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
