import Link from 'next/link';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView = ({ message = '분석 중 오류가 발생했습니다.', onRetry }: Props) => {
  return (
    <div className='flex-1 flex flex-col items-center justify-center py-20 px-6'>
      <div className='w-full max-w-md rounded-xl border border-border-subtle bg-surface p-7 text-center' role='alert'>
        <p className='mb-4 text-xs font-semibold tracking-widest text-danger'>ANALYSIS ERROR</p>

        <div className='flex flex-col items-center'>
          <h1 className='text-2xl font-bold text-text-main tracking-tight'>문제가 발생했습니다</h1>
          <p className='text-text-muted text-sm max-w-72 leading-relaxed mt-2 text-center whitespace-pre-line'>
            {message}
          </p>
        </div>

        <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
          {onRetry && (
            <button onClick={onRetry} className='button-secondary'>
              다시 시도
            </button>
          )}

          <Link href='/' className='button-primary'>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};
