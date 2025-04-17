import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private prismaService: PrismaService) {}

  async createTodo(data:CreateTodoDto) {
    try {
      const todo = await this.prismaService.todos.create({
        data: {
          ...data,
        },
      })
      return todo;
    } catch (error) {
      console.error('Error creating todo:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during todo creation
    }
  } 

  async getAllTodos() {
    try {
      const todos = await this.prismaService.todos.findMany();
      return todos;
    } catch (error) {
      console.error('Error retrieving todos:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during todo retrieval
    }
  }

  async getTodo(query: Prisma.todosWhereInput) {
    try {
      const todo = await this.prismaService.todos.findFirstOrThrow({
        where: query,
      })
      if (!todo) {
        throw new NotFoundException('Todo not found');
      }
      return todo;
    } catch (error) {
      console.error('Error retrieving todo:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during todo retrieval
    }
  }

  async updateTodo(query: Prisma.todosWhereUniqueInput, data: UpdateTodoDto) {
    try {
      const todo = await this.prismaService.todos.update({
        where: query,
        data: data
      })
      return todo;
    } catch (error) {
      console.error('Error updating todo:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during todo update
    }
  }

  async deleteTodo(query: Prisma.todosWhereUniqueInput) {
    try {
      const todo = await this.prismaService.todos.delete({
        where: query,
      })
    } catch (error) {
      console.error('Error deleting todo:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during todo deletion
    }
  }
}
