import React from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
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


export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems: { id: View; label: string }[] = [
    { id: 'builder', label: 'Website Builder' },
    { id: 'logoDesigner', label: 'Logo Designer' },
    { id: 'imageGenerator', label: 'Image Gen' },
    { id: 'imageEditor', label: 'Image Edit' },
    { id: 'imageAnalyzer', label: 'Homework Helper' },
    { id: 'chat', label: 'Chat' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-brand-charcoal/10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div onClick={() => onViewChange('builder')}>
            <AjStudiozLogo />
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-brand-cream p-1 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                currentView === item.id
                  ? 'bg-brand-coral text-white shadow-md'
                  : 'text-brand-charcoal/70 hover:bg-brand-peach/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* Mobile menu could be added here */}
      </nav>
    </header>
  );
};