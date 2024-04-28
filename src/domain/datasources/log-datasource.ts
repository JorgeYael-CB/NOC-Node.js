import { LogEntity, LogServerityLevel } from '../entities/log.entity';


export abstract class LogDataSource {

    abstract saveLog( log:LogEntity ): Promise<void>;
    abstract getLogs( severityLevel: LogServerityLevel ): Promise<LogEntity[]>;

}

