import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-50 glass px-6 py-4 flex justify-between items-center border-b border-zinc-800">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
        <div className="bg-blue-600 p-2 rounded-lg">
          <i className="fas fa-couch text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Lumina<span className="text-blue-500">Interior</span></h1>
      </div>
      <button
        onClick={onReset}
        className="text-zinc-400 hover:text-white transition-colors p-2"
      >
        <i className="fas fa-redo-alt"></i>
      </button>
    </header>
  );
};

export default Header;
