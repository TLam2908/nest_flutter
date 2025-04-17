import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

import { Response } from 'express';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async createTodo(@Body() request: CreateTodoDto, @Res() response: Response) {
    const todo = await this.todosService.createTodo(request)
    return response.status(201).json({
      message: 'Todo created successfully',
      todo,
    })
  }

  @Get()
  async getAllTodos(@Res() response: Response) {
    const todos = await this.todosService.getAllTodos()
    return response.status(201).json({
      message: 'Todos retrieved successfully',
      todos,
    })
  }

  @Get(':id')
  async getTodo(@Param('id') id: string, @Res() response: Response) {
    const todo = await this.todosService.getTodo({ id: Number(id) })
    return response.status(201).json({
      message: 'Todo retrieved successfully',
      todo,
    })
  }

  @Patch(':id')
  async updateTodo(@Param('id') id: string, @Body() request: UpdateTodoDto, @Res() response: Response) {
    const todo = await this.todosService.updateTodo({ id: Number(id)}, request)
    return response.status(201).json({
      message: 'Todo updated successfully',
      todo,
    })
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string, @Res() response: Response) {
    const todo = await this.todosService.deleteTodo({ id: Number(id) })
    return response.status(201).json({
      message: 'Todo deleted successfully',
      todo,
    })
  }
}
