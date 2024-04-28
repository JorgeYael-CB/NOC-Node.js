import { Envs } from "./config/plugins/envs.plugin";
import {LogModel, MongoDataBase} from './data/mongo';
import { Server } from "./presentation/server";




(async () => {

    main();

})()


async function main() {

    await MongoDataBase.connect({
        mongoUrl: Envs.MONGO_URL,
        dbName: Envs.MONGO_DB_NAME
    });


    // //todo:  crear un colección = tables, documento = registro
    // const newLog = await LogModel.create({
    //     message: "testMessage desde Mongo",
    //     origin: __filename,
    //     level: 'low'
    // });
    // //todo:  Lo guardamos
    // await newLog.save();
    // console.log( newLog );
    //todo:  Obtener los datos de la base de datos MONGO
    // const logs = await LogModel.find();
    // console.log(logs);


    Server.start();
}
