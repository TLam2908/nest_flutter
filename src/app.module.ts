import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './module/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';

import { UsersController } from './module/users/users.controller';
import { AuthModule } from './module/auth/auth.module';
import { TodosModule } from './module/todos/todos.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UsersModule, AuthModule, TodosModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
