import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from '../constants/auth.constants';
import { JwtStrategy } from './jwt.stratagy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: authConstants.jwtSecret,
      signOptions: { expiresIn: authConstants.expireIn },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, UserRepository, JwtStrategy],
  controllers: [UserController],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
