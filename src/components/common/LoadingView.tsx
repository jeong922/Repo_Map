interface Props {
  message: string;
}

export const LoadingView = ({ message = '잠시만 기다려주세요...' }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
      <div className='relative w-12 h-12'>
        <div className='absolute inset-0 border-4 border-accent-soft rounded-full' />
        <div className='absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin' />
      </div>
      <p className='text-text-muted font-medium animate-pulse whitespace-pre-wrap text-center leading-relaxed'>
        {message}
      </p>
    </div>
  );
};
