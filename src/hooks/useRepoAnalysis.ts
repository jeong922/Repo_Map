import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyzeRepository } from '@/services/analysis';
import { RepositoryData } from '@/types/github';

export const useRepoAnalysis = (repoData: RepositoryData | null) => {
  const [streamingText, setStreamingText] = useState<string>('');

  const query = useQuery({
    queryKey: ['analysis', { count: repoData?.treeCount, branch: repoData?.currentBranch }],
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
  });

  const analysisData = useMemo(() => {
    if (query.data?.text && !query.isFetching) {
      return query.data.text;
    }

    if (streamingText) {
      return streamingText;
    }

    return query.data?.text || '';
  }, [query.isFetching, query.data?.text, streamingText]);

  return {
    analysisData,
    isLoading: query.isLoading,
    isAnalyzing: query.isFetching,
    analysisError: query.error,
  };
};
