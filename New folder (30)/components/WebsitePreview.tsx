import React, { useState, useEffect, useRef } from 'react';
import type { WebsiteData } from '../types';
import { generateFullHtml } from '../services/codeGenerator';
import { ThemeEditorSidebar } from './ThemeEditorSidebar';
import { CodeModal } from './CodeModal';
import { HistoryModal } from './HistoryModal';
import { GitHubDeployModal } from './GitHubDeployModal';

interface WebsitePreviewProps {
  initialData: WebsiteData;
  onReset: () => void;
  onDataUpdate: (data: WebsiteData) => void;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ initialData, onReset, onDataUpdate }) => {
  const [data, setData] = useState<WebsiteData>(initialData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const html = generateFullHtml(data);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const doc = iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [data]);

  const handleThemeChange = (updatedTheme: WebsiteData['theme']) => {
    const newData = { ...data, theme: updatedTheme };
    setData(newData);
    onDataUpdate(newData);
  };
  
  const handleRestoreFromHistory = (historyData: WebsiteData) => {
      setData(historyData);
      onDataUpdate(historyData);
      setIsHistoryModalOpen(false);
  };

  return (
    <div>
      <div className="bg-white rounded-t-lg shadow-lg p-2 flex justify-between items-center border-b">
        <div className="flex gap-2">
            <button onClick={onReset} className="btn-secondary">New Project</button>
            <button onClick={() => setIsSidebarOpen(true)} className="btn-secondary">Edit Theme</button>
            <button onClick={() => setIsHistoryModalOpen(true)} className="btn-secondary">History</button>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsCodeModalOpen(true)} className="btn-secondary">View Code</button>
            <button onClick={() => setIsDeployModalOpen(true)} className="btn-primary">Deploy</button>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-150px)] bg-white shadow-lg rounded-b-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          title="Website Preview"
          className="w-full h-full border-0"
        />
      </div>

      {isSidebarOpen && <ThemeEditorSidebar data={data} onThemeChange={handleThemeChange} onClose={() => setIsSidebarOpen(false)} />}
      {isCodeModalOpen && <CodeModal data={data} onClose={() => setIsCodeModalOpen(false)} />}
      {isHistoryModalOpen && <HistoryModal onRestore={handleRestoreFromHistory} onClose={() => setIsHistoryModalOpen(false)} />}
      {isDeployModalOpen && <GitHubDeployModal onClose={() => setIsDeployModalOpen(false)} />}

      <style>{`
        .btn-primary { background-color: #36454F; color: white; padding: 8px 16px; border-radius: 99px; font-weight: 600; transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #4f626f; }
        .btn-secondary { background-color: #F0F4F8; color: #36454F; padding: 8px 16px; border-radius: 99px; font-weight: 600; transition: background-color 0.2s; }
        .btn-secondary:hover { background-color: #E0E7EF; }
      `}</style>
    </div>
  );
};
