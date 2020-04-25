import { Observable } from 'rxjs';
import { Building } from '../building';
import { Unit } from '../unit';
import { Contract } from '../contract';
import { AbstractContractDAO } from './contractDAO';

const Mongoose = require('mongoose');

export class MongooseContractDAO extends AbstractContractDAO {
    private static CONTRACT_SCHEMA = new Mongoose.Schema({
        building: { type: Mongoose.Schema.Types.ObjectId, ref: 'Building' },
        unit: { type: Mongoose.Schema.Types.ObjectId, ref: 'Unit' },
        mls: { type: String, required: true },
        contractDate: { type: Date, required: true },
        price: { type: Number, min: 0, required: true }
    });
    private static CONTRACT_DB_MODEL = Mongoose.model('Contract', MongooseContractDAO.CONTRACT_SCHEMA);

    public findLatestContract (building: Building, unit: Unit, daysBack: number): Observable<Contract> {
        const resultObservable = new Observable<Contract>((subscriber) => {
            const listingDateLimit = new Date();
            listingDateLimit.setDate(listingDateLimit.getDate() - daysBack);

            MongooseContractDAO.CONTRACT_DB_MODEL
                .findOne(
                    {
                        building: { _id: building.id },
                        unit: { _id: unit.id },
                        contractDate: { $gt: listingDateLimit }
                    },
                    null,
                    { sort: { contractDate: -1 } }
                )
                .exec((error: any, contract: any) => {
                    if(error) {
                        console.log('find latest contract error', error);
                        subscriber.error(error);
                    }

                    if (contract.building._id !== building.id) {
                        subscriber.error('Contract returned with different building!!!');
                    }
                    if (contract.unit._id !== unit.id) {
                        subscriber.error('Contract returned with different unit!!!');
                    }

                    subscriber.next(new Contract(contract._id, contract.mls, contract.contractDate, contract.price, building, unit));
                    subscriber.complete();
                });
        });

        return resultObservable;
    }
}
