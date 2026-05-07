import { analyzeRepository } from '@/services/analysis';
import { RepositoryData } from '@/types/github';
import { useQuery } from '@tanstack/react-query';

export const useRepoAnalysis = (repoData: RepositoryData | null) => {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['analysis', repoData?.treeCount, repoData?.currentBranch],
    queryFn: async () => {
      if (!repoData) {
        throw new Error('데이터가 없습니다.');
      }

      return analyzeRepository(repoData);
    },
    enabled: !!repoData && repoData.success,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  return {
    analysisData: data?.text,
    isLoading,
    isAnalyzing: isFetching,
    analysisError: error,
  };
};
