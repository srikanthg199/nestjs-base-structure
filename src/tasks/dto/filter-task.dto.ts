import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.status';

export class GetTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
  @IsOptional()
  @IsString()
  search?: string;
}
