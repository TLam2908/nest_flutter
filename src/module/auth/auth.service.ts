import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express'; // Import Response type from express
import { users } from '@prisma/client'; // Import the users type from Prisma client
import { TokenPayload } from './token-payload.interface';

import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { hashPassword } from 'src/utils/bcrypt'; // Import utility function to hash passwords
import { comparePassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Inject UsersService to access user-related methods
    private readonly configService: ConfigService, // Inject ConfigService to access configuration settings
    private readonly jwtService: JwtService, // Inject JwtService to handle JWT operations
  ) {}

  async login(user: users, response: Response) {
    const expriesAccessToken = new Date();
    expriesAccessToken.setMilliseconds(
      expriesAccessToken.getTime() +
        parseInt(this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION')), // Set the expiration time for the access token
    );

    const expriesRefreshToken = new Date();
    expriesRefreshToken.setMilliseconds(
      expriesRefreshToken.getTime() +
        parseInt(this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION')), // Set the expiration time for the refresh token
    );

    const tokenPayload: TokenPayload = {
      userId: user.id.toString(),
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'), // Sign the access token with the secret key
      expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION')}ms`, // Set the expiration time for the access token
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'), // Sign the refresh token with the secret key
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION')}ms`, // Set the expiration time for the refresh token
    });

    // Update the user with the new refresh token in the database
    await this.usersService.updateUser(
      { id: user.id },
      { refreshToken: await hashPassword(refreshToken) },
    ); // Hash the refresh token before saving it to the database

    response.cookie('Authentication', accessToken, {
      httpOnly: true, // Set the cookie to be HTTP-only
      secure: this.configService.get('NODE_ENV') === 'production', // Set the cookie to be secure (only sent over HTTPS)
      expires: expriesAccessToken,
    });

    // Refresh token in cookie is not hash!!
    response.cookie('Refresh', refreshToken, {
      httpOnly: true, // Set the cookie to be HTTP-only
      secure: this.configService.get('NODE_ENV') === 'production', // Set the cookie to be secure (only sent over HTTPS)
      expires: expriesRefreshToken, // Set the expiration time for the refresh token cookie
    });

    return user;
  }

  async logout(user: users, response: Response) {

    await this.usersService.updateUser(
        { id: user.id }, // Find the user by ID
        { refreshToken: null }, // Set the refresh token to null
      );
    
      // Clear the cookies
      response.clearCookie('Authentication', {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
      });
      response.clearCookie('Refresh', {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
      });
    return { message: 'Logout successful' }; // Return a success message
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await comparePassword(password, user.password); // Compare the provided password with the stored hashed password
      if (!authenticated) {
        throw new UnauthorizedException(''); // If the password does not match, throw an UnauthorizedException
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials'); // If any error occurs (e.g., user not found), throw an UnauthorizedException
    }
  }

  async verifyUserRefreshToken(refreshToken: string, userId: number) {
    try {
      const user = await this.usersService.getUser({ id: userId }); // Get the user from the database using the provided userId
      const authenticatedRefreshToken = await comparePassword(
        refreshToken,
        user.refreshToken,
      );
      if (!authenticatedRefreshToken) {
        throw new UnauthorizedException(''); // If the refresh token does not match, throw an UnauthorizedException
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Refresh token is not valid'); // If any error occurs (e.g., user not found), throw an UnauthorizedException
    }
  }
}
