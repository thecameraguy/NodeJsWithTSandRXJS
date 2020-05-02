import { AbstractExpressRoutes } from '../expressRoutesManager';
import { ExpressControllerCommunicationDelegate } from '../../controllers/communicationDelegates/communicationDelegates';
import { BuildingsController } from '../../controllers/buildings/buildingsController';
import { DAOBundle } from '../../models/dataAccessObjects/DAOBundle';
const express = require('express');

export class BuildingsExpressRoutes extends AbstractExpressRoutes {
    private m_buildingsController: BuildingsController;
    constructor(baseEndpoint: string, daoBundle: DAOBundle) {
        super(baseEndpoint, express.Router());
        this.m_buildingsController = new BuildingsController(daoBundle.cityDAO, daoBundle.buildingDAO, daoBundle.unitDAO, daoBundle.contractDAO);

        // Obviously we will need to put in the proper routes here. This is just a placeholder
        this.router.get('/', (req: any, res: any) => { this.m_buildingsController.buildingList(new ExpressControllerCommunicationDelegate(req, res)); });
    }
}