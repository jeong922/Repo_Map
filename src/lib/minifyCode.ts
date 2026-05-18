export const minifyCode = (code: string): string => {
  return code
    .replace(/import\s*{[\s\S]*?}\s*from\s*['"][^'"]+['"];?/g, '')
    .replace(/\/\*[\s\S]*?\*\/|([^'":]|^)\/\/.*$/gm, '$1')
    .replace(/^\s*(import|from|require|package|using)\s+.*$/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .substring(0, 2000);
};
