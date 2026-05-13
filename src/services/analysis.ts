import { RepositoryData } from '@/types/github';

export const analyzeRepository = async (repoData: RepositoryData, onChunk: (text: string) => void) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: repoData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'AI 분석 중 오류가 발생했습니다.');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('응답 스트림을 읽을 수 없습니다.');
  }

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;

    onChunk(chunk);
  }

  return fullText;
};
