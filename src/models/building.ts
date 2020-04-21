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
}