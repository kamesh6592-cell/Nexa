import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { sendMessageToChat } from '../services/geminiService';

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
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send the whole history for context
      const modelResponse = await sendMessageToChat(newMessages);
      const modelMessage: ChatMessage = { role: 'model', text: modelResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages]);

  return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border h-[70vh] flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-center">AI Chat</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-coral text-white' : 'bg-brand-sky'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-xs p-3 rounded-2xl bg-brand-sky flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-brand-coral border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white rounded-b-3xl">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Ask me anything..."
                        className="w-full bg-brand-cream/70 border-2 border-transparent rounded-full p-3 focus:ring-2 focus:ring-brand-coral"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} className="bg-brand-coral text-white font-bold p-3 rounded-full transition-transform hover:scale-105" disabled={isLoading || !input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
