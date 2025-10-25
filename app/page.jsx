"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
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
    <div className="mobile-chat-container">
      <div className="flex h-screen h-[100dvh]">
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-2 md:px-4 pb-4 md:pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-4 safe-area-top flex items-center justify-between w-full z-20">
            <Image
              alt="menu"
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180 cursor-pointer w-6 h-6"
              src={assets.menu_icon}
            />
            <Image
              alt="chat"
              className="opacity-70 cursor-pointer w-6 h-6"
              src={assets.chat_icon}
            />
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 px-4">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                <Image
                  src={assets.logo_icon}
                  className="h-16 w-16 md:h-20 md:w-20"
                  alt="logo"
                />
                <p className="text-xl md:text-2xl font-medium text-center md:ml-[-1rem]">
                  Hello, I am NEXA
                </p>
              </div>
              <p className="text-sm text-center mb-8">How can I help you today?</p>
            </div>
          ) : (
            <div
              className="relative flex flex-col items-center justify-start w-full mt-16 md:mt-20 flex-1 overflow-y-auto mobile-messages"
              ref={containerRef}
            >
              <p className="fixed top-6 md:top-8 left-1/2 transform -translate-x-1/2 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6 z-10 bg-[#292a2d]/80 backdrop-blur-sm">
                {selectedChat.name}
              </p>
              {messages.map((msg, index) => (
                <Message key={index} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3 px-2">
                  <Image
                    className="h-9 w-9 p-1 border border-white/15 rounded-full"
                    src={assets.logo_icon}
                    alt="Logo"
                  />
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full max-w-4xl px-2 md:px-0">
            <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center safe-area-bottom">
            AI-generated, for reference only | © NEXA 2025
          </p>
        </div>
      </div>
    </div>
  );
}
