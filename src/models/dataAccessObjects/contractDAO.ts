import { Observable } from 'rxjs';
import { IDataAccessObject } from './dataAccessObjects';
import { Building } from '../building';
import { Unit } from '../unit';
import { Contract } from '../contract';

export interface IContractDAO extends IDataAccessObject {
    findLatestContract (building: Building, unit: Unit, daysBack: number): Observable<Contract>;
}

export abstract class AbstractContractDAO implements IContractDAO {
    public abstract findLatestContract (building: Building, unit: Unit, daysBack: number): Observable<Contract>;
}
