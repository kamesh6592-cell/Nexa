import React, { useState } from 'react';
import type { PromptState, UploadedFile, AdvancedOptions } from '../types';

interface BuilderFormProps {
  onFormSubmit: (formData: PromptState) => void;
  isLoading: boolean;
  error: string | null;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read blob as base64 string'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const BuilderForm: React.FC<BuilderFormProps> = ({ onFormSubmit, isLoading, error }) => {
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    customCss: '',
    themeOverrides: { primary: '', secondary: '', accent: '' },
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newUploadedFiles: UploadedFile[] = await Promise.all(
        // FIX: Explicitly type `file` as `File` to avoid it being inferred as `unknown`.
        files.map(async (file: File) => ({
          name: file.name,
          type: file.type,
          base64Data: await blobToBase64(file),
        }))
      );
      setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert('Please describe the website you want to build.');
      return;
    }
    onFormSubmit({ prompt, uploadedFiles, advancedOptions });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal leading-tight">
          Describe Your Dream Website
        </h1>
        <p className="mt-4 text-lg text-brand-charcoal/70">
          Tell our AI what you envision, and we'll bring it to life in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg shadow-brand-peach/50 border border-brand-charcoal/5 space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-lg font-semibold text-brand-charcoal mb-2">
            What is your website about?
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral"
            placeholder="e.g., A cozy coffee shop in Seattle that specializes in artisanal, single-origin beans. I want a modern and minimalist design..."
          />
        </div>

        <div>
            <label className="block text-lg font-semibold text-brand-charcoal mb-2">
                Upload Content (Optional)
            </label>
            <p className="text-sm text-brand-charcoal/60 mb-3">Upload images, logos, or text documents (like a business plan) for the AI to use.</p>
            <div className="flex items-center space-x-4">
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-brand-sky hover:bg-opacity-80 text-brand-charcoal font-bold py-2 px-5 rounded-full transition-colors inline-block"
                >
                    Choose Files
                </label>
                 <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
             {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    {uploadedFiles.map(file => (
                        <div key={file.name} className="flex items-center justify-between bg-brand-sky/50 p-2 rounded-lg text-sm">
                            <span className="truncate">{file.name}</span>
                            <button type="button" onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 font-bold ml-2">
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <div>
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm font-semibold text-brand-coral">
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
        </div>

        {showAdvanced && (
            <div className="space-y-4 border-t border-brand-charcoal/10 pt-4">
                 {/* ... Advanced options form fields ... */}
            </div>
        )}


        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-coral hover:bg-opacity-90 disabled:bg-gray-400 text-white font-bold py-4 px-4 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-coral/50 text-lg shadow-lg shadow-brand-coral/40"
        >
          {isLoading ? 'Building...' : '✨ Generate My Website ✨'}
        </button>

        {error && (
            <div className="mt-4 text-center p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
            </div>
        )}
      </form>
    </div>
  );
};