import React, { useState, useCallback, useEffect } from 'react';
import type { View, PromptState, WebsiteData, Plan } from './types';
import { Header } from './components/Header';
import { BuilderForm } from './components/BuilderForm';
import { AIThinkingPlanner } from './components/AIThinkingPlanner';
import { AIPlanner } from './components/AIPlanner';
import { WebsitePreview } from './components/WebsitePreview';
import { ImageEditor } from './components/ImageEditor';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { ChatBot } from './components/ChatBot';
import { LogoDesigner } from './components/LogoDesigner';
import { SplashScreen } from './components/SplashScreen';
import { generateWebsitePlan, generateWebsiteContent } from './services/geminiService';
import { saveSnapshot } from './services/historyManager';

type BuilderStage = 'form' | 'planning' | 'generating' | 'preview';

const App: React.FC = () => {
  const [view, setView] = useState<View>('builder');
  const [showSplash, setShowSplash] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Website builder state
  const [builderStage, setBuilderStage] = useState<BuilderStage>('form');
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setThemeMode('dark');
    } else {
      setThemeMode('light');
    }
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('themeMode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('themeMode', 'light');
    }
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleFormSubmit = useCallback(async (formData: PromptState) => {
    setBuilderStage('planning');
    setIsLoading(true);
    setError(null);
    setPlan(null);
    setWebsiteData(null);
    setPromptState(formData);

    try {
      const generatedPlan = await generateWebsitePlan(formData);
      setPlan(generatedPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during planning.');
      setBuilderStage('form'); // Go back to form on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExecutePlan = useCallback(async () => {
    if (!promptState) return;
    setBuilderStage('generating');
    setIsLoading(true);
    setError(null);

    try {
      const generatedData = await generateWebsiteContent(promptState);
      setWebsiteData(generatedData);
      saveSnapshot(generatedData); // Save initial version to history
      setBuilderStage('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during content generation.');
      setBuilderStage('form'); // Go back to form on error
    } finally {
      setIsLoading(false);
    }
  }, [promptState]);

  const handleResetBuilder = () => {
    setBuilderStage('form');
    setPromptState(null);
    setPlan(null);
    setWebsiteData(null);
    setIsLoading(false);
    setError(null);
  };
  
  const handleWebsiteDataUpdate = (newData: WebsiteData) => {
      setWebsiteData(newData);
      saveSnapshot(newData);
  };

  const renderView = () => {
    switch (view) {
      case 'builder':
        switch (builderStage) {
          case 'form':
            return <BuilderForm onFormSubmit={handleFormSubmit} isLoading={isLoading} error={error} />;
          case 'planning':
            return <AIThinkingPlanner isLoadingPlan={isLoading} plan={plan} onExecutePlan={handleExecutePlan} />;
          case 'generating':
            return <AIPlanner isComplete={!!websiteData} onViewResult={() => setBuilderStage('preview')} />;
          case 'preview':
            return websiteData ? <WebsitePreview initialData={websiteData} onReset={handleResetBuilder} onDataUpdate={handleWebsiteDataUpdate}/> : <div>Loading preview...</div>;
        }
      case 'imageEditor':
        return <ImageEditor />;
      case 'imageGenerator':
        return <ImageGenerator />;
      case 'imageAnalyzer':
        return <ImageAnalyzer />;
      case 'chat':
        return <ChatBot />;
      case 'logoDesigner':
        return <LogoDesigner />;
      default:
        return <div>Unknown view</div>;
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="bg-brand-cream dark:bg-brand-charcoal min-h-screen font-sans text-brand-charcoal dark:text-brand-cream transition-colors duration-300">
      <Header
        currentView={view}
        onViewChange={setView}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;