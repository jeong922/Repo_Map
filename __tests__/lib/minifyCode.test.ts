import { minifyCode } from '@/lib/minifyCode';

describe('minifyCode', () => {
  it('일반적인 주석과 한 줄짜리 import 구문을 정상적으로 제거해야 한다', () => {
    const input = `
      import { useState } from 'react';
      // 이 함수는 테스트용입니다.
      export const add = (a, b) => {
        /* 멀티라인 주석 테스트 */
        return a + b;
      };
    `;

    const result = minifyCode(input);

    expect(result).not.toContain("import { useState } from 'react';");
    expect(result).not.toContain('이 함수는 테스트용입니다.');
    expect(result).not.toContain('멀티라인 주석 테스트');
    expect(result).toContain('export const add = (a, b) => {');
    expect(result).toContain('return a + b;');
    expect(result).toContain('};');
  });

  it('연속된 공백과 무의미한 빈 줄을 압축해야 한다', () => {
    const input = `const   a   =   1;
    

    const b = 2;`;

    const result = minifyCode(input);
    expect(result).toBe('const a = 1;\nconst b = 2;');
  });

  it('결과물이 2000자를 초과하면 2000자에서 잘라야 한다', () => {
    const longCode = 'a'.repeat(3000);
    const result = minifyCode(longCode);
    expect(result.length).toBe(2000);
  });

  it('문자열 내부의 HTTP/HTTPS URL이 파괴되지 않아야 한다', () => {
    const input = `const apiUrl = "https://api.github.com/users";`;
    const result = minifyCode(input);

    expect(result).toBe(`const apiUrl = "https://api.github.com/users";`);
  });

  it('여러 줄로 나누어 작성된 멀티라인 import 구문도 완전히 지워져야 한다', () => {
    const input = `
      import {
        useState,
        useEffect
      } from 'react';
      const a = 1;
    `;
    const result = minifyCode(input);

    expect(result.trim()).toBe('const a = 1;');
  });
});
