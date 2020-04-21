import { Observable } from 'rxjs';
import { City } from '../City';
import { AbstractCityDAO } from './cityDAO';

const Mongoose = require('mongoose');

// TODO Singleton?
export class MongooseCityDAO extends AbstractCityDAO {
    private static CITY_SCHEMA: any = new Mongoose.Schema({
        _id: Mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true }
    });
    private static CITY_DB_MODEL = Mongoose.model('City', MongooseCityDAO.CITY_SCHEMA);

    public findSingleCity (cityName: string): Observable<City> {
        // We are setting up a cold observable. The observable executes at the time of subscription.
        // It also means that every subscriber executes this observable code separately.
        // Use share if we want to share the observable results among multiple subscribers.
        const resultObservable: Observable<City> = new Observable((subscriber) => {
            MongooseCityDAO.CITY_DB_MODEL.find()
            .where('name').equals(cityName)
            .limit(1)
            .exec({}, (error: any, cities: any) => {
                if (error) {
                    subscriber.error(error);
                    return;
                }
                if (cities.length <= 0) {
                    subscriber.error('No City Found');
                    return;
                }

                subscriber.next(cities[0]);
            })
        });
        return resultObservable;
        
    }
}