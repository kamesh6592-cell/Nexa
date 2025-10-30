

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { streamMessageToChat } from '../services/geminiService';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    
    const modelMessagePlaceholder: ChatMessage = { role: 'model', text: '' };
    setMessages([...newMessages, modelMessagePlaceholder]);
    
    setInput('');
    setIsLoading(true);

    try {
      await streamMessageToChat(newMessages, (chunk) => {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'model') {
            const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunk };
            return [...prev.slice(0, -1), updatedLastMessage];
          }
          return prev;
        });
      });
    } catch (err) {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error.' };
        if (lastMessage && lastMessage.role === 'model') {
          return [...prev.slice(0, -1), errorMessage];
        }
        return [...prev, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  const BlinkingCursor: React.FC = () => (
    <span className="inline-block w-2 h-5 bg-brand-charcoal/70 animate-[pulse_1s_ease-in-out_infinite] align-bottom ml-1"></span>
  );

  return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border h-[70vh] flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-center text-brand-charcoal dark:text-brand-cream">AI Chat</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-coral/30 text-brand-charcoal dark:bg-brand-coral/40 dark:text-brand-cream' : 'bg-brand-sky dark:bg-gray-700 text-brand-charcoal dark:text-brand-cream'}`}>
                            <p className="whitespace-pre-wrap">
                                {msg.text}
                                {isLoading && msg.role === 'model' && index === messages.length - 1 && <BlinkingCursor />}
                            </p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white dark:bg-gray-800 rounded-b-3xl dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Ask me anything..."
                        className="w-full bg-brand-cream/70 dark:bg-gray-700 text-brand-charcoal dark:text-white dark:placeholder-gray-400 border-2 border-transparent rounded-full p-3 focus:ring-2 focus:ring-brand-coral"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} className="bg-brand-coral text-white font-bold p-3 rounded-full transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isLoading || !input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};