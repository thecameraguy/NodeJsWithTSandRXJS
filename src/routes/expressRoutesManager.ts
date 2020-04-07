import { AbstractRoutesManager, IRoutes } from './routesManager';

export abstract class AbstractExpressRoutes implements IRoutes {
    private m_baseEndpoint: string;
    private m_router: any;

    constructor(baseEndpoint: string, router: any) {
        if (baseEndpoint === null || baseEndpoint === void 0) {
            throw new Error('Cannot build routes with null or undefined base endpoint string'); 
        }
        if (router === null || router === void 0) {
            throw new Error('Cannot build routes with null or undefined router'); 
        }

        this.m_baseEndpoint = baseEndpoint;
        this.m_router = router;
    }

    public get baseEndpoint(): string {
        return this.m_baseEndpoint;
    }

    public get router(): any {
        return this.m_router;
    }
}

export class ExpressRoutesManager extends AbstractRoutesManager {
    public buildConcreteRouter(app: any, routes: IRoutes) : void {
        app.use(routes.baseEndpoint, routes.router);
    }
}