import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateStructuredContent<T>(
  prompt: string,
  systemInstruction: string,
  schema: any
): Promise<T | null> {
  const ai = getGeminiClient();
  if (!ai) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.1, // low temperature for strict factual grounding
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return null;
    }
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('[Gemini API Error]', error);
    return null;
  }
}
