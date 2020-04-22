import { Observable, of } from 'rxjs';
import { IDatabaseController } from './databaseController';

export class MongooseDBController implements IDatabaseController {
    private static m_instance: MongooseDBController;
    private static m_mongoose: any;
    private static m_mongooseDB: any;
    private m_isConnected: boolean = false;
    private constructor() {
        MongooseDBController.m_mongoose = require('mongoose');
        MongooseDBController.m_mongoose.Promise = global.Promise;
        MongooseDBController.m_mongooseDB = MongooseDBController.m_mongoose.connection;
    }

    public static instance() {
        if (this.m_instance === null || this.m_instance === void 0) {
            this.m_instance = new MongooseDBController();
        }
        return this.m_instance;
    }

    public connect(address: string, extra: any): Observable<any> {
        if (this.m_isConnected) {
            return Observable.throw('Connection is already active')
        }

        this.m_isConnected = true;

        const returnObs = new Observable((subscriber) => {
            MongooseDBController.m_mongooseDB.on('open', () => {
                subscriber.next(true);
            });
            MongooseDBController.m_mongooseDB.on('error', () => {
                subscriber.error('mongoDB connection error');
            });

            MongooseDBController.m_mongoose.connect(address);
        });

        return returnObs;
    }

    public disconnect(): Observable<any> {
        // TODO Implement this
        return of(0);
    }
}