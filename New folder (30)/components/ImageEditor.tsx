import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (originalImage) {
        URL.revokeObjectURL(originalImage.previewUrl);
      }
      setEditedImage(null);
      setError(null);
      const base64 = await blobToBase64(file);
      setOriginalImage({ file, previewUrl: URL.createObjectURL(file), base64 });
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImage || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const newImageBase64 = await editImage(originalImage.base64, originalImage.file.type, prompt);
      setEditedImage(`data:image/png;base64,${newImageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while editing the image.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal">AI Image Editor</h2>
        <p className="mt-4 text-lg text-brand-charcoal/70">Describe the changes you want to see.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-6 rounded-3xl shadow-lg border space-y-4">
          <label className="block text-md font-semibold text-brand-charcoal mb-2">
            1. Upload an Image
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="file-input file-input-bordered w-full" />

          {originalImage && (
            <>
              <label className="block text-md font-semibold text-brand-charcoal mb-2">
                2. Describe your edit
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral"
                placeholder="e.g., 'add a birthday hat on the cat' or 'make the sky look like a sunset'"
              />
              <button onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className="w-full bg-brand-coral hover:bg-opacity-90 disabled:bg-gray-400 text-white font-bold py-3 rounded-full transition-all">
                {isLoading ? 'Editing...' : 'Apply Edit'}
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-center font-semibold mb-2">Original</h3>
            <div className="aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
              {originalImage ? <img src={originalImage.previewUrl} alt="Original" className="rounded-2xl object-contain max-h-full" /> : <p>Upload an image</p>}
            </div>
          </div>
          <div>
            <h3 className="text-center font-semibold mb-2">Edited</h3>
            <div className="aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
              {isLoading && <LoadingSpinner />}
              {error && <p className="text-red-500 p-4">{error}</p>}
              {editedImage && !isLoading && <img src={editedImage} alt="Edited" className="rounded-2xl object-contain max-h-full" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
