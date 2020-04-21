import { ICityDAO } from "./cityDAO";
import { IBuildingDAO } from "./buildingDAO";

export interface DAOBundle {
    cityDAO: ICityDAO;
    buildingDAO: IBuildingDAO;
}