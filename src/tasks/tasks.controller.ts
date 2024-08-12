import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginatedFilterOptions } from '../interfaces';
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  async getTasks(
    @Query() query: PaginatedFilterOptions & { status: string },
  ): Promise<Task[]> {
    console.log(/q/, query);
    try {
      return this.tasksService.getTasks(query);
    } catch (error) {
      console.log(/e/, error);
      throw new InternalServerErrorException();
    }
  }

  @Get(':taskId')
  async getTask(@Param('taskId') taskId: string): Promise<Task> {
    return this.tasksService.getTask(taskId);
  }
  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string): Promise<unknown> {
    await this.tasksService.deleteTask(taskId);
    return { message: 'Task deleted successfully' };
  }
}
