import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task.status';
import { PaginatedFilterOptions } from '../interfaces';
import { getPaginatedFilter } from '../utils/common.utils';
import { FindOptionsWhereProperty, ILike } from 'typeorm';

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
    const searchableFields = ['title', 'description'];
    let { where, order, skip, take } = getPaginatedFilter(
      this.tasksRepository,
      paginationOptions,
    );
    // Apply entity-specific filters
    if (status) {
      // Ensure whereCondition is an array if search filters are used
      where = {
        ...where,
        status: ILike(status), // Apply ILike for case-insensitive search
      };
    }
    // if (search) {
    // }
    const tasks = await this.tasksRepository.getTasks({
      where,
      order,
      take,
      skip,
    });
    return tasks;
  }
  async deleteTask(taskId: string): Promise<unknown> {
    return await this.tasksRepository.deleteTask(taskId);
  }
}
