import { IRoutesManager } from './routes/routesManager';
import { ExpressRoutesManager } from './routes/expressRoutesManager';
import { BuildingsExpressRoutes } from './routes/buildings/buildingsExpressRoutes';
import { DAOBundle } from './models/dataAccessObjects/DAOBundle';
import { MongooseCityDAO } from './models/dataAccessObjects/mongooseCityDAO';
import { MongooseBuildingDAO } from './models/dataAccessObjects/mongooseBuildingDAO';

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
    }
}

// TODO take out the DB connection to its own class. - DB Manager.
Mongoose.Promise = global.Promise;
const db = Mongoose.connection;

db.on('open', function () {
    console.log('connected to mongodb');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`);
    })
});
db.on('error', console.error.bind(console, 'MongoDB connection error'));

Mongoose.connect(mongoDB);

Main.main();