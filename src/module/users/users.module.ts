import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/module/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Xuất UsersService để các module khác có thể sử dụng
})
export class UsersModule {}
