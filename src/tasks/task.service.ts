import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { PaginatedFilterOptions } from '../interfaces';
import { getPaginatedFilter } from '../utils/common.utils';
import { TaskStatus } from './task.status';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = {
      title,
      description,
      status: TaskStatus.TODO, // default status
    };
    return await this.tasksRepository.createTask(task);
  }
  async getTask(taskId: string): Promise<Task> {
    const filter = { where: { id: taskId } };
    const task = await this.tasksRepository.getTask(filter);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
  async getTasks(
    options: PaginatedFilterOptions & { status: string },
  ): Promise<Task[]> {
    const { status, search, ...paginationOptions } = options;
    // const searchableFields = ['title', 'description'];
    const { order, skip, take } = getPaginatedFilter(
      this.tasksRepository,
      paginationOptions,
    );
    const query = this.tasksRepository.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }
    if (search) {
      query.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }
    // Apply pagination and sorting
    query.skip(skip).take(take);
    // Apply sorting with type assertion
    Object.entries(order).forEach(([field, direction]) => {
      query.addOrderBy(`task.${field}`, direction as 'ASC' | 'DESC'); // Type assertion here
    });
    // Get paginated results
    const tasks = await query.getMany();
    return tasks;
  }
  async deleteTask(taskId: string): Promise<void> {
    const filter = { id: taskId };
    await this.tasksRepository.deleteTask(filter);
  }

  async updateTask(taskId: string, updateData: Partial<Task>): Promise<void> {
    const filter = { id: taskId };
    await this.tasksRepository.updateTask(filter, updateData);
  }
}
