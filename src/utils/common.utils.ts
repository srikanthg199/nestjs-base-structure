import {
  Repository,
  FindOptionsWhere,
  FindOptionsOrder,
  FindManyOptions,
  ILike,
} from 'typeorm';
import { globalConstants } from '../constants';
import { PaginatedFilterOptions } from '../interfaces';

export const getPaginatedFilter = (
  repository: Repository<any>,
  options: PaginatedFilterOptions,
) => {
  const {
    search,
    sortBy = globalConstants.DEFAULT_SORT_BY,
    sortOrder = globalConstants.DEFAULT_SORT_ORDER,
    page = globalConstants.DEFAULT_PAGE,
    limit = globalConstants.DEFAULT_LIMIT,
  } = options;
  const offset = (page - 1) * limit;
  const where: FindOptionsWhere<any> = {};

  const order: FindOptionsOrder<any> = {
    [sortBy]: sortOrder,
  };

  const findOptions: FindManyOptions<any> = {
    where,
    order,
    skip: limit === -1 ? undefined : offset,
    take: limit === -1 ? undefined : limit,
  };

  return findOptions;
};
