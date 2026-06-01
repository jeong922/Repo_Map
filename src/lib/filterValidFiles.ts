import { RawTreeItem } from '@/types/github';
import { BINARY_EXTENSIONS, EXCLUDE_PATTERNS } from './extractionRules';

export function filterValidFiles(tree: RawTreeItem[]) {
  return tree.filter((item) => {
    const path = item.path.toLowerCase();

    const isExcluded = EXCLUDE_PATTERNS.some((pattern) => path.includes(pattern));

    const isBinary = BINARY_EXTENSIONS.some((ext) => path.endsWith(ext));

    return item.type === 'blob' && !isExcluded && !isBinary;
  });
}
