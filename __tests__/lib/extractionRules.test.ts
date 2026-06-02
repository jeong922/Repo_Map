import { getPriority } from '@/lib/extractionRules';

describe('getPriority', () => {
  it('package.json은 priority 1을 반환한다', () => {
    expect(getPriority('package.json')).toBe(1);
  });

  it('domain 폴더는 priority 2를 반환한다', () => {
    expect(getPriority('/src/domain/user.ts')).toBe(2);
  });

  it('service 폴더는 priority 2를 반환한다', () => {
    expect(getPriority('/src/services/auth.ts')).toBe(2);
  });

  it('controller 폴더는 priority 3을 반환한다', () => {
    expect(getPriority('/src/controllers/user.ts')).toBe(3);
  });

  it('hooks 폴더는 priority 4를 반환한다', () => {
    expect(getPriority('/src/hooks/useAuth.ts')).toBe(4);
  });

  it('components 폴더는 priority 5를 반환한다', () => {
    expect(getPriority('/src/components/Button.tsx')).toBe(5);
  });

  it('utils 폴더는 priority 6을 반환한다', () => {
    expect(getPriority('/src/utils/helper.ts')).toBe(6);
  });

  it('매칭되지 않으면 기본값 6을 반환한다', () => {
    expect(getPriority('/src/random/file.ts')).toBe(6);
  });
});
