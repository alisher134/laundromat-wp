export type ReviewKey = 'review-1' | 'review-2' | 'review-3';

export const REVIEW_KEYS: ReviewKey[] = ['review-1', 'review-2', 'review-3'];

export interface ReviewData {
  key: ReviewKey;
  order: number;
}

export const REVIEWS_DATA: ReviewData[] = [
  { key: 'review-1', order: 1 },
  { key: 'review-2', order: 2 },
  { key: 'review-3', order: 3 },
];
