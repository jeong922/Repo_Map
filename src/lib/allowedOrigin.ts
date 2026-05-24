export const isAllowedOrigin = (origin: string | null): boolean => {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;

  if (!allowedOrigin) {
    console.error('NEXT_PUBLIC_APP_URL 환경변수가 설정되지 않았습니다.');
    return false;
  }

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(allowedOrigin).origin;
  } catch {
    return false;
  }
};
