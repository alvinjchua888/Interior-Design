
import React, { useRef, useState } from 'react';
import { DesignIntensity } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string, intensity: DesignIntensity) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [intensity, setIntensity] = useState<DesignIntensity>(DesignIntensity.BALANCED);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string, intensity);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="mb-8 max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-white">Visualize your dream home.</h2>
        <p className="text-zinc-400">Select your preferred intensity and upload a photo to start staging.</p>
      </div>

      <div className="w-full max-w-sm mb-8">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Design Boldness</label>
        <div className="flex p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
          {Object.values(DesignIntensity).map((level) => (
            <button
              key={level}
              onClick={() => setIntensity(level)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                intensity === level 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500 italic">
          {intensity === DesignIntensity.SUBTLE && "Light staging, preserves airy white walls."}
          {intensity === DesignIntensity.BALANCED && "Professional interior staging with rich detail."}
          {intensity === DesignIntensity.BOLD && "Dramatic transformation with textures and colors."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-700 rounded-3xl cursor-pointer hover:border-blue-500 hover:bg-zinc-900 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <i className="fas fa-cloud-upload-alt text-4xl text-zinc-500 group-hover:text-blue-500 mb-3"></i>
            <p className="mb-2 text-sm text-zinc-400 font-semibold">Upload room photo</p>
            <p className="text-xs text-zinc-500">PNG, JPG or WebP</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#09090b] px-2 text-zinc-500">Or use camera</span>
          </div>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-black font-semibold py-4 rounded-2xl transition-all active:scale-95"
        >
          <i className="fas fa-camera"></i>
          Snap a photo
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
