import React, { useEffect } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Markdown from "react-markdown";
import Prism from "prismjs";
import toast from "react-hot-toast";
import { SearchSection } from "./SearchSection";

const Message = ({ role, content, reasoning = false, searchData = null }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };
  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <div
        className={`flex flex-col w-full mb-8 ${
          role === "user" && "items-end"
        }`}
      >
        <div
          className={`group relative flex max-w-3xl py-4 rounded-2xl transition-all duration-200 ${
            role === "user" 
              ? "bg-gradient-to-r from-[#414158] to-[#4a4a62] px-6 shadow-lg" 
              : "gap-4 px-2"
          }`}
        >
          <div
            className={`opacity-0 group-hover:opacity-100 absolute ${
              role === "user" ? "-left-16 top-3" : "left-12 -bottom-6"
            } transition-all duration-200 z-10`}
          >
            <div className="flex items-center gap-2 opacity-70 bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1">
              {role === "user" ? (
                <>
                  <Image
                    onClick={copyMessage}
                    src={assets.copy_icon}
                    alt="copy"
                    className="w-4 cursor-pointer hover:scale-110 transition-transform"
                  />
                  <Image
                    src={assets.pencil_icon}
                    alt="pencil"
                    className="w-4.5 cursor-pointer hover:scale-110 transition-transform"
                  />
                </>
              ) : (
                <>
                  <Image
                    onClick={copyMessage}
                    src={assets.copy_icon}
                    alt="copy"
                    className="w-4.5 cursor-pointer hover:scale-110 transition-transform"
                  />
                  <Image
                    src={assets.regenerate_icon}
                    alt="regenerate"
                    className="w-4 cursor-pointer hover:scale-110 transition-transform"
                  />
                  <Image
                    src={assets.like_icon}
                    alt="like"
                    className="w-4 cursor-pointer hover:scale-110 transition-transform"
                  />
                  <Image
                    src={assets.dislike_icon}
                    alt="dislike"
                    className="w-4 cursor-pointer hover:scale-110 transition-transform"
                  />
                </>
              )}
            </div>
          </div>
          {role === "user" ? (
            <div className="text-white/95 font-medium leading-relaxed tracking-wide text-[15px]">
              {content}
            </div>
          ) : (
            <>
              <div className="flex-shrink-0">
                <Image
                  src={assets.logo_icon}
                  className="h-10 w-10 p-1.5 border border-white/15 rounded-full shadow-sm"
                  alt="logo"
                />
              </div>
              <div className="w-full min-w-0">
                {reasoning && (
                  <div className="flex items-center gap-2 text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-full mb-3 w-fit font-medium">
                    <Image
                      src={assets.deepthink_icon}
                      className="h-3 w-3"
                      alt="reasoning"
                    />
                    <span className="font-semibold tracking-wide">DeepThink</span>
                  </div>
                )}
                
                {/* Search Results Section */}
                {searchData && (
                  <div className="mb-4">
                    <SearchSection 
                      searchData={searchData} 
                      isLoading={false}
                      isOpen={true}
                    />
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none text-white/90 leading-relaxed">
                  <Markdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-4 last:mb-0 text-white/90 leading-[1.7] text-[15px]">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0 leading-tight">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-white mb-3 mt-5 first:mt-0 leading-tight">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-semibold text-white mb-3 mt-4 first:mt-0 leading-tight">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-4 pl-6 space-y-2 text-white/90">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-4 pl-6 space-y-2 text-white/90">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-white/90 leading-[1.6] text-[15px]">
                          {children}
                        </li>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-black/30 text-yellow-300 px-1.5 py-0.5 rounded text-[13px] font-medium border border-white/10">
                            {children}
                          </code>
                        ) : (
                          <code className={className}>{children}</code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="my-4 overflow-x-auto bg-black/40 border border-white/10 rounded-xl p-4 text-[14px] leading-relaxed">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary/60 pl-4 py-2 my-4 italic text-white/80 bg-primary/10 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-white/85">
                          {children}
                        </em>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full border border-white/20 rounded-lg overflow-hidden">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-white/10">
                          {children}
                        </thead>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2 text-left text-white font-semibold border-b border-white/20">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2 text-white/90 border-b border-white/10">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {content}
                  </Markdown>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
