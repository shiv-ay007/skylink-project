export const escapeRegex = (input='') => String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const paging = (query) => ({
  page: Math.max(1, Number.parseInt(query.page, 10) || 1),
  limit: Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 10)),
});
export const pagedResult = (items, total, page, limit) => ({
  items, pagination: { page, limit, total, pages: Math.ceil(total / limit) }
});
