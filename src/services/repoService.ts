import { RepositoryData } from '@/types/github';

export const fetchRepoData = async (url: string): Promise<RepositoryData> => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/(.+))?/);

  if (!match) {
    throw new Error('유효한 GitHub URL이 아닙니다.');
  }

  const [, owner, repo] = match;

  const branch = match[3] ? match[3].replace(/\/$/, '') : undefined;

  const baseUrl = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/repository`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo, branch }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '데이터 로드에 실패했습니다.');
  }

  return response.json();
};
