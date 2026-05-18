'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchRepoData } from '@/services/repoService';

export const useRepository = (owner: string, repo: string, branch?: string) => {
  const targetUrl = owner && repo ? `https://github.com/${owner}/${repo}${branch ? `/tree/${branch}` : ''}` : '';

  const { data } = useSuspenseQuery({
    queryKey: ['repository', owner, repo, branch ?? 'default'],
    queryFn: () => fetchRepoData(targetUrl),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { data };
};
