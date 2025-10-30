import React from 'react';

export const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-brand-cream flex flex-col items-center justify-center z-[100]">
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes popIn { 
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
                .animate-popIn { animation: popIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; animation-delay: 0.2s; }
            `}</style>
             <div className="flex items-center gap-4 animate-popIn opacity-0">
                <svg
                    className="w-16 h-16 text-brand-coral"
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
                <span className="text-5xl font-extrabold tracking-tighter text-brand-charcoal">
                    AJ STUDIOZ
                </span>
            </div>
            <p className="mt-4 text-brand-charcoal/70 animate-fadeIn opacity-0" style={{animationDelay: '0.8s'}}>
                Your AI-Powered Creative Suite
            </p>
        </div>
    );
};
