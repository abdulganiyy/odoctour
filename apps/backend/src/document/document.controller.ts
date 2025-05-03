import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards ,Req} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentSchema } from 'src/yup-schemas/document';
import { AuthGuard } from 'src/auth/auth.guard';

// create(@Body() createMeetingDto: Omit<CreateMeetingDto,'userId'>, @Req() req: any) {
//     return this.meetingService.create({...createMeetingDto,duration:+createMeetingDto.duration,userId:req.user.userId});
//   }

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDocumentDto: DocumentSchema,@Req() req: any) {
    return this.documentService.create({...createDocumentDto,uploadedById:req.user.userId});
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
