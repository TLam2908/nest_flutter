import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';

import { users } from '@prisma/client';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard) // Use the LocalAuthGuard to protect this route
  async login(
    @CurrentUser() user: users,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginUser = await this.authService.login(user, response); // Call the login method from AuthService to provide a pair of tokens
    return {
      message: 'Login successful',
      user: loginUser,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: users,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user, response); // Call the logout method from AuthService to remove the tokens
    return {
      message: 'Logout successful',
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @CurrentUser() user: users,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshUser = await this.authService.login(user, response); // Call the login method from AuthService provide new pair of tokens
    return {
      message: 'Refresh token successful',
      user: refreshUser, 
    }
  }
}
