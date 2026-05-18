'use client';

import { ErrorView } from '@/components/common/ErrorView';

export default function Error() {
  return (
    <>
      <ErrorView message='저장소 데이터를 가져오는 중에 문제가 발생했습니다.' />
    </>
  );
}
