import { Building } from './building';
import { Contract } from './contract';

export class Unit {
    private m_id: string;
    private m_unit: string;
    private m_building: Building;
    private m_contract: Contract;
    private m_contracts: Contract[];
    constructor (id: string, unit: string, building: Building) {
        this.m_id = id;
        this.m_unit = unit;
        this.m_building = building;
    }

    public get id(): string {
        return this.m_id;
    }
    public get unit(): string {
        return this.m_unit;
    }
    public get building(): Building {
        return this.m_building;
    }
    /**
     * Latest contract
     */
    public set contract(contract: Contract) {
        this.m_contract = contract;
    }
    public get contract(): Contract {
        return this.m_contract;
    }
    /**
     * All contracts
     */
    public set contracts(contracts: Contract[]) {
        this.m_contracts = contracts.slice(0);
    }
    public get contracts(): Contract[] {
        return this.m_contracts.slice(0);
    }
}