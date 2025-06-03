import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, context: any) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      return { success: true, message: 'Email enviado correctamente' };
    } catch (error) {
      return { success: false, message: 'Error al enviar el email', error };
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    return this.sendEmail(to, 'Bienvenido a CIMA RS', 'welcome', { name });
  }

  async sendContactEmail(
    to: string,
    data: { name: string; message: string; email: string },
  ) {
    return this.sendEmail(to, 'Nuevo mensaje de contacto', 'contact', data);
  }
}
