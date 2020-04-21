import { Observable } from 'rxjs';
import { IDataAccessObject } from './dataAccessObjects';
import { City } from '../city';
export interface ICityDAO extends IDataAccessObject {
    findSingleCity (cityName: string): Observable<City>;
}

export abstract class AbstractCityDAO implements ICityDAO {
    public abstract findSingleCity (cityName: string): Observable<City>;
}