import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Slider } from './ui/Slider';

interface ControlPanelProps {
  depth: number;
  setDepth: (depth: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  showGradients?: boolean;
  setShowGradients?: (show: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  depth, 
  setDepth, 
  onRunSimulation, 
  isSimulating,
  showGradients = false,
  setShowGradients
}) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Simulation Controls</h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="depth" className="block text-sm font-medium text-slate-300 mb-2">
              Network Depth: <span className="font-bold text-sky-400">{depth} Blocks</span>
            </label>
            <Slider
              id="depth"
              min={2}
              max={10}
              step={1}
              value={[depth]}
              onValueChange={(value) => setDepth(value[0])}
              disabled={isSimulating}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Shallow</span>
              <span>Deep</span>
            </div>
          </div>
          
          {setShowGradients && (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="gradients"
                checked={showGradients}
                onChange={(e) => setShowGradients(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="gradients" className="text-sm text-slate-300 cursor-pointer">
                Show Gradient Flow
              </label>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-slate-300">Sample Input</label>
            <div className="flex items-center space-x-4">
              <img 
                src="https://picsum.photos/seed/resnet/200" 
                alt="Input" 
                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-600"
              />
              <div className="text-slate-400 text-sm">
                <p>Original image fed to both networks</p>
                <p>Observe the difference in output quality</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onRunSimulation} 
            disabled={isSimulating}
            className="w-full"
          >
            {isSimulating ? 'Processing...' : 'Run Comparison'}
          </Button>
        </div>
      </div>
    </Card>
  );
};