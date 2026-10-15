import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex-1 flex flex-col items-center justify-center px-6'>
      <div className='w-full max-w-md rounded-xl border border-border-subtle bg-surface p-7 text-center'>
        <h1 className='mb-5 text-sm font-mono text-text-muted'>404</h1>

        <div className='flex flex-col items-center'>
          <h2 className='text-2xl font-bold text-text-main tracking-tight'>페이지를 찾을 수 없습니다</h2>
          <p className='text-text-muted text-sm max-w-60 leading-relaxed mt-1'>
            요청하신 페이지는 존재하지 않거나 다른 주소로 이동되었습니다.
          </p>
        </div>

        <div className='mt-8'>
          <Link href='/' className='button-primary'>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
