import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcriber, SubcriberSchema } from 'src/subcribes/schemas/Subcriber.schema';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';


@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("EMAIL_HOST"),
          secure: false,
          auth: {
            user: configService.get<string>("EMAIL_AUTH_USER"),
            pass: configService.get<string>("EMAIL_AUTH_PASS"),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: Boolean(configService.get<string>("EMAIL_PREVIEW"))
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [
        { name: Subcriber.name, schema: SubcriberSchema },
        { name: Job.name, schema: JobSchema },
      ])
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { }
