"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ReasoningContext = createContext();

export const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("useReasoning must be used within a ReasoningProvider");
  }
  return context;
};

export const ReasoningProvider = ({ children }) => {
  const [isReasoningEnabled, setIsReasoningEnabled] = useState(false);

  // Load reasoning preference from localStorage
  useEffect(() => {
    const savedReasoningState = localStorage.getItem("reasoning-enabled");
    if (savedReasoningState !== null) {
      setIsReasoningEnabled(JSON.parse(savedReasoningState));
    }
  }, []);

  // Save reasoning preference to localStorage
  const toggleReasoning = () => {
    const newState = !isReasoningEnabled;
    setIsReasoningEnabled(newState);
    localStorage.setItem("reasoning-enabled", JSON.stringify(newState));
  };

  const value = {
    isReasoningEnabled,
    setIsReasoningEnabled,
    toggleReasoning,
  };

  return (
    <ReasoningContext.Provider value={value}>
      {children}
    </ReasoningContext.Provider>
  );
};