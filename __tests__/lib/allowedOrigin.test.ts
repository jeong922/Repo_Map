import { isAllowedOrigin } from '@/lib/allowedOrigin';

describe('allowedOrigin', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();

    process.env = {
      ...originalEnv,
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('개발 환경에서는 모든 origin을 허용해야 한다', () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'development',
    };

    expect(isAllowedOrigin('https://test.com')).toBe(true);
    expect(isAllowedOrigin(null)).toBe(true);
  });

  it('프로덕션 환경에서 origin이 일치하면 true를 반환한다', () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_PUBLIC_APP_URL: 'https://myapp.com',
    };

    expect(isAllowedOrigin('https://myapp.com')).toBe(true);
  });

  it('프로덕션 환경에서 origin이 다르면 false를 반환한다', () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_PUBLIC_APP_URL: 'https://myapp.com',
    };

    expect(isAllowedOrigin('https://malicious.com')).toBe(false);
    expect(isAllowedOrigin('https://test.com')).toBe(false);
  });

  it('환경 변수가 설정되지 않은 경우 에러 로그를 남기고 false를 반환한다', () => {
    process.env = {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_PUBLIC_APP_URL: '',
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(isAllowedOrigin('https://myapp.com')).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('NEXT_PUBLIC_APP_URL 환경변수가 설정되지 않았습니다.');

    consoleSpy.mockRestore();
  });
});
