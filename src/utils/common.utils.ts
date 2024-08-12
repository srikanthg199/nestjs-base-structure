import { Repository, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { globalConstants } from '../constants';

interface PaginatedFilterOptions {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export const getPaginatedFilter = (
  repository: Repository<any>,
  options: PaginatedFilterOptions,
) => {
  const {
    sortBy = globalConstants.DEFAULT_SORT_BY,
    sortOrder = globalConstants.DEFAULT_SORT_ORDER,
    page = globalConstants.DEFAULT_PAGE,
    limit = globalConstants.DEFAULT_LIMIT,
  } = options;

  // Calculate skip and take
  const offset = (page - 1) * limit;
  const order: { [key: string]: 'ASC' | 'DESC' } = {
    [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC', // Ensure uppercase
  };
  // Prepare find options
  const findOptions: FindManyOptions<any> = {
    order,
    skip: limit === -1 ? undefined : offset,
    take: limit === -1 ? undefined : limit,
  };

  return findOptions;
};
