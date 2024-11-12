export function categorizeAndSort(categories: string[]): string[] {
  const categoryCounts: Record<string, number> = {};
  
  const similarity = (s1: string, s2: string): number => {
    const len = Math.max(s1.length, s2.length);
    let diff = 0;
    for (let i = 0; i < len; i++) {
      if (s1[i] !== s2[i]) diff++;
    }
    return 1 - diff / len;
  };
  
  const mergeSimilarCategories = (categories: string[]): string[] => {
    const mergedCategories: string[] = [];
    const seen: Set<string> = new Set();

    for (let i = 0; i < categories.length; i++) {
      const currentCategory = categories[i];
      if (seen.has(currentCategory)) continue;

      let mergedCategory = currentCategory;
      seen.add(currentCategory);

      for (let j = i + 1; j < categories.length; j++) {
        const nextCategory = categories[j];

        if (similarity(currentCategory, nextCategory) > 0.8) {
          mergedCategory = 
              currentCategory.length > nextCategory.length ? 
                currentCategory : nextCategory;
          seen.add(nextCategory);
        }
      }
      mergedCategories.push(mergedCategory);
    }

    return mergedCategories;
  };

  mergeSimilarCategories(categories)
    .forEach(category => {
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
