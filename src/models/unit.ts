import { Building } from './building';

export class Unit {
    private m_id: string;
    private m_unit: string;
    private m_building: Building;
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
}