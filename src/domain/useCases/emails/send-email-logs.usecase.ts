import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogServerityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";



interface SendLogEmailUseCase {
    execute: (to: string | string[]) => Promise<boolean>;
}


export class SendEmailLogs implements SendLogEmailUseCase {

    constructor(
        private readonly emailService: EmailService,
        private readonly logRepository: LogRepository,
    ){}

    async execute(to: string | string[]){

        try {
            const send = await this.emailService.sendEmailWithSystemLogs(to);
            if( !send ) throw new Error('Email was not send');

            const log:LogEntity = {
                message: `Email sent`,
                level: LogServerityLevel.low,
                origin: __filename,
            }

            this.logRepository.saveLog( log );

            return true;
        } catch (error) {

            const log:LogEntity = {
                message: `${error}`,
                level: LogServerityLevel.high,
                origin: __filename,
            }
            this.logRepository.saveLog( log );
            return true
        }

        return true;
    }

}

