import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    try {
      const user = this.create(createUserDto);
      await this.save(user); // Use save to persist the user
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async getUser(filter: object): Promise<User> {
    try {
      return await this.findOne(filter);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('user not found');
    }
  }

  async getUsers(filter: object) {
    try {
      return await this.find(filter);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async deleteUser(filter: object): Promise<unknown> {
    try {
      return await this.delete(filter);
    } catch (error) {
      // handle error if user not found or any other issues
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateUser(filter: object, updateData: object): Promise<unknown> {
    try {
      return await this.update(filter, updateData);
    } catch (error) {
      // handle error if user not found or any other issues
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
