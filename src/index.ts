import { Observable } from 'rxjs';
import { take, flatMap } from 'rxjs/operators';
import { IRoutesManager } from './routes/routesManager';
import { ExpressRoutesManager } from './routes/expressRoutesManager';
import { BuildingsExpressRoutes } from './routes/buildings/buildingsExpressRoutes';
import { DAOBundle } from './models/dataAccessObjects/DAOBundle';
import { MongooseCityDAO } from './models/dataAccessObjects/mongooseCityDAO';
import { MongooseBuildingDAO } from './models/dataAccessObjects/mongooseBuildingDAO';
import { IDatabaseController } from './database/databaseController';
import { MongooseDBController } from './database/mongooseDBController';
import { IWebServerController } from './webserver/webserverController';
import { ExpressMWController } from './webserver/expressMWController';
import { MongooseUnitDAO } from './models/dataAccessObjects/mongooseUnitDAO';

const express = require('express');
const app = express();
const DEFAULT_PORT: number = 3000;

export class Main {
    public static main() {
        const mongooseDAOBundle: DAOBundle = {
            cityDAO: new MongooseCityDAO(),
            buildingDAO: new MongooseBuildingDAO(),
            unitDAO: new MongooseUnitDAO()
        }

        const routesManager: IRoutesManager = new ExpressRoutesManager();
        routesManager.addRoutes(new BuildingsExpressRoutes('/buildings', mongooseDAOBundle));
        routesManager.buildRoutes(app);


        const databaseController: IDatabaseController = MongooseDBController.instance();
        const webserverController: IWebServerController = new ExpressMWController(app);

        // Connect DB
        databaseController
            .connect(process.env.SANDBOX_DB_ADDRESS, {})
            .pipe(
                // Once DB is connected, unsubscribe
                take(1),
                flatMap((notUsed: any): Observable<any> => {
                    // connect web server and start listening
                    return webserverController.connect(Number(process.env.PORT || DEFAULT_PORT), {});
                }),
                // Once web server is connected, unsubscribe
                take(1)
            )
            .subscribe(
                (port: any) => {
                    console.log(`Example app listening on port ${port}!`);
                },
                (error: any) => {
                    console.error(error);
                }
            );
    }
}

Main.main();