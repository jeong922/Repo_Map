export const EXCLUDE_PATTERNS = [
  '.git',
  '.github',
  '.vscode',
  '.idea',
  '.DS_Store',
  '.gitignore',
  '.eslintignore',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'composer.lock',
  'cargo.lock',
  'gemfile.lock',
  'go.sum',
  'node_modules',
  'dist',
  'build',
  'out',
  'target',
  'vendor',
  'bin',
  'obj',
  '.next',
  '.nuxt',
  '.cache',
  'tmp',
  'temp',
  '__tests__',
  'test',
  'tests',
  'spec',
  'mock',
  '__mocks__',
  'coverage',
  '.nyc_output',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.pdf',
  '.mp4',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  'babel.config',
  'jest.config',
  'prettier.config',
  'webpack.config',
  'rollup.config',
  'tsconfig.json',
  'jsconfig.json',
  '.eslintrc',
  '.prettierrc',
  'postcss.config',
  'tailwind.config',
  'vite.config',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'npm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
  '.log',
];

export const BINARY_EXTENSIONS = [
  '.exe',
  '.dll',
  '.so',
  '.pyc',
  '.zip',
  '.gz',
  '.tar',
  '.db',
  '.sqlite',
  '.bin',
  '.wasm',
];

export const getPriority = (path: string): number => {
  const p = path.toLowerCase();

  if (p.endsWith('package.json') || p.endsWith('requirements.txt') || p.endsWith('go.mod') || p.endsWith('cargo.toml'))
    return 1;

  if (
    p.includes('/services/') ||
    p.includes('/api/') ||
    p.includes('/logic/') ||
    p.includes('/controller/') ||
    p.includes('/domain/')
  )
    return 2;

  if (p.includes('/app/') || p.includes('/pages/') || p.includes('/routes/') || p.match(/(main|index|app)\.[a-z]+$/))
    return 3;

  if (p.includes('/components/') || p.includes('/modules/') || p.includes('/hooks/')) return 4;

  if (p.includes('/utils/') || p.includes('/helpers/') || p.includes('/common/')) return 5;

  return 6;
};
