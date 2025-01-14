export const applyFilters = (entries, filters) => {
  return entries.filter(entry => {
    if (filters.dateFrom && entry.date < filters.dateFrom) return false;
    if (filters.dateTo && entry.date > filters.dateTo) return false;
    if (filters.client && entry.client !== filters.client) return false;
    if (filters.consultant && entry.consultant !== filters.consultant) return false;
    if (filters.project && entry.project !== filters.project) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return entry.description.toLowerCase().includes(searchLower) ||
             entry.consultant.toLowerCase().includes(searchLower) ||
             entry.client.toLowerCase().includes(searchLower);
    }
    return true;
  });
};

export const getUniqueValues = (entries, field) => {
  return [...new Set(entries.map(entry => entry[field]))].filter(Boolean);
};
