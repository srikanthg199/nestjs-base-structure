import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.status';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.TODO, // default status
    });

    await this.save(task);
    return task;
  }

  async getTaskById(taskId: string): Promise<Task> {
    return await this.findOne({ where: { id: taskId } });
  }
}
