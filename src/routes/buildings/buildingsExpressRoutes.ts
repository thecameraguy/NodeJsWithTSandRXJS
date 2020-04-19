import { AbstractExpressRoutes } from '../expressRoutesManager';
import { ExpressControllerCommunicationDelegate } from '../../controllers/communicationDelegates/communicationDelegates';
import { BuildingsController } from '../../controllers/buildings/buildingsController';
const express = require('express');

export class BuildingsExpressRoutes extends AbstractExpressRoutes {
    private m_buildingsController: BuildingsController;
    constructor(baseEndpoint: string) {
        super(baseEndpoint, express.Router());
        this.m_buildingsController = new BuildingsController();

        // Obviously we will need to put in the proper routes here. This is just a placeholder
        this.router.get('/', (req: any, res: any) => { this.m_buildingsController.buildingList(new ExpressControllerCommunicationDelegate(req, res)); });
    }
}