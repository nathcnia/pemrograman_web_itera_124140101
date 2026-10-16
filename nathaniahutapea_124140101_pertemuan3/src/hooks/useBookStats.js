import { useMemo } from 'react';

export function calculateBookStats(books) {
  const stats = books.reduce((result, book) => {
    result[book.status] += 1;
    return result;
  }, { owned: 0, reading: 0, wishlist: 0 });

  const total = books.length;
  const inLibrary = stats.owned + stats.reading;

  return {
    ...stats,
    total,
    inLibrary,
    readingProgress: total === 0 ? 0 : Math.round((stats.reading / total) * 100),
    collectionProgress: total === 0 ? 0 : Math.round((inLibrary / total) * 100),
  };
}

export default function useBookStats(books) {
  return useMemo(() => calculateBookStats(books), [books]);
}
