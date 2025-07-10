import React, { useRef, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Slider } from './ui/Slider';
import { Upload, X, Image } from 'lucide-react';

interface ControlPanelProps {
  depth: number;
  setDepth: (depth: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  showGradients?: boolean;
  setShowGradients?: (show: boolean) => void;
  inputImage?: string;
  setInputImage?: (image: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  depth, 
  setDepth, 
  onRunSimulation, 
  isSimulating,
  showGradients = false,
  setShowGradients,
  inputImage,
  setInputImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (setInputImage) {
          setInputImage(result);
          setUploadedFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPG, PNG, GIF, etc.)');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const clearImage = () => {
    if (setInputImage) {
      setInputImage('');
      setUploadedFileName('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const defaultImage = "https://picsum.photos/seed/resnet/200";
  const currentImage = inputImage || defaultImage;

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
          
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium text-slate-300">Input Image</label>
            
            {/* Image Preview */}
            <div className="relative">
              <img 
                src={currentImage}
                alt="Network input" 
                className="w-full h-32 rounded-lg object-cover border-2 border-slate-600"
              />
              {inputImage && (
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  title="Remove uploaded image"
                >
                  <X size={16} />
                </button>
              )}
              
              {/* File name display */}
              {uploadedFileName && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs max-w-[calc(100%-4rem)] truncate">
                  {uploadedFileName}
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                dragActive 
                  ? 'border-blue-400 bg-blue-400/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-slate-400" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium">Click to upload or drag & drop</p>
                  <p className="text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="text-slate-400 text-sm">
              <p>Upload your own image or use the default sample</p>
              <p>Both networks will process the same input for comparison</p>
              {uploadedFileName && (
                <p className="text-green-400 mt-1">✓ Using: {uploadedFileName}</p>
              )}
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