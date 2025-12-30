import React, { useState } from 'react';
import { AppState, DesignOption, DESIGN_STYLES, DesignIntensity } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import DesignGrid from './components/DesignGrid';
import DesignEditor from './components/DesignEditor';
import GitHubUploadModal from './components/GitHubUploadModal';
import { generateInteriorDesign, editDesign } from './services/geminiService';
import { compressImage } from './services/imageUtils';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [designs, setDesigns] = useState<DesignOption[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<DesignOption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentIntensity, setCurrentIntensity] = useState<DesignIntensity>(DesignIntensity.BALANCED);

  const [designToUpload, setDesignToUpload] = useState<DesignOption | null>(null);

  const resetApp = () => {
    setState(AppState.IDLE);
    setDesigns([]);
    setSelectedDesign(null);
    setIsGenerating(false);
    setErrorMessage(null);
    setDesignToUpload(null);
  };

  const handleBackToGrid = () => {
    setSelectedDesign(null);
    setState(AppState.SELECTING_DESIGN);
  };

  const handleImageSelected = async (base64: string, intensity: DesignIntensity) => {
    setCurrentIntensity(intensity);
    setState(AppState.GENERATING_INITIAL);
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const compressed = await compressImage(base64);

      const generationPromises = DESIGN_STYLES.map(async (style, index) => {
        try {
          const generatedUrl = await generateInteriorDesign(compressed, style, intensity);
          if (generatedUrl) {
            const designObj: DesignOption = {
              id: `design-${Date.now()}-${index}`,
              style: style,
              imageUrl: generatedUrl
            };
            setDesigns(prev => {
              if (prev.find(d => d.style === style)) return prev;
              return [...prev, designObj];
            });
            return designObj;
          }
        } catch (err) {
          console.error(`Failed to generate style ${style}:`, err);
        }
        return null;
      });

      await Promise.allSettled(generationPromises);

      if (designs.length === 0) {
        const anyResults = (await Promise.all(generationPromises)).some(Boolean);
        if (!anyResults && designs.length === 0) {
           setErrorMessage("Connection issue. Please try a different photo.");
        }
      }
    } catch (err) {
      setErrorMessage("Photo processing failed. Try another image.");
      console.error(err);
    } finally {
      setIsGenerating(false);
      setState(AppState.SELECTING_DESIGN);
    }
  };

  const handleDesignSelect = (design: DesignOption) => {
    setSelectedDesign(design);
    setState(AppState.EDITING_DESIGN);
  };

  const handleUpdateDesign = async (instruction: string) => {
    if (!selectedDesign) return;
    setState(AppState.UPDATING_DESIGN);
    try {
      const updatedUrl = await editDesign(selectedDesign.imageUrl, instruction);
      if (updatedUrl) {
        const updatedDesign = { ...selectedDesign, imageUrl: updatedUrl };
        setSelectedDesign(updatedDesign);
        setDesigns(prev => prev.map(d => d.id === selectedDesign.id ? updatedDesign : d));
      }
    } catch (err) {
      alert("AI couldn't apply that specific change. Try a simpler request!");
    } finally {
      setState(AppState.EDITING_DESIGN);
    }
  };

  const handleGitHubSuccess = () => {
    setDesignToUpload(null);
    alert('Design uploaded successfully to GitHub!');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto shadow-2xl bg-[#09090b]">
      <Header onReset={resetApp} />

      <main className="flex-1 overflow-auto">
        {state === AppState.IDLE && (
          <ImageUploader onImageSelected={handleImageSelected} />
        )}

        {(state === AppState.GENERATING_INITIAL || state === AppState.SELECTING_DESIGN) && (
          <div className="pb-12">
            {errorMessage && (
              <div className="m-6 p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-red-200 text-center">
                <i className="fas fa-exclamation-triangle text-2xl mb-3 text-red-500"></i>
                <p className="mb-4 font-medium">{errorMessage}</p>
                <button
                  onClick={resetApp}
                  className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Restart
                </button>
              </div>
            )}
            <DesignGrid
              designs={designs}
              onSelect={handleDesignSelect}
              onReset={resetApp}
              onGitHubUpload={setDesignToUpload}
              isLoading={isGenerating}
            />
          </div>
        )}

        {(state === AppState.EDITING_DESIGN || state === AppState.UPDATING_DESIGN) && selectedDesign && (
          <DesignEditor
            design={selectedDesign}
            onUpdate={handleUpdateDesign}
            onBack={handleBackToGrid}
            onReset={resetApp}
            onGitHubUpload={setDesignToUpload}
            isUpdating={state === AppState.UPDATING_DESIGN}
          />
        )}
      </main>

      {designToUpload && (
        <GitHubUploadModal
          design={designToUpload}
          onClose={() => setDesignToUpload(null)}
          onSuccess={handleGitHubSuccess}
        />
      )}

      {state === AppState.GENERATING_INITIAL && designs.length === 0 && !errorMessage && (
        <div className="fixed inset-0 z-[60] glass flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 relative mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-zinc-800 border-b-blue-300 animate-[spin_1s_linear_infinite_reverse]"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">{currentIntensity} Staging</h2>
          <p className="text-zinc-400 max-w-xs mx-auto">
            {currentIntensity === DesignIntensity.SUBTLE
              ? "Applying minimal staging and clean lines..."
              : "Adding architectural textures and custom lighting..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
