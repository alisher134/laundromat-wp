import { TipCard, CategoryKey, SortOption } from '@/shared/data/types';

export const filterTipsByCategory = (tips: TipCard[], category: CategoryKey): TipCard[] => {
  if (category === 'all') {
    return tips;
  }

  const categoryMap: Record<CategoryKey, string> = {
    all: '',
    tipsAndTricks: 'Tips and tricks',
    usefulResources: 'Useful resources',
    companyNews: 'Company news',
  };

  return tips.filter((tip) => tip.category === categoryMap[category]);
};

export const sortTips = (tips: TipCard[], sortBy: SortOption): TipCard[] => {
  const sorted = [...tips];

  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
};
