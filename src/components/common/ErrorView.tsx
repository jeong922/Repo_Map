import Link from 'next/link';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView = ({ message = '분석 중 오류가 발생했습니다.', onRetry }: Props) => {
  return (
    <div className='flex-1 flex flex-col items-center justify-center py-20 px-6 animate-in fade-in slide-in-from-bottom-3 duration-700'>
      <div className='text-center'>
        <h1 className='text-8xl font-black text-red-500/10 select-none tracking-tighter'>ERROR</h1>

        <div className='-mt-10 flex flex-col items-center'>
          <h2 className='text-2xl font-bold text-text-main tracking-tight'>문제가 발생했습니다</h2>
          <p className='text-text-muted text-sm max-w-72 leading-relaxed mt-2'>
            {message} <br /> 잠시 후 다시 시도해 주세요.
          </p>
        </div>

        <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
          {onRetry && (
            <button
              onClick={onRetry}
              className='cursor-pointer min-w-40 px-6 py-2.5 rounded-full border border-border-subtle bg-surface/50 text-text-main font-medium hover:bg-border-subtle shadow-sm'
            >
              다시 시도
            </button>
          )}

          <Link
            href='/'
            className='min-w-40 px-6 py-2.5 rounded-full bg-text-main text-background font-medium hover:opacity-90 transition-opacity text-center'
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};
