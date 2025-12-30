import React, { useState, useEffect } from 'react';
import { DesignOption } from '../types';
import { uploadImageToGitHub } from '../services/githubService';

interface GitHubUploadModalProps {
  design: DesignOption;
  onClose: () => void;
  onSuccess: () => void;
}

const GitHubUploadModal: React.FC<GitHubUploadModalProps> = ({ design, onClose, onSuccess }) => {
  const [token, setToken] = useState(sessionStorage.getItem('gh_token') || '');
  const [repo, setRepo] = useState(sessionStorage.getItem('gh_repo') || '');
  const [path, setPath] = useState(`designs/${design.style.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    sessionStorage.setItem('gh_token', token);
    sessionStorage.setItem('gh_repo', repo);

    try {
      await uploadImageToGitHub({
        token,
        repo,
        path,
        message: `Add interior design: ${design.style}`,
        content: design.imageUrl
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to upload. Check your token and repo path.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fab fa-github"></i>
            Upload to GitHub
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Personal Access Token</label>
            <input
              type="password"
              required
              placeholder="ghp_xxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Repository (owner/repo)</label>
            <input
              type="text"
              required
              placeholder="username/interior-designs"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">File Path</label>
            <input
              type="text"
              required
              placeholder="folder/image.png"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i>
                  Confirm Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GitHubUploadModal;
