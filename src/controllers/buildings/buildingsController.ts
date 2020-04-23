import { pipe, Observable, of, forkJoin } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { IControllerCommunicatorDelegate } from '../communicationDelegates/communicationDelegates';
import { Building } from '../../models/building';
import { City } from '../../models/city';
import { Unit } from '../../models/unit';
import { ICityDAO } from '../../models/dataAccessObjects/cityDAO';
import { IBuildingDAO } from '../../models/dataAccessObjects/buildingDAO';
import { IUnitDAO } from '../../models/dataAccessObjects/unitDAO';

// TODO Singleton. We could make an InjectorService that takes care of dependency injection..?

/**
 * Builginds routable controller - knows how to handle web server agnostic requests.
 */
export class BuildingsController {
    private m_cityDAO: ICityDAO;
    private m_buildingDAO: IBuildingDAO;
    private m_unitDAO: IUnitDAO;
    constructor (cityDAO: ICityDAO, buildingDAO: IBuildingDAO, unitDAO: IUnitDAO) {
        this.m_cityDAO = cityDAO;
        this.m_buildingDAO = buildingDAO;
        this.m_unitDAO = unitDAO;
    }

    public buildingList (communicationDelegate: IControllerCommunicatorDelegate) {
        const city: string = communicationDelegate.getQuery('City');
        const addressLike: string = communicationDelegate.getQuery('Address');

        // Get the requested City from Database
        this.m_cityDAO.findSingleCity(city)
        .pipe(
            // Once that city comes back, get all the buildings that are in the city from DB
            flatMap((city: City): Observable<Building[]> => {
                return this.m_buildingDAO.findBuildingsLike(addressLike, city.name);
            }),

            // With the list of buildings, get corresponding units
            flatMap((buildings: Building[]): Observable<Unit[][]> => {
                const unitsObservable = buildings.map((building: Building) => {
                    // Hey, let's request units for this building. When those come back, let's tap into the
                    // observable stream before returning it to the observable chain and do a little side-effect
                    // of storing the units in the building model!
                    return this.m_unitDAO.findByBuilding(building)
                        .pipe(tap((units: Unit[]) => {
                            building.units = units;
                        }));
                });
                // Since each building spawns new async DB request that return their respective Observable,
                // we want to fork and then join all these observables and continue when all are done.
                return forkJoin (unitsObservable);
            })
            // TODO Add another flatmap to add contracts to the units.

            // Phew! Compared with async sequential queries and callback hell, this code is a breeze WowWee
        )
        .subscribe((buildings: Unit[][]) => {
            // We got buildings here. Now return meaningful result.
            communicationDelegate.sendResponse({bleep: 'bloop'});
        });
    }
}