import { Process, Processor ,OnQueueCompleted, OnQueueActive} from "@nestjs/bull";
import { Job } from "bull";
import { EmailService } from "src/email/email.service";

@Processor('meetingReminder')
class BookingReminder{

    constructor(private emailService:EmailService){

    }

    @Process('doctor-email-reminder')
    async doctormailReminderHandler(job:Job){


        const payload = job.data

        await this.emailService.sendEmail(payload.doctorEmail,"Your Appointment Starts in 30 Minutes",'appointment-reminder',{
            recipientName: `Dr. ${payload.doctorName}`,        
            isDoctor: true,                          
            withName: payload.userName,                   
            appointmentDate: payload.appointmentDate,
            appointmentTime: payload.appointmentTime,
            appointmentLocation: payload.mode,
            meetingLink: payload.location,
            appDomain: payload.appName
          })

        

    }

    @Process('user-email-reminder')
    async userEmailReminderHandler(job:Job){

        const payload = job.data


        await this.emailService.sendEmail(payload.userEmail,'Your Appointment Starts in 30 Minutes','appointment-reminder',{
            recipientName: payload.userName,        
            isDoctor: false,                          
            withName: payload.doctorName,                   
            appointmentDate: payload.appointmentDate,
            appointmentTime: payload.appointmentTime,
            appointmentLocation: payload.mode,
            meetingLink: payload.location,
            appDomain: payload.appName
        });

           

    }

    @OnQueueActive()
    onActive(job: Job) {
    console.log(`Processing job ${job.id}...`);
  }


  @OnQueueCompleted()
  onCompleted(job: Job) {
  console.log(`Job with job id ${job.id} completed...`);
}
}
export default BookingReminder