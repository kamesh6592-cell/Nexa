import React, { useState, useEffect } from 'react';
import type { WebsiteData } from '../types';

interface ThemeEditorSidebarProps {
  data: WebsiteData;
  onThemeChange: (theme: WebsiteData['theme']) => void;
  onClose: () => void;
}

export const ThemeEditorSidebar: React.FC<ThemeEditorSidebarProps> = ({ data, onThemeChange, onClose }) => {
  const [theme, setTheme] = useState(data.theme);

  useEffect(() => {
    setTheme(data.theme);
  }, [data.theme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTheme = { ...theme, [name]: value };
    setTheme(newTheme);
    onThemeChange(newTheme); // Update live
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose}>
      <aside
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl p-6 transform transition-transform translate-x-0 animate-[slideIn_0.3s_ease-out_forwards]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Theme Editor</h3>
            <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Primary Color</label>
            <input type="color" name="primary" value={theme.primary} onChange={handleChange} className="w-full h-10" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Secondary Color</label>
            <input type="color" name="secondary" value={theme.secondary} onChange={handleChange} className="w-full h-10" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Accent Color</label>
            <input type="color" name="accent" value={theme.accent} onChange={handleChange} className="w-full h-10" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Neutral Color</label>
            <input type="color" name="neutral" value={theme.neutral} onChange={handleChange} className="w-full h-10" />
          </div>
           <div>
            <label className="block font-semibold mb-1">Base Color</label>
            <input type="color" name="base" value={theme.base} onChange={handleChange} className="w-full h-10" />
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-brand-charcoal text-white font-bold py-3 rounded-full transition-all mt-8">Done</button>
      </aside>
       <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
    </div>
  );
};
