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
  showGradients?: boolean;
}

const titles = {
  plain: 'Plain Network',
  resnet: 'Residual Network (ResNet)',
};

const descriptions = {
  plain: 'Sequential layers - information degrades with depth',
  resnet: 'Skip connections preserve information flow',
};

export const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({ 
  type, 
  depth, 
  activeBlock, 
  isSimulating, 
  onGetExplanation,
  showGradients = false 
}) => {
  const blocks = Array.from({ length: depth });
  const finalFilter = getFilterStyle(type, depth, depth);

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {titles[type]}
              {type === 'resnet' && (
                <span className="text-sm bg-emerald-500 text-white px-2 py-1 rounded">
                  Advanced
                </span>
              )}
            </h3>
            <p className="text-slate-400">{descriptions[type]}</p>
          </div>
          <Button
            variant="secondary"
            className="mt-4 sm:mt-0"
            onClick={() => onGetExplanation(type)}
            disabled={isSimulating}
          >
            Learn More
          </Button>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-2 overflow-x-auto p-4">
            {/* Input Block */}
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-xs font-semibold text-slate-400 mb-2">Input</span>
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/resnet/200" 
                  alt="Input" 
                  className="w-20 h-20 rounded-lg object-cover border-2 border-sky-500"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-sky-400 font-mono">
                  x
                </div>
              </div>
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
                  showGradient={showGradients}
                />
                
                {/* ResNet skip connection visualization */}
                {type === 'resnet' && (
                  <>
                    {/* Addition symbol */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        activeBlock >= i + 1 
                          ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400' 
                          : 'border-slate-600 text-slate-600'
                      }`}>
                        <PlusIcon className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Skip connection arc */}
                    <div className="absolute -top-6 left-0 w-full h-6 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 120 24">
                        <path
                          d="M 10 20 Q 60 4 110 20"
                          stroke={activeBlock >= i + 1 ? "#10b981" : "#475569"}
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="4,4"
                          className={activeBlock >= i + 1 ? "animate-pulse" : ""}
                        />
                        {activeBlock >= i + 1 && (
                          <text
                            x="60"
                            y="8"
                            className="text-xs fill-emerald-400 font-medium"
                            textAnchor="middle"
                          >
                            skip
                          </text>
                        )}
                      </svg>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Output Block */}
            <div className="flex items-center flex-shrink-0">
              <ArrowRightIcon className="w-8 h-8 text-slate-500 mx-2"/>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-400 mb-2">Output</span>
                <div className="relative">
                  <img 
                    src="https://picsum.photos/seed/resnet/200" 
                    alt="Output" 
                    className="w-20 h-20 rounded-lg object-cover border-2 border-rose-500 transition-all duration-500"
                    style={{
                      filter: activeBlock > depth ? finalFilter : 'none',
                    }}
                  />
                  
                  {/* Performance indicator */}
                  {activeBlock > depth && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center">
                      <div className={`px-2 py-1 rounded text-xs ${
                        type === 'plain' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {type === 'plain' ? 'Degraded' : 'Preserved'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-slate-400">Information Retention</div>
            <div className={`font-bold ${type === 'plain' ? 'text-red-400' : 'text-green-400'}`}>
              {type === 'plain' ? '~20%' : '~85%'}
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-slate-400">Gradient Flow</div>
            <div className={`font-bold ${type === 'plain' ? 'text-red-400' : 'text-green-400'}`}>
              {type === 'plain' ? 'Vanishing' : 'Stable'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};