'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ModelContext = createContext()

export function ModelProvider({ children }) {
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini')

  const models = [
    {
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini',
      description: 'Fast and efficient model for most tasks',
      provider: 'OpenAI',
      api: 'OpenRouter'
    },
    {
      id: 'google/gemini-2.0-flash-exp',
      name: 'Gemini 2.0 Flash (OpenRouter)',
      description: 'Google\'s latest experimental model via OpenRouter',
      provider: 'Google',
      api: 'OpenRouter'
    },
    {
      id: 'gemini-2.0-flash-exp',
      name: 'Gemini 2.0 Flash (Direct)',
      description: 'Google\'s latest experimental model via Gemini API',
      provider: 'Google',
      api: 'Gemini API'
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      description: 'Most capable Gemini model for complex tasks',
      provider: 'Google',
      api: 'Gemini API'
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Fast and efficient Gemini model',
      provider: 'Google',
      api: 'Gemini API'
    }
  ]

  // Load model preference from localStorage
  useEffect(() => {
    const savedModel = localStorage.getItem('nexa-selected-model')
    if (savedModel && models.find(m => m.id === savedModel)) {
      setSelectedModel(savedModel)
    }
  }, [])

  // Save model preference to localStorage
  const selectModel = (modelId) => {
    if (models.find(m => m.id === modelId)) {
      setSelectedModel(modelId)
      localStorage.setItem('nexa-selected-model', modelId)
    }
  }

  const getSelectedModel = () => {
    return models.find(m => m.id === selectedModel) || models[0]
  }

  const value = {
    selectedModel,
    selectModel,
    models,
    getSelectedModel
  }

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider')
  }
  return context
}