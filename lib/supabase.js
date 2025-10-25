import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Helper function to get user session
export const getUser = async () => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured')
      return null
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// Helper function to sign out
export const signOut = async () => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured')
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// Helper function to sign in with email
export const signInWithEmail = async (email, password) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

// Helper function to sign up with email
export const signUpWithEmail = async (email, password) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

// Helper function to sign in with OAuth providers
export const signInWithProvider = async (provider) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error)
    throw error
  }
}