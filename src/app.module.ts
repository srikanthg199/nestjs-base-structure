import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'admin',
      password: 'admin',
      database: 'nest_base',
      // entities: [Task],
      autoLoadEntities: true,
      synchronize: true, // This line will drop and recreate your database every time you run your application. Replace it with `false` in a production environment.
    }),
  ],
})
export class AppModule {}
