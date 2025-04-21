import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PrismaService } from 'src/module/prisma/prisma.service'; // Import PrismaService
import { Prisma } from '@prisma/client'; // Import Prisma types
import { hashPassword } from '../../utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser(data: CreateUserDto) {
    try {
      const user = await this.prismaService.users.create({
        data: {
          ...data,
          password: await hashPassword(data.password), // Hash the password before saving it to the database
        },
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during user creation
    }
  }

  async getUser(query: Prisma.usersWhereInput) {
    const user = await this.prismaService.users.findFirstOrThrow({
      where: query,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUsers() {
    try {
      const users = await this.prismaService.users.findMany();
      return users;
    } catch (error) {
      console.error('Error retrieving users:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during user retrieval
    }
  }

  async updateUser(query: Prisma.usersWhereUniqueInput, data: UpdateUserDto) {
    try {
      const user = await this.prismaService.users.update({
        where: query,
        data: data,
      });
      console.log(user)
      return user;
    } catch (error) {
      console.error('Error updating user:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message);
    }
  }
}
