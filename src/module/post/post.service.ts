import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async createPost(data: CreatePostDto) {
    try {
      const post = await this.prismaService.posts.create({
        data: {
          ...data,
        },
      });
      return post;
    } catch (error) {
      console.error('Error creating post:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during post creation
    }
  }

  async getAllPosts() {
    try {
      const posts = await this.prismaService.posts.findMany();
      return posts
    } catch (error) {
      console.error('Error retrieving posts:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during post retrieval
    }
  }

  async getPost(query: Prisma.postsWhereInput) {
    try {
      const post = await this.prismaService.posts.findFirstOrThrow({
        where: query,
      });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return post;
    } catch (error) {
      console.error('Error retrieving post:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during post retrieval
    }
  }

  async updatePost(query: Prisma.postsWhereUniqueInput, data: UpdatePostDto) {
    try {
      const post = await this.prismaService.posts.update({
        where: query,
        data: data,
      });
      return post;
    } catch (error) {
      console.error('Error updating post:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during post update
    }
  }

  async deletePost(query: Prisma.postsWhereUniqueInput) {
    try {
      const post = await this.prismaService.posts.delete({
        where: query,
      });
      return post;
    } catch (error) {
      console.error('Error deleting post:', error); // Log the error for debugging purposes
      throw new InternalServerErrorException(error.message); // Handle any errors that occur during post deletion
    }
  }
}
