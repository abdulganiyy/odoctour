import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { UuidService } from 'src/uuid/uuid.service';
import { DocumentSchema } from 'src/yup-schemas/document';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaClient,
    private s3Service: S3Service,
    private uuidService: UuidService,
  ) {}


  async create(document: any) {
    const { filecontents,uploadedById, ...rest } = document;
    const filename = `${this.uuidService.generateUuid()}-${rest.filename}`;

    const url = await this.s3Service.uploadFile(filecontents, filename, rest.mimetype);

    return this.prisma.document.create({data:{filename,type:rest.mimetype,url,mimetype:rest.mimetype,uploadedBy:{connect:{id:uploadedById}}}} as any)

    
  }

  async get(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });
    if (!document) {
      throw new Error('Document not found');
    }

    // const filecontents = await this.s3Service.downloadFile(
    //   document.filename,
    // );
    // return { ...document, filecontents };

    return document
  }

  findAll() {
    return `This action returns all document`
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
