import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Response } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createTodo(@Body() request: CreatePostDto, @Res() response: Response) {
    const post = await this.postService.createPost(request)
    return response.status(201).json({
      message: 'Post created successfully',
      post,
    })
  }

  @Get()
  async getAllTodos(@Res() response: Response) {
    const posts = await this.postService.getAllPosts()
    return response.status(201).json({
      message: 'Posts retrieved successfully',
      posts,
    })
  }

  @Get(':id')
  async getTodo(@Param('id') id: string, @Res() response: Response) {
    const post = await this.postService.getPost({ id: Number(id) })
    return response.status(201).json({
      message: 'Post retrieved successfully',
      post,
    })
  }

  @Patch(':id')
  async updateTodo(@Param('id') id: string, @Body() request: UpdatePostDto, @Res() response: Response) {
    const post = await this.postService.updatePost({ id: Number(id)}, request)
    return response.status(201).json({
      message: 'Post updated successfully',
      post,
    })
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string, @Res() response: Response) {
    const post = await this.postService.deletePost({ id: Number(id) })
    return response.status(201).json({
      message: 'Post deleted successfully',
      post,
    })
  }
}
