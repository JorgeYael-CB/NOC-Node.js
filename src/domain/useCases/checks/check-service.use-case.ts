import { LogEntity, LogEntityOptions, LogServerityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';


interface CheckServiceUseCase{
    execute: (url:string) => Promise<boolean>;
}

type SuccesCallback = () => void;
type ErrorCallback = (result: string) => void;


export class CheckService implements CheckServiceUseCase{

    constructor(
        private readonly logRepository: LogRepository,
        private readonly succesCallback: SuccesCallback,
        private readonly errorCallback: ErrorCallback,
    ){}

    async execute( url:string ):Promise<boolean>{

        try {
            const req = await fetch( url );
            if( !req.ok ) throw new Error('Error on Check Service');

            const logData: LogEntityOptions = {
                message: `Service: ${url} working`,
                level: LogServerityLevel.low,
                origin: "check-service.use-case.ts",
            }

            const log = new LogEntity( logData );

            this.logRepository.saveLog( log );
            this.succesCallback();
            return true;
        } catch (error) {
            const errorString = `${error} - ${url} is not ok`;

            const logDataError: LogEntityOptions = {
                message: `Service: ${url} is not ok`,
                level: LogServerityLevel.high,
                origin: "check-service.use-case.ts",
            }

            const log = new LogEntity( logDataError );
            this.logRepository.saveLog( log );

            this.errorCallback(errorString);
            return false;
        }
    }

}

