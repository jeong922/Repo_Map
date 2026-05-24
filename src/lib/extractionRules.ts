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

interface PriorityRule {
  readonly priority: number;
  readonly patterns: readonly RegExp[];
}

const PRIORITY_RULES: readonly PriorityRule[] = [
  {
    priority: 1,
    patterns: [/(package\.json|requirements\.txt|go\.mod|cargo\.toml|setup\.py|gemfile)$/i],
  },
  {
    priority: 2,
    patterns: [/\/(domain|service|services|core|business|logic|usecase|store|state|context|model|models)\//i],
  },
  {
    priority: 3,
    patterns: [/\/(controller|controllers|api|routes|app|pages)\//i, /(?:^|\/)(main|index|app)\.[a-z]+$/i],
  },
  {
    priority: 4,
    patterns: [/\/(hooks|modules)\//i],
  },
  {
    priority: 5,
    patterns: [/\/(components|view|views)\//i],
  },
  {
    priority: 6,
    patterns: [/\/(utils|helpers|common|shared)\//i],
  },
];

export const getPriority = (path: string): number => {
  const matchedRule = PRIORITY_RULES.find((rule) => rule.patterns.some((pattern) => pattern.test(path)));

  return matchedRule?.priority ?? 6;
};
