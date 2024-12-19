import React from 'react';
import { ImageIcon, Eye } from 'lucide-react';

interface CommandMenuProps {
  onImageGenerate: () => void;
  onImageAnalyze: () => void;
}

export function CommandMenu({ onImageGenerate, onImageAnalyze }: CommandMenuProps) {
  return (
    <div className="flex gap-2 px-4 py-2 border-t bg-white">
      <button
        onClick={onImageGenerate}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100"
      >
        <ImageIcon className="w-4 h-4" />
        Generate Image
      </button>
      <button
        onClick={onImageAnalyze}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100"
      >
        <Eye className="w-4 h-4" />
        Analyze Image
      </button>
    </div>
  );
}