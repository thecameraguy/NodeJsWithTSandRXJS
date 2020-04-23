import { ICityDAO } from './cityDAO';
import { IBuildingDAO } from './buildingDAO';
import { IUnitDAO } from './unitDAO';

export interface DAOBundle {
    cityDAO: ICityDAO;
    buildingDAO: IBuildingDAO;
    unitDAO: IUnitDAO;
}