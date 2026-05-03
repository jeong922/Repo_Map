import { RepositoryDetail } from '@/components/RepositoryDetail';
import { Suspense } from 'react';

export default async function RepositoryDetailPage({
  params,
}: {
  params: Promise<{ owner: string; repo?: string[] }>;
}) {
  const { owner, repo } = await params;

  const [repoName, branch] = repo ?? [];

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <RepositoryDetail owner={owner} repoName={repoName} branch={branch} />
    </Suspense>
  );
}
