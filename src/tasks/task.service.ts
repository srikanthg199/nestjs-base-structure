import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { PaginatedFilterOptions } from '../interfaces';
import { getPaginatedFilter } from '../utils/common.utils';
import { TaskStatus } from './task.status';
import { User } from '../user/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = {
      title,
      description,
      status: TaskStatus.TODO, // default status
      user: user,
    };
    return await this.tasksRepository.createTask(task);
  }
  async getTask(taskId: string, user: User): Promise<Task> {
    const filter = { where: { id: taskId, user } };
    const task = await this.tasksRepository.getTask(filter);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
  async getTasks(
    options: PaginatedFilterOptions & { status: string },
    user: User,
  ): Promise<Task[]> {
    const { status, search, ...paginationOptions } = options;
    // const searchableFields = ['title', 'description'];
    const { order, skip, take } = getPaginatedFilter(
      this.tasksRepository,
      paginationOptions,
    );
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user }); // Apply user filter
    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }
    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
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

  async deleteTask(taskId: string, user: User): Promise<void> {
    await this.getTask(taskId, user); // Ensure task exists before deleting it
    const filter = { id: taskId };
    await this.tasksRepository.deleteTask(filter);
  }

  async updateTask(
    taskId: string,
    updateData: Partial<Task>,
    user: User,
  ): Promise<void> {
    await this.getTask(taskId, user);
    const filter = { id: taskId, user };
    await this.tasksRepository.updateTask(filter, updateData);
  }
}
