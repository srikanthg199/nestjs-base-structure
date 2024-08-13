import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginatedFilterOptions } from '../interfaces';
import { TasksService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('tasks')
@UseGuards(AuthGuard())
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

  @Patch(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateData: Partial<Task>,
  ): Promise<unknown> {
    await this.tasksService.updateTask(taskId, updateData);
    return { message: 'Task updated successfully' };
  }
}
