'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { assets } from '@/assets/assets'

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithProvider, isConfigured } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConfigured) {
      alert('Authentication is not configured. Please check your environment variables.')
      return
    }
    
    setLoading(true)
    
    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      onClose()
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProviderSignIn = async (provider) => {
    if (!isConfigured) {
      alert('Authentication is not configured. Please check your environment variables.')
      return
    }
    
    setLoading(true)
    try {
      await signInWithProvider(provider)
    } catch (error) {
      console.error('Provider auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center auth-modal-backdrop backdrop-blur-sm">
      <div className="bg-[#212327] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-600/30 auth-modal-content mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {!isConfigured && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-200 text-sm">
              ⚠️ Authentication is not configured. Please add your Supabase credentials to .env.local
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#404045] border border-gray-600 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#404045] border border-gray-600 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#212327] text-white/60">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleProviderSignIn('google')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700/50 disabled:opacity-50"
            >
              <span className="text-white text-sm">Google</span>
            </button>
            <button
              onClick={() => handleProviderSignIn('github')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700/50 disabled:opacity-50"
            >
              <span className="text-white text-sm">GitHub</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:text-primary/80 text-sm"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal