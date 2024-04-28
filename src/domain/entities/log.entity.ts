import { error } from "console";


export enum LogServerityLevel {
    low = "low",
    medium = "medium",
    high = "high",
}


export interface LogEntityOptions{
    message: string,
    level: LogServerityLevel,
    origin: string,
    createAt?: Date;
}


export class LogEntity {

    public level:LogServerityLevel;
    public message: string;
    public createAt?: Date;
    public origin: string;

    constructor( {message, level, origin, createAt = new Date()}:LogEntityOptions ){
        this.message = message;
        this.level = level;
        this.origin = origin;
        this.createAt = createAt;
    }

    static fromJson = (json:string):LogEntity => {
        json = (json === '') ? '{}' : json;

        const {message, level, createAt, origin} = JSON.parse( json );

        const log = new LogEntity({
            message,
            level,
            createAt,
            origin,
        });

        return log;
    }

    static fromobject = (obj: { [key: string]:any }):LogEntity => {
        const {message, origin, level, createAt} = obj;

        const log = new LogEntity({
            message,
            origin,
            level,
            createAt
        });

        return log;
    }

}

