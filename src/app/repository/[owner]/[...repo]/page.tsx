import { LoadingView } from '@/components/common/LoadingView';
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
    <Suspense fallback={<LoadingView message='GitHub 저장소의 프로젝트 구조를 스캔하고 있습니다...' />}>
      <RepositoryDetail owner={owner} repoName={repoName} branch={branch} />
    </Suspense>
  );
}
