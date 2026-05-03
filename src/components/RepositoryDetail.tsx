'use client';

import { useRepoAnalysis } from '@/hooks/useRepoAnalysis';
import { useRepository } from '@/hooks/useRepository';

interface Props {
  owner: string;
  repoName: string;
  branch?: string;
}

export const RepositoryDetail = ({ owner, repoName, branch }: Props) => {
  const { data: repoData } = useRepository(owner, repoName, branch);

  const { analysisData, isAnalyzing } = useRepoAnalysis(repoData ?? null);

  return <div>{analysisData}</div>;
};
