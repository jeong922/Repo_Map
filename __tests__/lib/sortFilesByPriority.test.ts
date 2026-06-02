import { sortFilesByPriority } from '@/lib/sortFilesByPriority';
import { RawTreeItem } from '@/types/github';

describe('sortFilesByPriority', () => {
  it('우선순위가 높은 파일이 먼저 와야 한다.', () => {
    const tree: RawTreeItem[] = [
      {
        path: '/src/components/Button.tsx',
        type: 'blob',
        sha: '123',
      },
      {
        path: 'package.json',
        type: 'blob',
        sha: '123sdfasfd',
      },
      {
        path: '/src/domain/user.ts',
        type: 'blob',
        sha: '123sdfasdfsfd',
      },
    ];

    const sorted = sortFilesByPriority(tree);
    expect(sorted[0].path).toBe('package.json');
    expect(sorted[1].path).toBe('/src/domain/user.ts');
    expect(sorted[2].path).toBe('/src/components/Button.tsx');
  });

  it('우선순위가 같다면 사전순으로 정렬되어야 한다.', () => {
    const tree: RawTreeItem[] = [
      {
        path: '/src/domain/b.ts',
        type: 'blob',
        sha: '123',
      },
      {
        path: '/src/domain/a.ts',
        type: 'blob',
        sha: '123sdfasfd',
      },
      {
        path: '/src/domain/C.ts',
        type: 'blob',
        sha: '123sdfassdfsdffd',
      },
    ];
    const sorted = sortFilesByPriority(tree);
    expect(sorted.map((s) => s.path)).toEqual(['/src/domain/a.ts', '/src/domain/b.ts', '/src/domain/C.ts']);
  });
});
