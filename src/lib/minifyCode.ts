export const minifyCode = (code: string): string => {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // 주석 제거
    .replace(/^\s*(import|from|require|package|using)\s+.*$/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
    .substring(0, 2000);
};
