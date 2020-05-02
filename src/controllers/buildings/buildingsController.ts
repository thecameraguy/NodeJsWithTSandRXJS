import { Observable, forkJoin } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { AppConstants } from '../../constants/constants';
import { IControllerCommunicatorDelegate } from '../communicationDelegates/communicationDelegates';
import { Building } from '../../models/building';
import { City } from '../../models/city';
import { Unit } from '../../models/unit';
import { Contract } from '../../models/contract';
import { ICityDAO } from '../../models/dataAccessObjects/cityDAO';
import { IBuildingDAO } from '../../models/dataAccessObjects/buildingDAO';
import { IUnitDAO } from '../../models/dataAccessObjects/unitDAO';
import { IContractDAO } from '../../models/dataAccessObjects/contractDAO';

// TODO Singleton. We could make an InjectorService that takes care of dependency injection..?

/**
 * Builginds routable controller - knows how to handle web server agnostic requests.
 */
export class BuildingsController {
    private m_cityDAO: ICityDAO;
    private m_buildingDAO: IBuildingDAO;
    private m_unitDAO: IUnitDAO;
    private m_contractDAO: IContractDAO;
    constructor (cityDAO: ICityDAO, buildingDAO: IBuildingDAO, unitDAO: IUnitDAO, contractDAO: IContractDAO) {
        this.m_cityDAO = cityDAO;
        this.m_buildingDAO = buildingDAO;
        this.m_unitDAO = unitDAO;
        this.m_contractDAO = contractDAO;
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
            flatMap((buildings: Building[]): Observable<Building[]> => {
                const unitsObservables: Observable<Building>[] = buildings.map((building: Building): Observable<Building> => {
                    // Hey, let's request units for this building. When those come back, let's tap into the
                    // observable stream before returning it to the observable chain and do a little side-effect
                    // of storing the units in the building model!
                    return this.m_unitDAO.findByBuilding(building)
                        .pipe(
                            // Let's transform Observable<Unit[]> into Observable<Building>
                            // Individual building that's populated with units will be emitted as discrete
                            // signal
                            map((units: Unit[]): Building => {
                                building.units = units;
                                return building;
                            })
                        );
                });
                // Since each building spawns new async DB request that return their respective Observable,
                // we want to fork and then join all these observables and continue when all are done.
                return forkJoin (unitsObservables);
            }),

            // This flatMap fetched contacts that belong to each unit that are part of every building in
            // the request list.
            // This performs two fork-join of contract fetch observables. It has 2 levels. 1) Buildings, 2) Units
            // Each building is looped through, and each unit within a building is transformed into individual
            // contract fetch request observable. All the requests that belong to each building is fork-joined and
            // combined observable (now containing every contract requests in a particular building) is collected
            // for every building in this request. These building-level observables are then fork-joined to
            // execute contract fetch requests for every building in the list.
            flatMap((buildings: Building[]): Observable<Building[]> => {
                const contractObservablesGroupedByBuildings: Observable<Building>[] =
                    // Go through each building and its units and populate contract for each of the units
                    // and once every unit is populated, return the original building that's now completed populating
                    buildings.map((building: Building): Observable<Building> => {

                        const contractObservablesGroupedByUnits: Observable<Unit>[] =
                            // Go through every unit in this building and fetch latest contract for each unit
                            building.units.map((unit: Unit): Observable<Unit> => {

                                // Find latest contract for this unit
                                return this.m_contractDAO.findLatestContract(building, unit, AppConstants.CONTRACTS_DAYS_BACK)
                                    .pipe(
                                        // Once the contract is fetched, store it in the original unit
                                        // and return the unit that now stores the contract
                                        map((contract: Contract) => {
                                            unit.contract = contract;
                                            return unit;
                                        })
                                    );
                            });

                        // Now execute all contract fetch requests for every unit that belong to this building
                        // and once all of them are done, return the original building.
                        return forkJoin(contractObservablesGroupedByUnits).pipe(
                            map ((units: Unit[]) => {
                                return building;
                            })
                        );
                    });
                
                // Now execute all contract fetch requests for every building - this will cascade into each unit
                // and execute contract fetch requests for each unit.
                return forkJoin(contractObservablesGroupedByBuildings);
            })

            // Phew! Compared with async sequential queries and callback hell, this code is a breeze WowWee
        )
        .subscribe((buildings: Building[]) => {
            // We got buildings here. Now return meaningful result.
            communicationDelegate.sendResponse(buildings);
        });
    }
}