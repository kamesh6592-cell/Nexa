import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import ChatLabel from "./ChatLabel";
import AuthModal from "./AuthModal";
import SettingsModal from "./SettingsModal";

const Sidebar = ({ expand, setExpand }) => {
  const { user, signOut } = useAuth();
  const { chats, createNewChat } = useAppContext();
  const { theme } = useTheme();
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div
      className={`flex flex-col justify-between pt-4 md:pt-7 transition-all z-50 ${
        theme === 'dark' 
          ? 'bg-[#212327]' 
          : 'bg-white border-r border-gray-200 shadow-sm'
      } ${
        expand 
          ? "fixed inset-0 md:relative md:inset-auto p-4 w-full md:w-64" 
          : "md:w-20 w-0 max-md:overflow-hidden"
      }`}
    >
      <div>
        <div
          className={`flex ${
            expand ? "flex-row gap-6 md:gap-10" : "flex-col items-center gap-9"
          }`}
        >
          <Image
            className={expand ? "w-28 md:w-36" : "w-10"}
            src={expand ? assets.logo_text : assets.logo_icon}
            alt="logo text"
          />

          <div
            onClick={() => (expand ? setExpand(false) : setExpand(true))}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer"
          >
            <Image src={assets.menu_icon} className="md:hidden w-6" alt="menu" />
            <Image
              src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
              className="hidden md:block w-7"
              alt="close"
            />

            <div
              className={`absolute w-max ${
                expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"
              } opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}
            >
              {expand ? "Close sidebar" : "Open sidebar"}
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand
                    ? "left-1/2 -top-1.5 -translate-x-1/2"
                    : "left-4 -bottom-1.5"
                }`}
              ></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={createNewChat}
          className={`mt-6 md:mt-8 flex items-center justify-center cursor-pointer touch-manipulation transition-colors ${
            expand
              ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-full md:w-max"
              : `group relative h-10 w-10 mx-auto rounded-lg ${
                  theme === 'dark' ? 'hover:bg-gray-500/30' : 'hover:bg-gray-100'
                }`
          }`}
        >
          <Image
            className={expand ? "w-6" : "w-7"}
            src={expand ? assets.chat_icon : assets.chat_icon_dull}
            alt="chat icon"
          />
          <div className={`absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none ${
            theme === 'dark' 
              ? 'bg-black text-white' 
              : 'bg-gray-800 text-white'
          }`}>
            New Chat
            <div className={`w-3 h-3 absolute rotate-45 left-4 -bottom-1.5 ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-800'
            }`}></div>
          </div>
          {expand && <p className={`font-medium ${
            theme === 'dark' ? 'text-white' : 'text-white'
          }`}>New Chat</p>}
        </button>

        <div
          className={`mt-6 md:mt-8 text-sm ${
            expand ? "block" : "hidden"
          } ${theme === 'dark' ? 'text-white/25' : 'text-gray-400'}`}
        >
          <p className="my-1">Recents</p>
          <div className="max-h-64 md:max-h-96 overflow-y-auto">
            {chats.map((chat, index) => (
              <ChatLabel
                key={index}
                name={chat.name}
                id={chat._id}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pb-4 md:pb-0">
        <div
          className={`flex items-center cursor-pointer group relative touch-manipulation transition-colors ${
            expand
              ? `gap-1 text-sm p-2.5 border border-primary rounded-lg cursor-pointer ${
                  theme === 'dark' 
                    ? 'text-white/80 hover:bg-white/10' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              : `h-10 w-10 mx-auto rounded-lg ${
                  theme === 'dark' ? 'hover:bg-gray-500/30' : 'hover:bg-gray-100'
                }`
          }`}
        >
          <Image
            className={expand ? "w-5" : "w-6.5 mx-auto"}
            src={expand ? assets.phone_icon : assets.phone_icon_dull}
            alt="phone"
          />
          <div
            className={`absolute -top-60 pb-8 ${
              !expand && "-right-40"
            } opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}
          >
            <div className={`relative w-max text-sm p-3 rounded-lg shadow-lg ${
              theme === 'dark' ? 'bg-black text-white' : 'bg-gray-800 text-white'
            }`}>
              <Image src={assets.qrcode} className="w-44" alt="qrcode" />
              <p>Scan to get NEXA App</p>
              <div
                className={`w-3 h-3 absolute rotate-45 ${
                  expand ? "right-1/2" : "left-4"
                } -bottom-1.5 ${
                  theme === 'dark' ? 'bg-black' : 'bg-gray-800'
                }`}
              ></div>
            </div>
          </div>
          {expand && (
            <>
              <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>Get App</span>
              <Image src={assets.new_icon} alt="new icon" />
            </>
          )}
        </div>

        <div className="relative" ref={profileMenuRef}>
          <div
            onClick={user ? () => setShowProfileMenu(!showProfileMenu) : () => setShowAuthModal(true)}
            className={`flex items-center touch-manipulation transition-colors ${
              expand 
                ? `rounded-lg ${
                    theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }` 
                : "justify-center w-full"
            } gap-3 text-sm p-2 mt-2 cursor-pointer ${
              theme === 'dark' ? 'text-white/60' : 'text-gray-600'
            }`}
          >
            {user ? (
              <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <Image src={assets.profile_icon} className="w-7" alt="profile" />
            )}

            {expand && (
              <div className="flex items-center justify-between w-full">
                <span>{user ? user.email : "Sign In"}</span>
                {user && (
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showProfileMenu ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          {user && showProfileMenu && expand && (
            <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-lg shadow-lg border py-2 ${
              theme === 'dark' 
                ? 'bg-[#2A2B32] border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={() => {
                  setShowSettingsModal(true);
                  setShowProfileMenu(false);
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                  theme === 'dark' 
                    ? 'text-white/80 hover:bg-white/10' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  signOut();
                  setShowProfileMenu(false);
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                  theme === 'dark' 
                    ? 'text-red-400 hover:bg-white/10' 
                    : 'text-red-500 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
};

export default Sidebar;
