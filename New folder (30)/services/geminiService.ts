import type { PromptState, WebsiteData, Plan, LogoConcept, ChatMessage, AnalysisResult } from '../types';

// Helper function to handle API requests to our secure Vercel backend
async function apiPost<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const generateLogoIdeas = async (
  formData: { name: string; description: string; style: string; color: string },
  onIdeasReady: (ideas: LogoConcept[]) => void,
  onImageReady: (index: number, imageUrl: string) => void
): Promise<LogoConcept[]> => {
  // We'll manage the two-step process on the serverless function
  const finalConcepts = await apiPost<LogoConcept[]>('/api/generateLogo', formData);
  
  // To keep the "lovable" UI, we can still call the callbacks
  onIdeasReady(finalConcepts.map(c => ({...c, imageUrl: undefined})));
  finalConcepts.forEach((concept, index) => {
    if (concept.imageUrl) {
      onImageReady(index, concept.imageUrl);
    }
  });

  return finalConcepts;
};

export const generateWebsitePlan = async (formData: PromptState): Promise<Plan> => {
  return apiPost<Plan>('/api/generatePlan', { formData });
};

export const generateWebsiteContent = async (formData: PromptState): Promise<WebsiteData> => {
  return apiPost<WebsiteData>('/api/generateContent', { formData });
};

export const editImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const { imageBase64 } = await apiPost<{ imageBase64: string }>('/api/editImage', {
    base64ImageData,
    mimeType,
    prompt,
  });
  return imageBase64;
};

export const generateImage = async (prompt: string): Promise<string> => {
  const { imageBase64 } = await apiPost<{ imageBase64: string }>('/api/generateImage', { prompt });
  return imageBase64;
};

export const analyzeImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<AnalysisResult> => {
  return apiPost<AnalysisResult>('/api/analyzeImage', {
    base64ImageData,
    mimeType,
    prompt,
  });
};

export const sendMessageToChat = async (messages: ChatMessage[]): Promise<string> => {
  const { response } = await apiPost<{ response: string }>('/api/chat', { messages });
  return response;
};
