import { Observable, of } from 'rxjs';
import { IWebServerController } from './webserverController';

export class ExpressMWController implements IWebServerController {
    private m_expressApp: any;

    constructor(expressApp: any) {
        this.m_expressApp = expressApp;
    }

    public connect(port: number): Observable<any> {
        const returnObs = new Observable((subscriber) => {
            this.m_expressApp.listen(port, () => {
                subscriber.next(port);
            });
        });

        return returnObs;
    }

    public disconnect(): Observable<any> {
        // TODO implement this
        return of(0);
    }

}