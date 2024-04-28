import fs from 'fs';
import { LogDataSource } from "../../domain/datasources/log-datasource";
import { LogEntity, LogServerityLevel } from "../../domain/entities/log.entity";



export class FileSystemDataSource implements LogDataSource {

    private readonly logPath        = 'logs/';
    private readonly allLogsPath    = 'logs/logs-all.log';
    private readonly mediumLogsPath = 'logs/logs-mediums.log';
    private readonly highLogsPath   = 'logs/logs-high.log';

    constructor(){
        this.createLogsFile();
    }


    private createLogsFile = () => {
        if( !fs.existsSync(this.logPath) ) {
            fs.mkdirSync( this.logPath);
        };

        [
            this.allLogsPath,
            this.mediumLogsPath,
            this.highLogsPath,
        ].forEach( path => {
            if( !fs.existsSync( path )){
                fs.writeFileSync( path, '' );
            }
        })
    }


    async saveLog( newLog: LogEntity): Promise<void> {
        const logAsJson = `${JSON.stringify( newLog )} \n`;

        fs.appendFileSync( this.allLogsPath, logAsJson);

        if( newLog.level === LogServerityLevel.low ) return;

        if( newLog.level === LogServerityLevel.medium ){
            fs.appendFileSync( this.mediumLogsPath, logAsJson );
        } else{
            fs.appendFileSync( this.highLogsPath, logAsJson );
        }
    }

    private getLogsFromFile = (path:string):LogEntity[] => {
        const content = fs.readFileSync( path, 'utf-8' );
        if( content === '' ) return [];

        const logs = content.split('\n').map( LogEntity.fromJson );
        // const logs = content.split('\n').map( log => LogEntity.fromJson(log) );

        return logs;
    }

    async getLogs(severityLevel: LogServerityLevel): Promise<LogEntity[]> {

        switch (severityLevel) {
            case LogServerityLevel.low:
                return this.getLogsFromFile(this.allLogsPath);
            case LogServerityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath);
            case LogServerityLevel.high:
                return this.getLogsFromFile(this.highLogsPath);

            default:
                throw new Error(`${severityLevel} not implemented`);
        }
    }
}
