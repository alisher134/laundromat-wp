import { PageItem } from '@/shared/ui/Pagination/model/types';

export const getPageItems = (current: number, total: number, siblingCount: number): PageItem[] => {
  if (total <= 0) return [];

  const firstPage = 1;
  const lastPage = total;
  const startSibling = Math.max(current - siblingCount, firstPage + 1);
  const endSibling = Math.min(current + siblingCount, lastPage - 1);

  const items: PageItem[] = [firstPage];

  if (startSibling > firstPage + 1) {
    items.push('ellipsis');
  }

  for (let page = startSibling; page <= endSibling; page += 1) {
    items.push(page);
  }

  if (endSibling < lastPage - 1) {
    items.push('ellipsis');
  }

  if (lastPage > firstPage) {
    items.push(lastPage);
  }

  return items;
};
