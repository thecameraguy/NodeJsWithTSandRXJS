export interface IControllerCommunicatorDelegate {
    getQuery(key: string): string;
    sendResponse(object: any): void;
}

export abstract class AbstractControllerCommunicationDelagate implements IControllerCommunicatorDelegate {
    public abstract getQuery(key: string): string;
    public abstract sendResponse(object: any): void;
}

export class ExpressControllerCommunicationDelegate extends AbstractControllerCommunicationDelagate {
    private m_req: any;
    private m_res: any;

    constructor (req: any, res: any) {
        super();
        this.m_req = req;
        this.m_res = res;
    }

    public getQuery(key: string): string  {
        // TODO Error checking
        return this.m_req[key];
    }
    public sendResponse(object: any): void {
        this.m_res.send(object);// TODO Fill in with proper action. Allow for sending error. Its own method for error?
    }

}

