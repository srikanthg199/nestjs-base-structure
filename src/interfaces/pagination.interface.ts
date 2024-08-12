export interface PaginatedFilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
