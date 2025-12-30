import React from 'react';
import { DesignOption, DESIGN_STYLES } from '../types';
import { downloadBase64Image } from '../services/imageUtils';

interface DesignGridProps {
  designs: DesignOption[];
  onSelect: (design: DesignOption) => void;
  onReset: () => void;
  onGitHubUpload: (design: DesignOption) => void;
  isLoading: boolean;
}

const DesignGrid: React.FC<DesignGridProps> = ({ designs, onSelect, onReset, onGitHubUpload, isLoading }) => {
  const renderedStyles = designs.map(d => d.style);
  const pendingStyles = DESIGN_STYLES.filter(s => !renderedStyles.includes(s));

  const handleDownload = (e: React.MouseEvent, design: DesignOption) => {
    e.stopPropagation();
    downloadBase64Image(design.imageUrl, `Lumina-${design.style.replace(/\s+/g, '-')}.png`);
  };

  const handleGitHub = (e: React.MouseEvent, design: DesignOption) => {
    e.stopPropagation();
    onGitHubUpload(design);
  };

  return (
    <div className="p-4 sm:p-6 pb-24">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Style Variations</h2>
          <p className="text-zinc-400">
            {isLoading
              ? `Generating your dream interior... (${designs.length}/${DESIGN_STYLES.length})`
              : "Select a design to start personalizing furniture and decor."
            }
          </p>
        </div>
        {!isLoading && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition-all text-sm font-medium w-fit"
          >
            <i className="fas fa-plus"></i>
            Upload New Photo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {designs.map((design) => (
          <div
            key={design.id}
            onClick={() => onSelect(design)}
            className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98]"
          >
            <div className="aspect-[16/9] overflow-hidden bg-zinc-800">
              <img
                src={design.imageUrl}
                alt={design.style}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                style={{ opacity: 0, transition: 'opacity 0.8s ease-out' }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 flex justify-between items-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Theme</p>
                <h3 className="font-bold text-white text-xl drop-shadow-md">{design.style}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleGitHub(e, design)}
                  className="bg-zinc-900/80 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl hover:bg-zinc-700 transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-200"
                  title="Upload to GitHub"
                >
                  <i className="fab fa-github text-sm"></i>
                </button>
                <button
                  onClick={(e) => handleDownload(e, design)}
                  className="bg-zinc-900/80 backdrop-blur-md text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl hover:bg-blue-600 transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
                  title="Save to Device"
                >
                  <i className="fas fa-download text-sm"></i>
                </button>
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <i className="fas fa-arrow-right text-black"></i>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && pendingStyles.map((style, i) => (
          <div key={`pending-${style}`} className="flex flex-col items-center justify-center aspect-[16/9] border border-zinc-800 rounded-3xl bg-zinc-900/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
            <div className="flex flex-col items-center">
              <div className="loader ease-linear rounded-full border-2 border-t-2 border-zinc-700 h-8 w-8 mb-4"></div>
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Applying</p>
              <p className="text-sm font-medium text-zinc-500 animate-pulse">{style}...</p>
            </div>
            <style>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignGrid;
