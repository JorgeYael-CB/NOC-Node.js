import { LogModel } from "../../data/mongo";
import { LogDataSource } from "../../domain/datasources/log-datasource";
import { LogEntity, LogServerityLevel } from "../../domain/entities/log.entity";



export class MongoLogDataSource implements LogDataSource{

    async saveLog(log: LogEntity): Promise<void> {
        const newLog = await LogModel.create(log); // crea el log y lo guarda

        console.log('Mongo log created ',newLog.id);
    }

    async getLogs(severityLevel: LogServerityLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({
            level: severityLevel
        });

        // Ambos hacen lo mismo
        return logs.map( LogEntity.fromobject );
        //? return logs.map( mongoLog => LogEntity.fromobject(mongoLog) );
    }

}

