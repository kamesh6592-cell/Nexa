import React, { useState, useEffect } from 'react';
import type { WebsiteData } from '../types';
import { generateFullHtml } from '../services/codeGenerator';

interface CodeModalProps {
  data: WebsiteData;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ data, onClose }) => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    setGeneratedCode(generateFullHtml(data));
  }, [data]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-brand-cream dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-[popIn_0.3s_ease-out_forwards]" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-brand-charcoal/10 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-brand-charcoal dark:text-brand-cream">Generated Website Code</h3>
          <div className="flex items-center gap-2">
            <button 
                onClick={handleCopy}
                className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-brand-sky text-brand-charcoal dark:text-white font-semibold py-2 px-4 rounded-full text-sm transition-all shadow-sm flex items-center gap-2"
            >
                {copyStatus === 'copied' ? (
                     <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Copied!</>
                ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" /></svg> Copy</>
                )}
            </button>
             <button 
                onClick={handleDownload}
                className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-brand-sky text-brand-charcoal dark:text-white font-semibold py-2 px-4 rounded-full text-sm transition-all shadow-sm flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                Download
            </button>
             <div className="relative has-tooltip">
                <button 
                    disabled
                    className="bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded-full text-sm transition-all shadow-sm flex items-center gap-2 cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    Push to GitHub
                </button>
                 <div className="tooltip absolute bottom-full mb-2 right-0 w-48 bg-brand-charcoal text-white text-xs rounded-lg p-2 shadow-lg z-10">
                    Direct GitHub integration is coming soon!
                 </div>
            </div>

            <button onClick={onClose} className="text-brand-charcoal/50 dark:text-brand-cream/50 hover:text-brand-coral p-2 rounded-full">&times;</button>
          </div>
        </header>
        <main className="flex-grow p-2 overflow-hidden">
          <pre className="bg-brand-charcoal text-white h-full w-full overflow-auto rounded-xl p-4 text-sm font-mono whitespace-pre-wrap break-all">
            <code>{generatedCode}</code>
          </pre>
        </main>
      </div>
    </div>
  );
};