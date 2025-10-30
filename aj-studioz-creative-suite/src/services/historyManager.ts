import type { WebsiteData, HistorySnapshot } from '../types';

const HISTORY_KEY = 'ajStudiozHistory';
const MAX_HISTORY_ITEMS = 20;

export const saveSnapshot = (data: WebsiteData): void => {
  try {
    const history = getHistory();
    const newSnapshot: HistorySnapshot = {
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone to prevent mutation
    };

    // Avoid saving identical consecutive states
    if (history.length > 0) {
        const lastSnapshot = history[history.length - 1];
        if (JSON.stringify(lastSnapshot.data) === JSON.stringify(newSnapshot.data)) {
            return;
        }
    }
    
    const newHistory = [...history, newSnapshot];

    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory.splice(0, newHistory.length - MAX_HISTORY_ITEMS);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to save history snapshot:', error);
  }
};

export const getHistory = (): HistorySnapshot[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      const history = JSON.parse(historyJson);
      // Basic validation
      if (Array.isArray(history) && history.every(item => item.timestamp && item.data)) {
         return history;
      }
    }
    return [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};