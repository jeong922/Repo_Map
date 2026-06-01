import { RawTreeItem } from '@/types/github';
import { getPriority } from './extractionRules';

export function sortFilesByPriority(files: RawTreeItem[]) {
  return [...files].sort((a, b) => {
    const priorityA = getPriority(a.path);
    const priorityB = getPriority(b.path);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return a.path.localeCompare(b.path);
  });
}
