'use client';

import { RepoUrlInput } from '@/components/ui/RepoUrlInput';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSearch = (url: string) => {
    setError('');

    try {
      const urlObj = new URL(url);

      if (urlObj.hostname !== 'github.com') {
        setError('GitHub URL만 지원합니다.');
        return;
      }

      const pathname = urlObj.pathname.split('/').filter(Boolean);

      if (pathname.length < 2) {
        setError('GitHub 레포지토리 주소를 정확히 입력해주세요.');
        return;
      }

      const filteredPath = pathname.filter((segment) => segment !== 'tree');

      const resultPath = filteredPath.join('/');
      router.push(`/repository/${resultPath}`);
    } catch (e) {
      setError('유효한 URL 형식이 아닙니다. (예 : https://github.com/facebook/react)');
    }
  };

  return (
    <div className=' flex-1 flex items-center justify-center'>
      <span>{error}</span>
      <RepoUrlInput onSearch={handleSearch} />
    </div>
  );
}
