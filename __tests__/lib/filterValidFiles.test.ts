import { filterValidFiles } from '@/lib/filterValidFiles';
import { RawTreeItem } from '@/types/github';

describe('filterValidFiles', () => {
  it('blob 파일은 포함한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'src/index.ts',
        type: 'blob',
        sha: '123',
      },
    ];

    expect(filterValidFiles(tree)).toHaveLength(1);
  });

  it('tree 타입은 제외한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'src',
        type: 'tree',
        sha: '123',
      },
    ];

    expect(filterValidFiles(tree)).toHaveLength(0);
  });

  it('node_modules는 제외한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'node_modules/react/index.js',
        type: 'blob',
        sha: '123',
      },
    ];

    expect(filterValidFiles(tree)).toHaveLength(0);
  });

  it('png 파일은 제외한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'assets/logo.png',
        type: 'blob',
        sha: '123',
      },
    ];

    expect(filterValidFiles(tree)).toHaveLength(0);
  });

  it('binary 파일은 제외한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'app.exe',
        type: 'blob',
        sha: '123',
      },
    ];

    expect(filterValidFiles(tree)).toHaveLength(0);
  });

  it('유효한 파일만 반환한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'src/index.ts',
        type: 'blob',
        sha: '123',
      },
      {
        path: 'logo.png',
        type: 'blob',
        sha: '1232',
      },
      {
        path: 'node_modules/react/index.js',
        type: 'blob',
        sha: '40b43d8503366',
      },
    ];

    const result = filterValidFiles(tree);

    expect(result).toEqual([
      {
        path: 'src/index.ts',
        type: 'blob',
        sha: '123',
      },
    ]);
  });

  it('대소문자와 관계없이 제외 패턴을 적용한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'NODE_MODULES/react/index.js',
        type: 'blob',
        sha: '123',
      },
    ];

    expect(filterValidFiles(tree)).toHaveLength(0);
  });

  it('여러 개의 유효한 파일을 모두 반환한다', () => {
    const tree: RawTreeItem[] = [
      {
        path: 'src/index.ts',
        type: 'blob',
        sha: '1',
      },
      {
        path: 'src/app.ts',
        type: 'blob',
        sha: '2',
      },
    ];

    expect(filterValidFiles(tree)).toHaveLength(2);
  });
});
