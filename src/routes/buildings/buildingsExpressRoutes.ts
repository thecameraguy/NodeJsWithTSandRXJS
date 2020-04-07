import { AbstractExpressRoutes } from '../expressRoutesManager';
const express = require('express');

export class BuildingsExpressRoutes extends AbstractExpressRoutes {
    constructor(baseEndpoint: string) {
        super(baseEndpoint, express.Router());

        // Obviously we will need to put in the proper routes here. This is just a placeholder
        this.router.get('/', () => {});
    }
}