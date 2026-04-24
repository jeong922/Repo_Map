'use client';

import { useRepository } from '@/hooks/useRepository';
import { useParams } from 'next/navigation';

export default function RepositoryDetail() {
  const params = useParams();
  const owner = params.owner as string;
  const repoSegments = params.repo as string[];
  const repoName = repoSegments[0];
  const branch = repoSegments[1];

  const { data, isLoading, error } = useRepository(owner, repoName, branch);

  return (
    <div>
      {owner} {repoName} {branch}
    </div>
  );
}
