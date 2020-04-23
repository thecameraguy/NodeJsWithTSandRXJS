import { Unit } from './unit';

export class Building {
    private m_id: string;
    private m_address: string;
    private m_city: string;
    private m_units: Unit[];
    constructor(id: string, address: string, city: string, units: Unit[]) {
        this.m_id = id;
        this.m_address = address;
        this.m_city = city;
        this.m_units = units.slice(0);
    }

    public get id(): string {
        return this.m_id;
    }
    public get address(): string {
        return this.m_address;
    }
    public get city(): string {
        return this.m_city;
    }
    public get units(): Unit[] {
        return this.m_units.slice(0);
    }
    public set units(units: Unit[]) {
        this.m_units = units.slice(0);
    }
}