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
      const taskData = await this.find(filter);
      console.log(taskData);
      return taskData;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async deleteTask(filter: object): Promise<unknown> {
    try {
      return await this.delete(filter);
    } catch (error) {
      // handle error if task not found or any other issues
      throw new InternalServerErrorException('Failed to delete task');
    }
  }

  async updateTask(filter: object, updateData: object): Promise<unknown> {
    try {
      return await this.update(filter, updateData);
    } catch (error) {
      // handle error if task not found or any other issues
      throw new InternalServerErrorException('Failed to update task');
    }
  }
}
