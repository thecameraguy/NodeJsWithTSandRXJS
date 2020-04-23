import { Observable } from 'rxjs';
import { Building } from '../building';
import { AbstractBuildingDAO } from './buildingDAO';

const Mongoose = require('mongoose');

// TODO Singleton?
export class MongooseBuildingDAO extends AbstractBuildingDAO {
    private static BUILDING_SCHEMA: any = new Mongoose.Schema({
        _id: Mongoose.Schema.Types.ObjectId,
        address: { type: String, required: true },
        city: { type: Mongoose.Schema.Types.ObjectId, ref: 'City' }
    });
    private static BUILDING_DB_MODEL = Mongoose.model('Building', MongooseBuildingDAO.BUILDING_SCHEMA);

    public allBuildings(): Observable<Building[]> {
        // We are setting up a cold observable. The observable executes at the time of subscription.
        // It also means that every subscriber executes this observable code separately.
        // Use share if we want to share the observable results among multiple subscribers.
        const resultObservable: Observable<Building[]> = new Observable((subscriber) => {
            MongooseBuildingDAO.BUILDING_DB_MODEL.find({}, (error: any, buildings: any) => {
                if (error) {
                    subscriber.error(error);
                } else {
                    subscriber.next(this.dbModelToInternalModel(buildings));
                    subscriber.complete();
                }
            })
        });
        return resultObservable;
    }

    public findBuilding(address: string, city: string): Observable<Building[]> {
        // We are setting up a cold observable. The observable executes at the time of subscription.
        // It also means that every subscriber executes this observable code separately.
        // Use share if we want to share the observable results among multiple subscribers.
        const resultObservable: Observable<Building[]> = new Observable((subscriber) => {
            MongooseBuildingDAO.BUILDING_DB_MODEL.find({address: address, city: city}, (error: any, buildings: any) => {
                if (error) {
                    subscriber.error(error);
                } else {
                    subscriber.next(this.dbModelToInternalModel(buildings));
                    subscriber.complete();
                }
            })
        });
        return resultObservable;
    }

    public findBuildingsLike(address: string, city: string): Observable<Building[]> {
        // We are setting up a cold observable. The observable executes at the time of subscription.
        // It also means that every subscriber executes this observable code separately.
        // Use share if we want to share the observable results among multiple subscribers.
        const resultObservable: Observable<Building[]> = new Observable((subscriber) => {
            MongooseBuildingDAO.BUILDING_DB_MODEL.find({city: city, address: new RegExp(address, 'i')}, (error: any, buildings: any) => {
                if (error) {
                    subscriber.error(error);
                } else {
                    subscriber.next(this.dbModelToInternalModel(buildings));
                    subscriber.complete();
                }
            })
        });
        return resultObservable;
    }

    private dbModelToInternalModel(buildings: any[]): Building[] {
        const buildingModels: Building[] = buildings.map((building: any) => {
            return new Building(building._id, building.address, building.city, []);
        });
        return buildingModels;
    }
}