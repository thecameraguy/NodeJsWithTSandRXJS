import { Observable } from 'rxjs';
import { IDataAccessObject } from './dataAccessObjects';
import { Building } from '../building';

export interface IBuildingDAO extends IDataAccessObject {
    allBuildings(): Observable<Building[]>;
    findBuilding(address: string, city: string): Observable<Building[]>;
    findBuildingsLike(address: string, city: string): Observable<Building[]>;
}

export abstract class AbstractBuildingDAO implements IBuildingDAO {
    public abstract allBuildings(): Observable<Building[]>;
    public abstract findBuilding(address: string, city: string): Observable<Building[]>;
    public abstract findBuildingsLike(address: string, city: string): Observable<Building[]>;
}
