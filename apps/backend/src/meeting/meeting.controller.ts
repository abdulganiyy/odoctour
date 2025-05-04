import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards ,Req} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createMeetingDto: Omit<CreateMeetingDto,'userId'>, @Req() req: any) {
    return this.meetingService.create({...createMeetingDto,duration:+createMeetingDto.duration,userId:req.user.userId});
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: any) {
    return this.meetingService.findAll(req.user);
  }

  @Get(':id/bookings')
  findBookings(@Param('id') id: string) {
    return this.meetingService.findBookings(id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingService.update(+id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingService.remove(+id);
  }
}
