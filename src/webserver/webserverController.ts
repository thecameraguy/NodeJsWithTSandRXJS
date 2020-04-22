import { Observable } from 'rxjs';
export interface IWebServerController {
    connect (port: number, extra: any): Observable<any>;
    disconnect (): Observable<any>;
}