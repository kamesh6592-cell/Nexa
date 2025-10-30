import React, { useState, useEffect } from 'react';

type Step = 'connect' | 'success';

const Command: React.FC<{
    commandId: string;
    text: string;
    copyStatus: 'idle' | 'copied';
    onCopy: () => void;
}> = ({ text, copyStatus, onCopy }) => {
    return (
        <div className="flex items-center justify-between group">
            <span className="text-gray-300"><span className="text-green-400">$</span> {text}</span>
            <button
                onClick={onCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-600 hover:bg-gray-500 text-white text-[10px] font-sans font-bold py-1 px-2 rounded"
            >
                {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};


export const GitHubDeployModal: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const [step, setStep] = useState<Step>('connect');
    const [repoName, setRepoName] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [copyStatus, setCopyStatus] = useState<Record<string, 'idle' | 'copied'>>({});

    // This effect simulates the feeling of "connecting" before showing the guide.
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isConnecting) {
            timer = setTimeout(() => {
                 setStep('success');
            }, 1500);
        }
        return () => clearTimeout(timer);
    }, [isConnecting]);
    
    const handleCopyCommand = (commandId: string, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus(prev => ({ ...prev, [commandId]: 'idle', [commandId]: 'copied' }));
            setTimeout(() => setCopyStatus(prev => ({ ...prev, [commandId]: 'idle' })), 2000);
        });
    };

    const handleConnect = () => {
        if (repoName.trim()) {
            setIsConnecting(true);
        }
    };

    const renderContent = () => {
        switch (step) {
            case 'connect':
                return (
                    <>
                        <h3 className="text-2xl font-bold text-brand-charcoal dark:text-brand-cream">Guided Deployment</h3>
                        <p className="text-brand-charcoal/70 dark:text-brand-cream/70 mt-2">Let's get your new website on the web! This guide will walk you through deploying with GitHub.</p>
                        <p className="text-brand-charcoal/70 dark:text-brand-cream/70 mt-2">First, what would you like to name your repository?</p>
                        
                        <div className="mt-6 space-y-4">
                            <input
                                type="text"
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder="my-awesome-website"
                                className="w-full bg-brand-cream dark:bg-gray-700 dark:text-white border-2 border-brand-charcoal/10 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-brand-coral"
                            />
                            <button
                                onClick={handleConnect}
                                disabled={!repoName.trim() || isConnecting}
                                className="w-full bg-brand-charcoal hover:bg-opacity-90 disabled:bg-gray-400 text-white font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2"
                            >
                                {isConnecting ? (
                                    <>
                                     <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                     Preparing Your Guide...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
                                        Start Deployment Guide
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                );
            case 'success':
                 const gitCommands = {
                    init: 'git init',
                    cname: customDomain ? `echo "${customDomain}" > CNAME` : '',
                    add: `git add .`,
                    commit: 'git commit -m "Initial commit from AJ STUDIOZ"',
                    branch: 'git branch -M main',
                    remote: `git remote add origin https://github.com/YOUR_USERNAME/${repoName}.git`,
                    push: 'git push -u origin main'
                };
                 return (
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-[popIn_0.3s_ease-out_forwards]">
                           <svg className="w-16 h-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-3xl font-bold text-brand-charcoal dark:text-brand-cream mt-6">Ready for Launch!</h3>
                        <p className="text-brand-charcoal/70 dark:text-brand-cream/70 mt-2">
                            Here's your step-by-step guide to deploying your new website for free using GitHub Pages.
                        </p>
                        
                        <div className="text-left mt-6 space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                             {/* Step 1 */}
                            <div className="bg-brand-sky/50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <h4 className="font-bold text-brand-charcoal dark:text-brand-cream">Step 1: Create a GitHub Repository</h4>
                                <p className="text-sm text-brand-charcoal/80 dark:text-brand-cream/80 mt-1">Go to GitHub and create a new public repository named <b className="font-semibold">{repoName}</b>. Don't initialize it with a README.</p>
                                <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-coral hover:underline">
                                    Create Repository Now &rarr;
                                </a>
                            </div>

                             {/* Step 2 */}
                            <div className="bg-brand-sky/50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <h4 className="font-bold text-brand-charcoal dark:text-brand-cream">Step 2: Upload Your Code</h4>
                                <p className="text-sm text-brand-charcoal/80 dark:text-brand-cream/80 mt-1">
                                    Make sure you've downloaded your <b className="font-semibold">index.html</b> file from the main editor. Open a terminal/command prompt in the folder where you saved it, and run these commands one-by-one.
                                </p>
                                <div className="mt-2 space-y-2 font-mono text-xs bg-brand-charcoal text-white p-3 rounded-md">
                                    <Command commandId="init" text={gitCommands.init} copyStatus={copyStatus.init || 'idle'} onCopy={() => handleCopyCommand('init', gitCommands.init)} />
                                    {customDomain && <Command commandId="cname" text={gitCommands.cname} copyStatus={copyStatus.cname || 'idle'} onCopy={() => handleCopyCommand('cname', gitCommands.cname)} />}
                                    <Command commandId="add" text={gitCommands.add} copyStatus={copyStatus.add || 'idle'} onCopy={() => handleCopyCommand('add', gitCommands.add)} />
                                    <Command commandId="commit" text={gitCommands.commit} copyStatus={copyStatus.commit || 'idle'} onCopy={() => handleCopyCommand('commit', gitCommands.commit)} />
                                    <Command commandId="branch" text={gitCommands.branch} copyStatus={copyStatus.branch || 'idle'} onCopy={() => handleCopyCommand('branch', gitCommands.branch)} />
                                    <Command commandId="remote" text={gitCommands.remote} copyStatus={copyStatus.remote || 'idle'} onCopy={() => handleCopyCommand('remote', gitCommands.remote)} />
                                    <Command commandId="push" text={gitCommands.push} copyStatus={copyStatus.push || 'idle'} onCopy={() => handleCopyCommand('push', gitCommands.push)} />
                                </div>
                                <p className="text-xs text-brand-charcoal/60 dark:text-brand-cream/60 mt-2">Remember to replace `YOUR_USERNAME` in the 'remote' command!</p>
                            </div>

                             {/* Step 3 */}
                             <div className="bg-brand-sky/50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <h4 className="font-bold text-brand-charcoal dark:text-brand-cream">Step 3: Enable GitHub Pages</h4>
                                <p className="text-sm text-brand-charcoal/80 dark:text-brand-cream/80 mt-1">In your new repository's settings, go to the "Pages" section. Under "Build and deployment", select the <b className="font-semibold">main</b> branch as your source and click "Save". Your site will be live in a few minutes!</p>
                            </div>
                            
                             {/* Step 4 */}
                             <div className="bg-brand-sky/50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <h4 className="font-bold text-brand-charcoal dark:text-brand-cream">Step 4: Custom Domain (Optional)</h4>
                                 <p className="text-sm text-brand-charcoal/80 dark:text-brand-cream/80 mt-1 mb-2">
                                     To use your own domain, first enter it here:
                                 </p>
                                <input
                                    type="text"
                                    value={customDomain}
                                    onChange={(e) => setCustomDomain(e.target.value)}
                                    placeholder="www.your-awesome-domain.com"
                                    className="w-full bg-brand-cream dark:bg-gray-600 dark:text-white border-2 border-brand-charcoal/10 dark:border-gray-500 rounded-lg p-2 text-sm focus:ring-1 focus:ring-brand-coral"
                                />
                                {customDomain && (
                                    <div className="mt-2 text-sm text-brand-charcoal/80 dark:text-brand-cream/80 space-y-2">
                                        <p>
                                            <b className="font-semibold">A. In Your GitHub Repo:</b> Create a file named <code className="text-xs bg-brand-peach/50 p-1 rounded">CNAME</code> (all caps, no extension). The only content of this file should be your domain: <code className="text-xs bg-brand-peach/50 p-1 rounded">{customDomain}</code>. The command in Step 2 will do this for you!
                                        </p>
                                         <p>
                                            <b className="font-semibold">B. At Your Domain Registrar:</b> Go to your domain provider (e.g., GoDaddy, Namecheap) and add a <code className="text-xs bg-brand-peach/50 p-1 rounded">CNAME</code> record for <code className="text-xs bg-brand-peach/50 p-1 rounded">www</code> that points to <code className="text-xs bg-brand-peach/50 p-1 rounded">YOUR_USERNAME.github.io</code>.
                                        </p>
                                        <a href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-coral hover:underline">
                                            Read GitHub's Full Guide &rarr;
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button onClick={onClose} className="w-full bg-brand-coral mt-6 hover:bg-opacity-90 text-white font-bold py-3 rounded-full transition-all">
                            All Done!
                        </button>
                    </div>
                 )
        }
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
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-[popIn_0.3s_ease-out_forwards]" 
                onClick={e => e.stopPropagation()}
            >
                {renderContent()}
            </div>
        </div>
    );
};