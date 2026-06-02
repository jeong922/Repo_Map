import { ai } from '@/lib/gemini';

export function streamGemini(userPrompt: string, signal?: AbortSignal) {
  return ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      abortSignal: signal,
    },
  });
}
