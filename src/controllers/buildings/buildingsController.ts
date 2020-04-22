import { pipe, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { IControllerCommunicatorDelegate } from '../communicationDelegates/communicationDelegates';
import { Building } from '../../models/building';
import { City } from '../../models/city';
import { ICityDAO } from '../../models/dataAccessObjects/cityDAO';
import { IBuildingDAO } from '../../models/dataAccessObjects/buildingDAO';

// TODO Singleton. We could make an InjectorService that takes care of dependency injection..?

/**
 * Builginds routable controller - knows how to handle web server agnostic requests.
 */
export class BuildingsController {
    private m_cityDAO: ICityDAO;
    private m_buildingDAO: IBuildingDAO;
    constructor (cityDAO: ICityDAO, buildingDAO: IBuildingDAO) {
        this.m_cityDAO = cityDAO;
        this.m_buildingDAO = buildingDAO;
    }

    public buildingList (communicationDelegate: IControllerCommunicatorDelegate) {
        const city: string = communicationDelegate.getQuery('City');
        const addressLike: string = communicationDelegate.getQuery('Address');
        // ... actual functionality here. Figure out how to adapt Mongoose into RxJS and TS - This is the real fun part!!! WOoooo 
        this.m_cityDAO.findSingleCity(city)
        .pipe(
            flatMap((city: City) => {
                return this.m_buildingDAO.findBuildingsLike(addressLike, city.name);
            })
            // TODO Add another flatmap to add units to the buildings.

            // Phew! Compared with async sequential queries and callback hell, this code is a breeze WowWee
        )
        .subscribe((buildings: Building[]) => {
            // We got buildings here. Now return meaningful result.
            communicationDelegate.sendResponse({bleep: 'bloop'});
        });
    }
}