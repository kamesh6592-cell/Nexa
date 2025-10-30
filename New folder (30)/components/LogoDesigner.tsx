import React, { useState, useCallback } from 'react';
import { generateLogoIdeas } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import type { LogoConcept } from '../types';

type Stage = 'form' | 'generating' | 'results';

export const LogoDesigner: React.FC = () => {
  const [stage, setStage] = useState<Stage>('form');
  const [formData, setFormData] = useState({ name: '', description: '', style: 'Minimalist', color: '' });
  const [logoConcepts, setLogoConcepts] = useState<LogoConcept[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onIdeasReady = useCallback((ideas: LogoConcept[]) => {
    setLogoConcepts(ideas.map(idea => ({ ...idea, imageUrl: undefined })));
  }, []);

  const onImageReady = useCallback((index: number, imageUrl: string) => {
    setLogoConcepts(prev => prev.map((concept, i) => i === index ? { ...concept, imageUrl } : concept));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStage('generating');
    setError(null);
    setLogoConcepts([]);
    try {
      // This will call onIdeasReady first, then onImageReady for each
      await generateLogoIdeas(formData, onIdeasReady, onImageReady);
      setStage('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate logo ideas.');
      setStage('form');
    }
  }, [formData, onIdeasReady, onImageReady]);
  
  const conceptsToDisplay = stage === 'generating' && logoConcepts.length > 0 ? logoConcepts : (stage === 'results' ? logoConcepts : []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal">AI Logo Designer</h2>
        <p className="mt-4 text-lg text-brand-charcoal/70">Create a unique logo for your brand in seconds.</p>
      </div>

      {stage === 'form' && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border space-y-4">
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Company Name" className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral" required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="What does your company do?" className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral" rows={3} required />
          <select name="style" value={formData.style} onChange={handleInputChange} className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral">
            <option>Minimalist</option>
            <option>Geometric</option>
            <option>Abstract</option>
            <option>Vintage</option>
          </select>
          <input name="color" value={formData.color} onChange={handleInputChange} placeholder="Primary Color (e.g., blue, #FF5733)" className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral" />
          <button type="submit" className="w-full bg-brand-coral hover:bg-opacity-90 disabled:bg-gray-400 text-white font-bold py-3 rounded-full transition-all">Generate Concepts</button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      )}

      {(stage === 'generating' || stage === 'results') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conceptsToDisplay.map((concept, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-lg border">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {concept.imageUrl ? (
                  <img src={concept.imageUrl} alt={concept.description} className="object-contain max-h-full" />
                ) : (
                  <LoadingSpinner />
                )}
              </div>
              <p className="text-sm text-brand-charcoal/80">{concept.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
