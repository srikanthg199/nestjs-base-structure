import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private authService: UserService) {}
  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    await this.authService.createUser(createUserDto);
    return { message: 'User created' };
  }

  @Post('/signin')
  async signIn(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; accessToken?: string }> {
    return await this.authService.signIn(createUserDto);
  }

  @Get('')
  async getUsers(): Promise<User[]> {
    return this.authService.getUsers();
  }
  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return this.authService.getUser(userId);
  }
}
