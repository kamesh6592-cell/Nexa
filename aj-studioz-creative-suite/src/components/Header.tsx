import React from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AjStudiozLogo: React.FC = () => (
    <div className="flex items-center gap-2 cursor-pointer">
        <svg
            className="w-8 h-8 text-brand-coral"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span className="text-xl font-bold tracking-tighter">
            AJ STUDIOZ
        </span>
    </div>
);


export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, themeMode, onToggleTheme }) => {
  const navItems: { id: View; label: string }[] = [
    { id: 'builder', label: 'Website Builder' },
    { id: 'logoDesigner', label: 'Logo Designer' },
    { id: 'imageGenerator', label: 'Image Gen' },
    { id: 'imageEditor', label: 'Image Edit' },
    { id: 'imageAnalyzer', label: 'Homework Helper' },
    { id: 'chat', label: 'Chat' },
  ];

  return (
    <header className="bg-white/80 dark:bg-brand-charcoal/80 backdrop-blur-lg sticky top-0 z-50 border-b border-brand-charcoal/10 dark:border-brand-cream/10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div onClick={() => onViewChange('builder')}>
            <AjStudiozLogo />
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-brand-cream dark:bg-gray-700 p-1 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                currentView === item.id
                  ? 'bg-brand-coral text-white shadow-md'
                  : 'text-brand-charcoal/70 dark:text-brand-cream/70 hover:bg-brand-peach/50 dark:hover:bg-gray-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-brand-cream dark:bg-gray-700 hover:bg-brand-peach/50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {themeMode === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </nav>
    </header>
  );
};