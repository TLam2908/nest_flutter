import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { users } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserDto, @Res() response: Response) {
    const user = await this.usersService.createUser(request);
    return response.status(201).json({
      message: 'User created successfully',
      user,
    })
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  async getUsers(@CurrentUser() user: users, @Res() response: Response) {
    const users = await this.usersService.getUsers()
    return response.status(200).json({
      message: 'Users retrieved successfully',
      users,
    })
  }
}
