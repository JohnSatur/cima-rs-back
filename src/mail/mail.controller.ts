import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('welcome')
  async sendWelcome(@Body() data: { email: string; name: string }) {
    return this.mailService.sendWelcomeEmail(data.email, data.name);
  }

  @Post('contact')
  async sendContact(
    @Body() data: { name: string; email: string; message: string },
  ) {
    return this.mailService.sendContactEmail(process.env.ADMIN_EMAIL, data);
  }
}
