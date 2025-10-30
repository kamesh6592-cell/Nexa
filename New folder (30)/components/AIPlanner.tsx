import React, { useState, useEffect } from 'react';

// --- Lovable Animated Icons ---

const IdeaIcon: React.FC = () => (
  <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18.9999C9 20.6567 10.3431 21.9999 12 21.9999C13.6569 21.9999 15 20.6567 15 18.9999H9Z" fill="currentColor" opacity="0.4"/>
    <path d="M12 2C8.68629 2 6 4.68629 6 8.00001C6 10.8713 7.73333 12.6667 9 14.5001H15C16.2667 12.6667 18 10.8713 18 8.00001C18 4.68629 15.3137 2 12 2Z" fill="currentColor"/>
    <g className="animate-[pulse_2s_ease-in-out_infinite]">
      <path d="M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

const PaletteIcon: React.FC = () => (
    <svg className="w-8 h-8 text-pink-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" opacity="0.3"/>
    <circle cx="8" cy="10" r="2" fill="currentColor" className="animate-[bounce_1.5s_ease-in-out_infinite] [animation-delay:-0.2s]"/>
    <circle cx="12" cy="8" r="2" fill="currentColor" className="animate-[bounce_1.5s_ease-in-out_infinite]"/>
    <circle cx="16" cy="10" r="2" fill="currentColor" className="animate-[bounce_1.5s_ease-in-out_infinite] [animation-delay:-0.4s]"/>
    <path d="M16 15.2C15.1 16.2 13.6 17 12 17C10.4 17 8.9 16.2 8 15.2C8.8 14.5 9.8 14 11 14H13C14.2 14 15.2 14.5 16 15.2Z" fill="currentColor"/>
  </svg>
);

const WritingIcon: React.FC = () => (
    <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path className="animate-[pulse_2s_ease-out_infinite] [animation-delay:-0.5s]" d="M14 4L5.83333 15.5C5.06803 16.5647 5.51475 18.0677 6.68961 18.711L7.22853 19.0154C8.40339 19.6587 9.89721 19.2119 10.6625 18.1473L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 8L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LayoutIcon: React.FC = () => (
  <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" className="origin-center animate-[spin_4s_linear_infinite]"/>
    <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" opacity="0.6" className="origin-center animate-[spin_4s_linear_infinite] [animation-direction:reverse]"/>
    <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" opacity="0.6" className="origin-center animate-[spin_4s_linear_infinite] [animation-direction:reverse]"/>
    <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" className="origin-center animate-[spin_4s_linear_infinite]"/>
  </svg>
);

const SparkleIcon: React.FC = () => (
  <svg className="w-8 h-8 text-brand-coral" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className="animate-pulse" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>
    <path className="animate-pulse [animation-delay:-0.8s]" d="M3.5 3.5L4.5 6.5L7.5 7.5L4.5 8.5L3.5 11.5L2.5 8.5L-0.5 7.5L2.5 6.5L3.5 3.5Z" transform="translate(15, 2)" fill="currentColor" opacity="0.7"/>
    <path className="animate-pulse [animation-delay:-0.5s]" d="M3.5 3.5L4.5 6.5L7.5 7.5L4.5 8.5L3.5 11.5L2.5 8.5L-0.5 7.5L2.5 6.5L3.5 3.5Z" transform="translate(2, 14)" fill="currentColor" opacity="0.7"/>
  </svg>
);


// --- Status Indicators ---
const CheckIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path className="checkmark" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const PendingIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-brand-charcoal/10 border-4 border-white"></div>
);

const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'idea': return <IdeaIcon />;
        case 'palette': return <PaletteIcon />;
        case 'writing': return <WritingIcon />;
        case 'layout': return <LayoutIcon />;
        case 'sparkle': return <SparkleIcon />;
        default: return <SparkleIcon />;
    }
}

// --- Main Component ---
const planStepsPool = [
  // Ideas
  { text: 'Sketching out brilliant ideas...', icon: 'idea' },
  { text: 'Brewing a fresh pot of creativity...', icon: 'idea' },
  { text: 'Consulting the digital muses...', icon: 'idea' },
  { text: 'Catching inspiration from the clouds...', icon: 'idea' },
  // Palette
  { text: 'Choosing the most delightful colors...', icon: 'palette' },
  { text: 'Mixing a vibrant color cocktail...', icon: 'palette' },
  { text: 'Dipping brushes in digital paint...', icon: 'palette' },
  { text: 'Finding the perfect color harmony...', icon: 'palette' },
  // Writing
  { text: 'Weaving words into a captivating story...', icon: 'writing' },
  { text: 'Crafting pixel-perfect paragraphs...', icon: 'writing' },
  { text: 'Giving your brand a voice...', icon: 'writing' },
  { text: 'Polishing sentences to a high sheen...', icon: 'writing' },
  // Layout
  { text: 'Arranging content with loving care...', icon: 'layout' },
  { text: 'Building the digital architecture...', icon: 'layout' },
  { text: 'Playing with digital building blocks...', icon: 'layout' },
  { text: 'Drawing the blueprints for success...', icon: 'layout' },
  // Sparkle
  { text: 'Polishing every corner until it shines...', icon: 'sparkle' },
  { text: 'Adding a sprinkle of AI magic!', icon: 'sparkle' },
  { text: 'Preparing for the grand reveal...', icon: 'sparkle' },
  { text: 'Dotting the i\'s and crossing the t\'s...', icon: 'sparkle' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface AIPlannerProps {
    isComplete: boolean;
    onViewResult: () => void;
}


export const AIPlanner: React.FC<AIPlannerProps> = ({ isComplete, onViewResult }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [planSteps, setPlanSteps] = useState<{ text: string; icon: string; }[]>([]);
  const [cheer, setCheer] = useState('');
  const [sentCheers, setSentCheers] = useState<string[]>([]);
  
  // Create a unique, random plan on component mount
  useEffect(() => {
    const shuffledSteps = shuffleArray(planStepsPool);
    const uniqueSteps = Array.from(new Set(shuffledSteps.map(s => s.icon)))
        .map(icon => shuffledSteps.find(s => s.icon === icon)!);
    setPlanSteps(shuffleArray(uniqueSteps).slice(0, 5));
  }, []);

  useEffect(() => {
    if (planSteps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < planSteps.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [planSteps]);
  
  const animationDone = currentStep >= planSteps.length;
  const progress = planSteps.length > 0 ? (currentStep / planSteps.length) * 100 : 0;

  const handleCheerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cheer.trim()) {
        setSentCheers(prev => [...prev, cheer]);
        setCheer('');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
       <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
           @keyframes popIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pop-in-check {
            0% { transform: scale(0.7); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes text-pulse {
            50% { opacity: 0.7; }
          }
          .animate-text-pulse {
            animation: text-pulse 2s ease-in-out infinite;
          }
          .checkmark {
            stroke-dasharray: 24;
            stroke-dashoffset: 24;
            animation: draw-check 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
            animation-delay: 0.2s;
          }
          @keyframes draw-check {
            to { stroke-dashoffset: 0; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
          .shimmer-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmer 2.5s infinite;
          }
          .text-glow-completed {
            text-shadow: 0 0 12px rgba(16, 185, 129, 0.8); /* Brighter green glow */
          }
       `}</style>
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal leading-tight">
          Let's Get Creative!
        </h2>
        <p className="mt-4 text-lg text-brand-charcoal/70">
          Our AI is building your new website...
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg shadow-brand-peach/50 border border-brand-charcoal/5">
        <ul className="space-y-5">
          {planSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isInProgress = index === currentStep && !animationDone;

            return (
              <li key={index} className="flex items-center space-x-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${index * 150}ms`}}>
                <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
                  <div className={`absolute inset-0 transition-all duration-300 ease-in-out ${isInProgress || isCompleted ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                    <PendingIcon />
                  </div>
                  <div className={`absolute inset-0 transition-all duration-300 ease-in-out ${isInProgress ? 'opacity-100 scale-110' : 'opacity-0 scale-75'}`}>
                    {getIcon(step.icon)}
                  </div>
                  <div className={`absolute inset-0 ${isCompleted ? 'animate-[pop-in-check_0.6s_cubic-bezier(0.68,-0.55,0.27,1.55)_forwards]' : 'opacity-0'}`}>
                    <CheckIcon />
                  </div>
                </div>
                <p className={`text-lg font-medium transition-all duration-300 ${isCompleted ? 'text-brand-charcoal/50 line-through text-glow-completed' : 'text-brand-charcoal/80'} ${isInProgress ? 'text-brand-coral animate-text-pulse' : ''}`}>
                  {step.text}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 h-3 w-full bg-brand-peach/50 rounded-full overflow-hidden relative">
            <div 
                className="h-full bg-gradient-to-r from-brand-peach to-brand-coral rounded-full transition-all duration-1000 ease-out shimmer-bar" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        
        <div className="mt-8 border-t border-brand-charcoal/10 pt-6 min-h-[140px] flex items-center justify-center">
            {animationDone && isComplete ? (
                <div className="text-center animate-[fadeIn_0.5s_ease-out_forwards]">
                    <h3 className="text-2xl font-bold text-brand-coral">Creation Complete!</h3>
                    <p className="text-brand-charcoal/70 mt-2 mb-6">Your new website has been crafted. Are you ready to see it?</p>
                    <button
                        onClick={onViewResult}
                        className="bg-brand-coral hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-coral/50 text-lg shadow-lg shadow-brand-coral/40"
                    >
                        ✨ Unveil Your Creation! ✨
                    </button>
                </div>
            ) : !animationDone ? (
                <div>
                    <p className="text-center font-semibold text-brand-charcoal/70 mb-4">Give the AI some encouragement!</p>
                    <form onSubmit={handleCheerSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={cheer}
                            onChange={(e) => setCheer(e.target.value)}
                            placeholder="You can do it!"
                            className="flex-grow w-full bg-brand-cream border-2 border-transparent rounded-full px-4 py-2 focus:ring-2 focus:ring-brand-coral focus:border-brand-coral transition-all duration-300 placeholder:text-brand-charcoal/40 text-md"
                        />
                        <button 
                            type="submit"
                            className="bg-brand-coral text-white p-2.5 rounded-full transition-transform duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-coral/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </form>
                    {sentCheers.length > 0 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {sentCheers.map((c, i) => (
                                <span key={i} className="bg-brand-sky text-brand-charcoal/80 text-sm font-medium px-3 py-1 rounded-full animate-[popIn_0.3s_ease-out_forwards]">
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
      </div>
    </div>
  );
};