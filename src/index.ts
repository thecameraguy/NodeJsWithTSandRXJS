import { IRoutesManager } from './routes/routesManager';
import { ExpressRoutesManager } from './routes/expressRoutesManager';
import { BuildingsExpressRoutes } from './routes/buildings/buildingsExpressRoutes';

const express = require('express');
const app = express();

export class Main {
    public static main() {
        const routesManager: IRoutesManager = new ExpressRoutesManager();
        routesManager.addRoutes(new BuildingsExpressRoutes('/buildings'));
        routesManager.buildRoutes(app);
    }
}

Main.main();