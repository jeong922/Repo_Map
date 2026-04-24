'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRepoData } from '@/services/repoService';

export const useRepository = (owner: string, repo: string, branch: string = 'main') => {
  const targetUrl = owner && repo ? `https://github.com/${owner}/${repo}` : '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['repository', owner, repo, branch],
    queryFn: () => fetchRepoData(targetUrl),
    enabled: !!owner && !!repo,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
};
