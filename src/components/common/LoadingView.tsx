interface Props {
  message: string;
}

export const LoadingView = ({ message = '잠시만 기다려주세요...' }: Props) => {
  return (
    <div
      role='status'
      aria-live='polite'
      className='flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-5 px-6 py-16'
    >
      <div aria-hidden='true' className='relative w-8 h-8'>
        <div className='absolute inset-0 border-2 border-accent-soft rounded-full' />
        <div className='absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin motion-reduce:animate-none' />
      </div>
      <p className='text-text-muted text-sm whitespace-pre-wrap text-center leading-relaxed'>{message}</p>
    </div>
  );
};
