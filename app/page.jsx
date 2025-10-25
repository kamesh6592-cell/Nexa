"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const { selectedChat } = useAppContext();
  const { theme } = useTheme();
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat && selectedChat.messages) {
      setMessages(selectedChat.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className={`flex-1 flex flex-col items-center justify-center px-4 pb-8 relative transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-[#292a2d] text-white' 
            : 'bg-[#f9fafb] text-gray-900'
        }`}>
          <div className={`md:hidden absolute px-4 top-6 flex items-center justify-between w-full ${
            theme === 'light' ? 'filter invert' : ''
          }`}>
            <Image
              alt="menu"
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180 cursor-pointer"
              src={assets.menu_icon}
            />
            <Image
              alt="chat"
              className="opacity-70 cursor-pointer"
              src={assets.chat_icon}
            />
          </div>

          {messages.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <div className="logo-main">
                  <Image
                    src={assets.logo_icon}
                    className="h-20 w-20 rounded-full object-cover logo-avatar"
                    alt="logo"
                  />
                </div>
                <p className={`text-2xl font-medium ml-[-1rem] ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Hello, I am NEXA
                </p>
              </div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-white/70' : 'text-gray-600'
              }`}>How can I help you today?</p>
            </>
          ) : (
            <div
              className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
              ref={containerRef}
            >
              <p className={`fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedChat?.name || 'Chat'}
              </p>
              {messages.map((msg, index) => (
                <Message 
                  key={index} 
                  role={msg.role} 
                  content={msg.content} 
                  reasoning={msg.reasoning || false}
                  searchData={msg.searchData || null}
                />
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3">
                  <Image
                    className="h-9 w-9 rounded-full object-cover logo-avatar animate-pulse"
                    src={assets.logo_icon}
                    alt="Logo"
                  />
                  <div className={`loader flex justify-center items-center gap-1`}>
                    <div className={`w-1 h-1 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-white' : 'bg-gray-600'
                    }`}></div>
                    <div className={`w-1 h-1 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-white' : 'bg-gray-600'
                    }`}></div>
                    <div className={`w-1 h-1 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-white' : 'bg-gray-600'
                    }`}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className={`text-xs absolute bottom-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            AI-generated, for reference only | © NEXA 2025
          </p>
        </div>
      </div>
    </div>
  );
}
