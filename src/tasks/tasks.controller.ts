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
import { GetUser } from '../user/get-user-decorator';
import { User } from '../user/user.entity';
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  async getTasks(
    @Query() query: PaginatedFilterOptions & { status: string },
    @GetUser() user: User,
  ): Promise<Task[]> {
    try {
      return this.tasksService.getTasks(query, user);
    } catch (error) {
      console.log(/e/, error);
      throw new InternalServerErrorException();
    }
  }

  @Get(':taskId')
  async getTask(
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTask(taskId, user);
  }
  @Delete(':taskId')
  async deleteTask(
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ): Promise<unknown> {
    await this.tasksService.deleteTask(taskId, user);
    return { message: 'Task deleted successfully' };
  }

  @Patch(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateData: Partial<Task>,
    @GetUser() user: User,
  ): Promise<unknown> {
    await this.tasksService.updateTask(taskId, updateData, user);
    return { message: 'Task updated successfully' };
  }
}
