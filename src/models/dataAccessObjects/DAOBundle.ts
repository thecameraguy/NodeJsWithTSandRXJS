import { ICityDAO } from './cityDAO';
import { IBuildingDAO } from './buildingDAO';
import { IUnitDAO } from './unitDAO';
import { IContractDAO } from './contractDAO';

export interface DAOBundle {
    cityDAO: ICityDAO;
    buildingDAO: IBuildingDAO;
    unitDAO: IUnitDAO;
    contractDAO: IContractDAO;
}