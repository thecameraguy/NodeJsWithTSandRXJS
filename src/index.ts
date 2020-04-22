import { IRoutesManager } from './routes/routesManager';
import { ExpressRoutesManager } from './routes/expressRoutesManager';
import { BuildingsExpressRoutes } from './routes/buildings/buildingsExpressRoutes';
import { DAOBundle } from './models/dataAccessObjects/DAOBundle';
import { MongooseCityDAO } from './models/dataAccessObjects/mongooseCityDAO';
import { MongooseBuildingDAO } from './models/dataAccessObjects/mongooseBuildingDAO';
import { IDatabaseController } from './database/databaseController';
import { MongooseDBController } from './database/mongooseDBController';

const Mongoose = require('mongoose');
const mongoDB = 'theDBURL';
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
        databaseController
            .connect(process.env.SANDBOX_DB_ADDRESS, {})
            .subscribe(
                (notUsed: any) => {
                    // TODO Abstract out web server controller like how DB controller is abstracted out
                    const port = process.env.PORT || 3000;
                    app.listen(port, () => {
                        console.log(`Example app listening on port ${port}!`);
                    });
                },
                (error: any) => {
                    console.error(error);
                }
            );
    }
}

Main.main();