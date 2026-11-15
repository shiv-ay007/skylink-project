export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
export const escapeRegex = (str = '') => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function pagination(query) {
  const page = Math.max(1, Math.min(100000, Number.parseInt(query.page, 10) || 1));
  const limit = Math.max(1, Math.min(100, Number.parseInt(query.limit, 10) || 10));
  return {page, limit, skip: (page - 1) * limit};
}
export function parseId(id) {
  if (!/^[a-f\d]{24}$/i.test(String(id))) throw new AppError('Invalid document id', 400);
  return id;
}
