import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { S3Service } from 'src/s3/s3.service';
import { UuidService } from 'src/uuid/uuid.service';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService,S3Service,UuidService,PrismaClient,ConfigService],
})
export class DocumentModule {}
