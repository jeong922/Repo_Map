'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRepoData } from '@/services/repoService';
import { useState } from 'react';

export const useRepository = () => {
  const [targetUrl, setTargetUrl] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['repository', targetUrl],
    queryFn: () => fetchRepoData(targetUrl),
    enabled: !!targetUrl,
    retry: false,
  });

  const search = (url: string) => {
    setTargetUrl(url);
  };

  return { data, isLoading, error, search };
};
