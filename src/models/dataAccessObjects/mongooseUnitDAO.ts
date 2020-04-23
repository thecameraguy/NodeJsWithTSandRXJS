import { Observable } from 'rxjs';
import { AbstractUnitDAO } from './unitDAO';
import { Building } from '../building';
import { Unit } from '../unit';

const Mongoose = require('mongoose');

export class MongooseUnitDAO extends AbstractUnitDAO {
    private static UNIT_SCHEMA = new Mongoose.Schema({
        _id: Mongoose.Schema.Types.ObjectId,
        building: { type: Mongoose.Schema.Types.ObjectId, ref: 'Building' },
        unit: { type: String, required: true }
    });
    private static UNIT_DB_MODEL = Mongoose.model('Unit', MongooseUnitDAO.UNIT_SCHEMA);

    public findByBuilding(building: Building): Observable<Unit[]> {
        const resultObservable: Observable<Unit[]> = new Observable((subscriber) => {
            // TODO Verify that this works.. Do we need just the building id? does it need to be mongoose original object?
            MongooseUnitDAO.UNIT_DB_MODEL
                .find({building: {_id: building.id}})
                .exec((error: any, units: any[]) => {
                    if (error) {
                        subscriber.error(error);
                    }
                    if (units === null || units === void 0) {
                        subscriber.error('Null or undefined units returned');
                    }

                    // TODO Convert to list of internal Unit model
                    subscriber.next(this.convertToInternalModel(units, building));
                    subscriber.complete();
                });
        });
        return resultObservable;
    }

    private convertToInternalModel(units: any[], building: Building): Unit[] {
        return units.map((unit) => {
            if (building.id !== unit.building._id) {
                throw new Error('Unit building id does not match the requested building!!');
            }
            return new Unit(unit._id, unit.unit, building);
        });
    }
}