import { RepositoryData } from '@/types/github';

export const analyzeRepository = async (repoData: RepositoryData) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: repoData }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'AI 분석 중 오류가 발생했습니다.');
  }

  return response.json();
};
