import { ApiError } from '@/types/apiError';
import { RepositoryData } from '@/types/github';

export const analyzeRepository = async (repoData: RepositoryData, onChunk: (text: string) => void) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: repoData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.error || 'AI 분석 중 오류가 발생했습니다.', response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError('응답 스트림을 읽을 수 없습니다.', 500);
  }

  const decoder = new TextDecoder();
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, {
        stream: true,
      });

      fullText += chunk;

      onChunk(chunk);
    }

    return fullText;
  } catch {
    throw new ApiError('AI 서버가 현재 혼잡합니다. 잠시 후 다시 시도해주세요.', 503);
  }
};
