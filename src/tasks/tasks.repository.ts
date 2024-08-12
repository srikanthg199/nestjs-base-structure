import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async createTask(data: Partial<Task>): Promise<Task> {
    try {
      const task = this.create(data);
      return await this.save(task); // Use save to persist the task
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async getTask(filter: object): Promise<Task> {
    try {
      return await this.findOne(filter);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Task not found');
    }
  }

  async getTasks(filter: object) {
    try {
      console.log(filter);
      const taskData = await this.find(filter);
      console.log(taskData);
      return taskData;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async deleteTask(taskId: string): Promise<unknown> {
    try {
      return await this.delete({ id: taskId });
    } catch (error) {
      // handle error if task not found or any other issues
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
