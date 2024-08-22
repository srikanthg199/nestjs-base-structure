import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { generateHash, validatePassword } from '../utils';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { password, email } = createUserDto;
    const user = await this.userRepository.getUser({ where: { email } });
    if (user) {
      throw new ConflictException('Email already exists');
    }
    const hashPassword = await generateHash(password);
    createUserDto.password = hashPassword;
    await this.userRepository.createUser(createUserDto);
  }

  async signIn(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; accessToken?: string }> {
    const { email, password } = createUserDto;
    const user = await this.userRepository.getUser({ where: { email } });
    if (user && (await validatePassword(password, user.password))) {
      const payload: JwtPayload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      return { message: 'User signed in successfully', accessToken };
    } else {
      return { message: 'Invalid credentials' };
    }
  }

  async getUser(userId: string): Promise<User | undefined> {
    return await this.userRepository.getUser({
      where: { id: userId },
      relations: ['task'],
    });
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.task', 'task')
      .select([
        'user.id',
        'user.email',
        // Optionally include other user fields if needed
        'task.id',
        'task.title',
        'task.status',
        // Exclude 'task.description'
      ])
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async getUsers(): Promise<User[] | undefined> {
    return await this.userRepository.getUsers({});
  }
}
