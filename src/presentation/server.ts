import { Envs } from "../config/plugins/envs.plugin";
import { LogServerityLevel } from "../domain/entities/log.entity";
import { CheckService } from "../domain/useCases/checks/check-service.use-case";
import { SendEmailLogs } from "../domain/useCases/emails/send-email-logs.usecase";
import { FileSystemDataSource } from "../infrastucture/datasources/file-system.datasource";
import { MongoLogDataSource } from "../infrastucture/datasources/mongo-log.datasource";
import { LogRepositoryImpl } from "../infrastucture/repositories/log.repository.impl";
import { CronService } from "./cron/con-service";
import { EmailService } from "./email/email.service";


const logRepository = new LogRepositoryImpl(
    new FileSystemDataSource()
    // new MongoLogDataSource(),
)


const emailService = new EmailService(  );


export class Server {

    constructor(){};

    public static async start(){
        // const url = 'https:///localhost:3000';
        const url = 'https:///google.com';


        // todo: Mandar email
        // new SendEmailLogs( emailService, logRepository ).execute( ['jycbpapulino@gmail.com', 'thor462442@gmail.com'] );
        // emailService.sendEmailWithSystemLogs(['jycbpapulino@gmail.com', 'thor462442@gmail.com']);


        // emailService.sendEmail({
        //     to: "hor462442@gmail.com",
        //     subject: "Logs de sistema",
        //     htmlBody: `
        //         <h3>Logs de sistema NOC</h3>
        //         <p>Mensaje de prueba</p>
        //         <a>Ver logs adjuntos</a>
        //     `
        // });

        function callbackCron() {
            new CheckService(
                logRepository,
                () => console.log(`${url} is ok`),
                (error) => console.log(`${error}`)
            )
            .execute(url);
        }
        // CronService.createJob('*/5 * * * * *', callbackCron);

        const lgos = await logRepository.getLogs(LogServerityLevel.medium);
        console.log(lgos);
    };

}