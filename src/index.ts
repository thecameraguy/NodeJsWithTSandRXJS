import { IRoutesManager } from './routes/routesManager';
import { ExpressRoutesManager } from './routes/expressRoutesManager';
import { BuildingsExpressRoutes } from './routes/buildings/buildingsExpressRoutes';
import { DAOBundle } from './models/dataAccessObjects/DAOBundle';
import { MongooseCityDAO } from './models/dataAccessObjects/mongooseCityDAO';
import { MongooseBuildingDAO } from './models/dataAccessObjects/mongooseBuildingDAO';

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
    }
}

Main.main();