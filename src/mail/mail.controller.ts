import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber, SubcriberDocument } from 'src/subcribes/schemas/Subcriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subcriber.name) private subcriberModel: SoftDeleteModel<SubcriberDocument>,
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>
  ) { }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // testCron() {
  //   console.log(".....OK OK");
    
  // }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron("0 10 0 * * 0") //0h10'Am every sunday
  async handleTestEmail() {
    const subscribers = await this.subcriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills.length) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        })
        await this.mailerService.sendMail({
          to: "hoanghaibk93@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Conﬁrm your Email',
          // html: '<b>welcome bla bla</b>', // HTML body content
          template: "job",
          context: {
            receiver: subs.name,
            jobs: jobs
          }
        });
      }
    }
  }
}
