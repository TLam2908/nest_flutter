import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Xuất PrismaService để các module khác có thể sử dụng
})
export class PrismaModule {}
