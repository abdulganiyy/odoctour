import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingDto } from './create-meeting.dto';

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {
    availability:Record<'string','string'>[]
}
