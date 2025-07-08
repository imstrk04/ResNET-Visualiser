import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Slider } from './ui/Slider';

interface ControlPanelProps {
  depth: number;
  setDepth: (depth: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ depth, setDepth, onRunSimulation, isSimulating }) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Controls</h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="depth" className="block text-sm font-medium text-slate-300 mb-2">
              Network Depth: <span className="font-bold text-sky-400">{depth} Blocks</span>
            </label>
            <Slider
              id="depth"
              min={2}
              max={8}
              step={1}
              value={[depth]}
              onValueChange={(value) => setDepth(value[0])}
              disabled={isSimulating}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
             <label className="text-sm font-medium text-slate-300">Input Image</label>
             <div className="flex items-center space-x-4">
                 <img 
                    src="https://picsum.photos/seed/resnet/200" 
                    alt="Input" 
                    className="w-20 h-20 rounded-lg object-cover border-2 border-slate-600"
                 />
                 <div className="text-slate-400 text-sm">
                    <p>This image is the input 'x' to both networks.</p>
                    <p>Watch how it transforms.</p>
                 </div>
             </div>
          </div>

          <Button 
            onClick={onRunSimulation} 
            disabled={isSimulating}
            className="w-full"
          >
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </Button>
        </div>
      </div>
    </Card>
  );
};