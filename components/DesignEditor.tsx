import React, { useState } from 'react';
import { DesignOption } from '../types';
import { downloadBase64Image } from '../services/imageUtils';

interface DesignEditorProps {
  design: DesignOption;
  onUpdate: (instruction: string) => void;
  onBack: () => void;
  onReset: () => void;
  onGitHubUpload: (design: DesignOption) => void;
  isUpdating: boolean;
}

const DesignEditor: React.FC<DesignEditorProps> = ({ design, onUpdate, onBack, onReset, onGitHubUpload, isUpdating }) => {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instruction.trim() && !isUpdating) {
      onUpdate(instruction);
      setInstruction('');
    }
  };

  const handleSave = () => {
    downloadBase64Image(design.imageUrl, `Lumina-Edit-${design.style.replace(/\s+/g, '-')}.png`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <i className="fas fa-arrow-left"></i>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-zinc-800"></div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">New</span>
          </button>
          <div className="h-4 w-px bg-zinc-800"></div>
          <button
            onClick={() => onGitHubUpload(design)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <i className="fab fa-github"></i>
            <span className="hidden sm:inline">GitHub</span>
          </button>
          <div className="h-4 w-px bg-zinc-800"></div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-bold"
          >
            <i className="fas fa-save"></i>
            Save
          </button>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 hidden md:inline">{design.style}</span>
      </div>

      <div className="flex-1 overflow-hidden relative bg-black">
        <img
          src={design.imageUrl}
          alt="Current Design"
          className="w-full h-full object-contain"
        />

        {isUpdating && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-zinc-800 h-12 w-12 mb-4"></div>
            <p className="text-lg font-bold text-white animate-pulse">Applying your changes...</p>
          </div>
        )}
      </div>

      <div className="glass p-6 border-t border-zinc-800">
        <div className="max-w-xl mx-auto">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white">Refine your design</h3>
            <p className="text-zinc-500 text-sm">Describe any changes like "Add a floor lamp" or "Make the walls blue".</p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Enter instruction..."
              disabled={isUpdating}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!instruction.trim() || isUpdating}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 whitespace-nowrap"
            >
              {isUpdating ? <i className="fas fa-spinner fa-spin"></i> : 'Apply'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DesignEditor;
