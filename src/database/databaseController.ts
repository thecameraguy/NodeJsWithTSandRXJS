import { Observable } from 'rxjs';
export interface IDatabaseController {
    connect(address: string, extra: any): Observable<any>;
    disconnect(): Observable<any>;
}