import nodemailer from 'nodemailer';
import { Envs } from '../../config/plugins/envs.plugin';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogServerityLevel } from '../../domain/entities/log.entity';


interface SendEmailOptions{
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachments[]
}


interface Attachments{
    fileName: string,
    path: string,
}



export class EmailService {

    private transporter = nodemailer.createTransport({
        service: Envs.MAILER_SERVICE,
        auth: {
            user: Envs.MAILER_EMAIL,
            pass: Envs.MAILER_SECRET_KEY
        }
    });


    constructor(){}


    async sendEmail( options:SendEmailOptions ):Promise<boolean>{
        const {to, subject, htmlBody, attachments = []} = options;


        try {
            const sentInformation = await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments,
            });

            // console.log(sentInformation);
            const log = new LogEntity({
                message: "Email sent",
                level: LogServerityLevel.low,
                origin: __filename,
            });

            return true
        } catch (error) {

            const log = new LogEntity({
                message: `Email not sent - ${error}`,
                level: LogServerityLevel.high,
                origin: __filename,
            });

            return false;
        }
    }


    async sendEmailWithSystemLogs( to: string | string[] ){
        const subject = 'Logs del servidor'
        const htmlBody = `
            <h3>System logs</h3>
            <p>Logs del sistema....</p>
            <p>Ver logs</p>
        `
        const attachments:Attachments[] = [
            {fileName: 'logs-all.log', path: "./logs/logs-all.log"},
            {fileName: 'logs-mediums.log', path: "./logs/logs-mediums.log"},
            {fileName: 'logs-high.log', path: "./logs/logs-high.log"},
        ];

        return this.sendEmail({
            subject,
            htmlBody,
            to,
            attachments,
        })

    }

}
