import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
