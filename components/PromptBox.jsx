"use client";

import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useModel } from "@/context/ModelContext";
import { useReasoning } from "@/context/ReasoningContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import axios from "axios";

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState("");
  const { selectedModel } = useModel();
  const { isReasoningEnabled, toggleReasoning } = useReasoning();
  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt;

    try {
      e.preventDefault();
      if (!user) return toast.error("Login to send message");
      if (!selectedChat) return toast.error("Please wait while we set up your chat");
      if (isLoading)
        return toast.error("Wait for the previous prompt response");

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: prompt,
        timeStamp: Date.now(),
      };

      // Saving user prompt in chats array
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat?._id
            ? {
                ...chat,
                messages: [...(chat.messages || []), userPrompt],
              }
            : chat
        )
      );

      // Saving user prompt in selected chat
      setSelectedChat((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...(prev.messages || []), userPrompt],
        };
      });

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const { data } = await axios.post("/api/chat/ai", {
        chatId: selectedChat._id,
        prompt,
        model: selectedModel,
        reasoning: isReasoningEnabled,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat?._id
              ? { ...chat, messages: [...(chat.messages || []), data.data] }
              : chat
          )
        );
        const message = data.data.content;
        const messageTokens = message.split(" ");
        let assistantMessage = {
          role: "assistant",
          content: "",
          timeStamp: Date.now(),
          reasoning: data.data.reasoning || null,
        };

        setSelectedChat((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), assistantMessage],
          };
        });

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat((prev) => {
              if (!prev || !prev.messages) return prev;
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage,
              ];
              return { ...prev, messages: updatedMessages };
            });
          }, i * 100);
        }
      } else {
        console.log("ERROR", data.message);
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      console.log("ERROR", error.message);
      toast.error(error.messages);
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-sm md:text-base"
        rows={2}
        placeholder="Message NEXA"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        style={{ fontSize: '16px' }} // Prevent zoom on iOS
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p 
            onClick={toggleReasoning}
            className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full cursor-pointer transition ${
              isReasoningEnabled 
                ? "border-primary bg-primary/10 text-primary" 
                : "border border-gray-300/40 hover:bg-gray-500/20"
            }`}
          >
            <Image
              className="h-5"
              src={assets.deepthink_icon}
              alt="deepthink"
            />
            DeepThink (R1)
          </p>
          {/* <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="search" />
            Search
          </p> */}
        </div>

        <div className="flex items-center gap-2">
          {/* <Image
            className="w-4 cursor-pointer"
            src={assets.pin_icon}
            alt="pin"
          /> */}
          <button
            type="submit"
            className={`${
              prompt && selectedChat ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors hover:opacity-90`}
            disabled={isLoading || !selectedChat}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt && selectedChat ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="arrow"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
