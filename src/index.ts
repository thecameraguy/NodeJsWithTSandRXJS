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

const express = require('express');
const app = express();

export class Main {
    public static main() {
        const mongooseDAOBundle: DAOBundle = {
            cityDAO: new MongooseCityDAO(),
            buildingDAO: new MongooseBuildingDAO()
        }

        const routesManager: IRoutesManager = new ExpressRoutesManager();
        routesManager.addRoutes(new BuildingsExpressRoutes('/buildings', mongooseDAOBundle));
        routesManager.buildRoutes(app);

        // Connect DB
        const databaseController: IDatabaseController = MongooseDBController.instance();
        const expressMWController: IWebServerController = new ExpressMWController(app);
        databaseController
            .connect(process.env.SANDBOX_DB_ADDRESS, {})
            .pipe(
                take(1),
                flatMap((notUsed: any) => {
                    return expressMWController.connect(Number(process.env.PORT || 3000), {});
                })
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