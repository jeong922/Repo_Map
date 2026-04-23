'use client';

import { RepoUrlInput } from '@/components/ui/RepoUrlInput';
import { useRepository } from '@/hooks/useRepository';

export default function Home() {
  const { data, isLoading, error, search } = useRepository();

  return (
    <div className=' flex-1 flex items-center justify-center'>
      <RepoUrlInput onSearch={search} />
    </div>
  );
}
