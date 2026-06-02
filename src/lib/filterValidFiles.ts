import { RawTreeItem } from '@/types/github';
import { BINARY_EXTENSIONS, EXCLUDE_PATTERNS } from './extractionRules';

export function filterValidFiles(tree: RawTreeItem[]) {
  return tree.filter((item) => {
    if (!item.path || !item.sha || item.type !== 'blob') {
      return false;
    }

    const path = item.path.toLowerCase();

    const isExcluded = EXCLUDE_PATTERNS.some((pattern) => path.includes(pattern));

    const isBinary = BINARY_EXTENSIONS.some((ext) => path.endsWith(ext));

    return !isExcluded && !isBinary;
  });
}
