export const buildPagination = (page = 1, pageSize = 10): { skip: number; limit: number } => ({
  skip: (page - 1) * pageSize,
  limit: pageSize,
});
