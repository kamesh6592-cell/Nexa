import React, { useState, useEffect } from 'react';
import type { HistorySnapshot, WebsiteData } from '../types';
import { getHistory, clearHistory } from '../services/historyManager';

interface HistoryModalProps {
  onClose: () => void;
  onRestore: (data: WebsiteData) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose, onRestore }) => {
  const [history, setHistory] = useState<HistorySnapshot[]>([]);

  useEffect(() => {
    // Load history and reverse it so the latest is at the top
    setHistory(getHistory().reverse());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="fixed inset-0 bg-brand-charcoal/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <style>{`
            @keyframes popIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `}</style>
      <div 
        className="bg-brand-cream rounded-3xl shadow-2xl w-full max-w-md h-[70vh] flex flex-col animate-[popIn_0.3s_ease-out_forwards]" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-brand-charcoal/10 flex-shrink-0">
          <h3 className="text-xl font-bold text-brand-charcoal flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Version History
          </h3>
          <button onClick={onClose} className="text-brand-charcoal/50 hover:text-brand-coral p-2 rounded-full text-2xl leading-none">&times;</button>
        </header>

        <main className="flex-grow p-4 overflow-y-auto">
          {history.length > 0 ? (
            <ul className="space-y-3">
              {history.map((snapshot) => (
                <li key={snapshot.timestamp} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-charcoal">
                      {new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <p className="text-xs text-brand-charcoal/60">
                      {new Date(snapshot.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => onRestore(snapshot.data)}
                    className="bg-brand-sky hover:bg-brand-peach text-brand-charcoal/80 font-semibold py-1.5 px-4 rounded-full text-sm transition-all"
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center h-full flex flex-col items-center justify-center text-brand-charcoal/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-semibold">No history yet!</p>
                <p className="text-sm">Start editing your site to save versions.</p>
            </div>
          )}
        </main>

        {history.length > 0 && (
            <footer className="p-4 border-t border-brand-charcoal/10 flex-shrink-0">
                <button
                    onClick={handleClear}
                    className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 rounded-full text-sm transition-colors"
                >
                    Clear History
                </button>
            </footer>
        )}
      </div>
    </div>
  );
};