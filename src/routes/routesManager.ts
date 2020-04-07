export interface IRoutes {
    readonly baseEndpoint: string;
    readonly router: any;
}

export interface IRoutesManager {
    addRoutes(routes: IRoutes): void;
    buildRoutes(app: any): void; // Accepts main app middleware 
}

export abstract class AbstractRoutesManager implements IRoutesManager {
    private m_routes: IRoutes[] = [];

    constructor () {
    }

    public addRoutes(routes: IRoutes): void {
        this.m_routes.push(routes);
    }

    public buildRoutes(app: any): void {
        // pre-processing if necessary

        this.m_routes.forEach(routes => {
            this.buildConcreteRouter(app, routes);
        });
    }

    public abstract buildConcreteRouter(app: any, routes: IRoutes) : void;
}