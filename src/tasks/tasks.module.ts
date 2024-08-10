import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // Note: not all imports are modules
  controllers: [TasksController],
  providers: [TasksService, TasksRepository], // Note:not all providers are services
})
export class TasksModule {}
