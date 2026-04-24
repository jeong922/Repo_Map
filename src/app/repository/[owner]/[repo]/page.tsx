'use client';

import { useParams } from 'next/navigation';

export default function RepositoryDetail() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  return (
    <div>
      {owner} {repo}
    </div>
  );
}
