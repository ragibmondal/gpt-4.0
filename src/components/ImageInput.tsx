import React, { useState } from 'react';

interface ImageInputProps {
  onSubmit: (url: string) => void;
  onCancel: () => void;
  type: 'generate' | 'analyze';
}

export function ImageInput({ onSubmit, onCancel, type }: ImageInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="max-w-3xl mx-auto">
        <input
          type={type === 'analyze' ? 'url' : 'text'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={type === 'analyze' ? 'Enter image URL to analyze...' : 'Describe the image you want to generate...'}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {type === 'analyze' ? 'Analyze' : 'Generate'}
          </button>
        </div>
      </div>
    </form>
  );
}