import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageBase64 = await generateImage(prompt);
      setGeneratedImage(`data:image/png;base64,${imageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the image.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal">AI Image Generator</h2>
        <p className="mt-4 text-lg text-brand-charcoal/70">Turn your imagination into images.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral"
          placeholder="e.g., 'A photo of an astronaut riding a horse on Mars'"
        />
        <button onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className="w-full bg-brand-coral hover:bg-opacity-90 disabled:bg-gray-400 text-white font-bold py-3 rounded-full transition-all">
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      <div className="mt-8">
        {isLoading && <div className="flex justify-center"><LoadingSpinner /></div>}
        {error && <p className="text-red-500 p-4 text-center">{error}</p>}
        {generatedImage && !isLoading && (
          <div className="bg-white p-4 rounded-3xl shadow-lg border">
            <img src={generatedImage} alt={prompt} className="rounded-2xl mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};
