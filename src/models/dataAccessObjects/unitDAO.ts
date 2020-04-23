import { Observable } from 'rxjs';
import { IDataAccessObject } from './dataAccessObjects';
import { Building } from '../building';
import { Unit } from '../unit';

export interface IUnitDAO extends IDataAccessObject {
    findByBuilding(building: Building): Observable<Unit[]>;
}

export abstract class AbstractUnitDAO implements IUnitDAO {
    public abstract findByBuilding(building: Building): Observable<Unit[]>;
}
