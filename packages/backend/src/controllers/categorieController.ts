export function categorizeAndSort(categories: string[]): string[] {
  const categoryCounts: Record<string, number> = {};

  categories.forEach(category => {
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });

  return Object.keys(categoryCounts)
    .sort((a, b) => {
      if (categoryCounts[b] === categoryCounts[a]) {
        return a.localeCompare(b);
      }
      return categoryCounts[b] - categoryCounts[a];
    });
}
