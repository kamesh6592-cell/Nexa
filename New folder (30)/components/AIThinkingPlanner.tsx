import React from 'react';
import type { Plan } from '../types';

interface AIThinkingPlannerProps {
    isLoadingPlan: boolean;
    plan: Plan | null;
    onExecutePlan: () => void;
}

const ThinkingAnimation: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-brand-coral/20 rounded-full animate-ping"></div>
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center shadow-inner">
                 <svg className="w-12 h-12 text-brand-coral" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 14C5.97505 14.5 7.52595 15.5 8.5 16.5C9.47405 17.5 10.5 19 12 19C13.5 19 14.5259 17.5 15.5 16.5C16.4741 15.5 18.025 14.5 19.5 14M17 9H16M8 9H7M16.5 12C16.5 12.8284 15.8284 13.5 15 13.5C14.1716 13.5 13.5 12.8284 13.5 12C13.5 11.1716 14.1716 10.5 15 10.5C15.8284 10.5 16.5 11.1716 16.5 12ZM10.5 12C10.5 12.8284 9.82843 13.5 9 13.5C8.17157 13.5 7.5 12.8284 7.5 12C7.5 11.1716 8.17157 10.5 9 10.5C9.82843 10.5 10.5 11.1716 10.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.1364 3 16.108 3.73328 17.6533 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-brand-charcoal/80">
            Okay, let me think...
        </p>
        <p className="text-brand-charcoal/60">I'm reviewing your request and forming a plan!</p>
    </div>
);


export const AIThinkingPlanner: React.FC<AIThinkingPlannerProps> = ({ isLoadingPlan, plan, onExecutePlan }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                 @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg shadow-brand-peach/50 border border-brand-charcoal/5 animate-[popIn_0.5s_ease-out_forwards]">
                {isLoadingPlan && <ThinkingAnimation />}

                {plan && (
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                             <svg className="w-16 h-16 text-brand-coral" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 14C5.97505 14.5 7.52595 15.5 8.5 16.5C9.47405 17.5 10.5 19 12 19C13.5 19 14.5259 17.5 15.5 16.5C16.4741 15.5 18.025 14.5 19.5 14M17 9H16M8 9H7M16.5 12C16.5 12.8284 15.8284 13.5 15 13.5C14.1716 13.5 13.5 12.8284 13.5 12C13.5 11.1716 14.1716 10.5 15 10.5C15.8284 10.5 16.5 11.1716 16.5 12ZM10.5 12C10.5 12.8284 9.82843 13.5 9 13.5C8.17157 13.5 7.5 12.8284 7.5 12C7.5 11.1716 8.17157 10.5 9 10.5C9.82843 10.5 10.5 11.1716 10.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.1364 3 16.108 3.73328 17.6533 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-brand-charcoal">Here's My Plan!</h2>
                        <p className="mt-2 text-brand-charcoal/70">I've reviewed your vision. Here's how I'll bring it to life:</p>
                        
                        <ul className="text-left space-y-3 my-8">
                            {plan.map((step, index) => (
                                <li key={index} className="flex items-start gap-3 p-3 bg-brand-sky/50 rounded-lg animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${index * 150}ms`}}>
                                    <div className="w-6 h-6 rounded-full bg-brand-peach text-brand-coral flex items-center justify-center font-bold flex-shrink-0 mt-1">
                                        {index + 1}
                                    </div>
                                    <span className="text-brand-charcoal/90">{step}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={onExecutePlan}
                            className="w-full bg-brand-coral hover:bg-opacity-90 text-white font-bold py-4 px-8 rounded-full transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-coral/50 text-lg shadow-lg shadow-brand-coral/40"
                        >
                            ✨ Let's Build It! ✨
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
