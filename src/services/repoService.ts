import { FileNode } from '@/lib/github';

export interface RepoResponse {
  success: boolean;
  treeCount: number;
  fileContentCount: number;
  tree: FileNode[];
  sourceContext: { path: string; content: string }[];
}

export const fetchRepoData = async (url: string): Promise<RepoResponse> => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/(.+))?/);

  if (!match) {
    throw new Error('유효한 GitHub URL이 아닙니다.');
  }

  const [, owner, repo] = match;

  const branch = match[3] ? match[3].replace(/\/$/, '') : undefined;

  const params = new URLSearchParams({ owner, repo });

  if (branch) {
    params.append('branch', branch);
  }

  const response = await fetch(`/api/repository?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '데이터 로드에 실패했습니다.');
  }

  return response.json();
};
