'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useModel } from '@/context/ModelContext'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import toast from 'react-hot-toast'

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme, isDark } = useTheme()
  const { selectedModel, selectModel, models, getSelectedModel } = useModel()
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('general')

  if (!isOpen) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      onClose()
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'account', name: 'Account', icon: '👤' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center auth-modal-backdrop backdrop-blur-sm z-[200]">
      <div className={`rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border auth-modal-content mx-4 ${
        theme === 'dark' 
          ? 'bg-[#212327] border-gray-600/30' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-600/30' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Settings</h2>
          <button
            onClick={onClose}
            className={`text-2xl transition-colors ${
              theme === 'dark' 
                ? 'text-white/60 hover:text-white' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ×
          </button>
        </div>

        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className={`w-1/3 border-r p-4 ${
            theme === 'dark' ? 'border-gray-600/30' : 'border-gray-200'
          }`}>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : `${
                          theme === 'dark' 
                            ? 'text-white/70 hover:bg-white/10 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>General Settings</h3>
                  
                  <div className="space-y-4">
                    {/* AI Model Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>AI Model</label>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                          }`}>Choose your preferred AI model for conversations</p>
                        </div>
                        <select 
                          value={selectedModel}
                          onChange={(e) => {
                            selectModel(e.target.value)
                            toast.success(`Switched to ${models.find(m => m.id === e.target.value)?.name}`)
                          }}
                          className={`px-3 py-2 rounded-lg border focus:outline-none focus:border-primary min-w-[200px] ${
                            theme === 'dark' 
                              ? 'bg-[#404045] text-white border-gray-600' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}
                        >
                          {models.map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.name} - {model.api}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Model Info */}
                      {(() => {
                        const currentModel = getSelectedModel();
                        return (
                          <div className={`text-xs p-3 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                          }`}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{currentModel.name}</span>
                              <span className="text-primary">{currentModel.api}</span>
                            </div>
                            <p className="mb-2">{currentModel.description}</p>
                            <p className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Required API Key: {currentModel.api === 'OpenRouter' ? 'OPENROUTER_API_KEY' : 'GEMINI_API_KEY'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Language</label>
                        <p className="text-sm text-white/60">Choose your preferred language</p>
                      </div>
                      <select className="bg-[#404045] text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-primary">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Auto-save chats</label>
                        <p className="text-sm text-white/60">Automatically save your conversations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Sound effects</label>
                        <p className="text-sm text-white/60">Play sounds for notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Theme</label>
                        <p className="text-sm text-white/60">Choose your preferred theme</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 bg-[#404045] hover:bg-[#505055] px-4 py-2 rounded-lg border border-gray-600 transition-colors"
                      >
                        <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
                        <span className="text-white capitalize">{theme}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Font size</label>
                        <p className="text-sm text-white/60">Adjust text size in conversations</p>
                      </div>
                      <select className="bg-[#404045] text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-primary">
                        <option value="small">Small</option>
                        <option value="medium" selected>Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Compact mode</label>
                        <p className="text-sm text-white/60">Show more content in less space</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Sidebar position</label>
                        <p className="text-sm text-white/60">Choose sidebar placement</p>
                      </div>
                      <select className="bg-[#404045] text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-primary">
                        <option value="left" selected>Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
                  
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-[#404045] rounded-lg">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{user.email}</p>
                          <p className="text-sm text-white/60">Signed in via Supabase</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#404045] hover:bg-[#505055] rounded-lg text-white transition-colors">
                          <span>📊</span>
                          <span>Usage Statistics</span>
                        </button>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#404045] hover:bg-[#505055] rounded-lg text-white transition-colors">
                          <span>🔐</span>
                          <span>Privacy & Security</span>
                        </button>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#404045] hover:bg-[#505055] rounded-lg text-white transition-colors">
                          <span>💾</span>
                          <span>Export Data</span>
                        </button>
                        
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                        >
                          <span>🚪</span>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60 mb-4">You are not signed in</p>
                      <button 
                        onClick={onClose}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-600/30 bg-[#1a1a1a]">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>NEXA v1.0.0</span>
            <div className="flex gap-4">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Help</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal