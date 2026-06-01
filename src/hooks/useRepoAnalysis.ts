import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyzeRepository } from '@/services/analysis';
import { RepositoryData } from '@/types/github';
import { ApiError } from '@/types/apiError';

export const useRepoAnalysis = (repoData: RepositoryData | null) => {
  const [streamingText, setStreamingText] = useState('');

  const query = useQuery({
    queryKey: [
      'analysis',
      {
        count: repoData?.treeCount,
        branch: repoData?.currentBranch,
      },
    ],

    queryFn: async () => {
      if (!repoData) {
        throw new Error('데이터가 없습니다.');
      }

      setStreamingText('');

      const result = await analyzeRepository(repoData, (chunk) => {
        setStreamingText((prev) => prev + chunk);
      });

      return { text: result };
    },

    enabled: !!repoData && repoData.success,

    staleTime: 1000 * 60 * 30,

    retry: (failureCount, error: ApiError) => failureCount < 1 && [429, 503].includes(error.status),

    retryDelay: 1000,
  });

  const retryAnalysis = async () => {
    setStreamingText('');
    await query.refetch();
  };

  const analysisData = useMemo(() => {
    if (query.data?.text && !query.isFetching) {
      return query.data.text;
    }

    return streamingText;
  }, [query.data?.text, query.isFetching, streamingText]);

  return {
    analysisData,
    isLoading: query.isLoading,
    isAnalyzing: query.isFetching,
    analysisError: query.error,
    retryAnalysis,
  };
};
