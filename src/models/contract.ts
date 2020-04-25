import { Building } from "./building";
import { Unit } from "./unit";

export class Contract {
    private m_id: string;
    private m_mls: string;
    private m_contractDate: Date;
    private m_price: number;
    private m_building: Building;
    private m_unit: Unit;

    constructor (id: string, mls: string, contractDate: Date, price: number, building: Building, unit: Unit) {
        this.m_id = id;
        this.m_mls = mls;
        this.m_contractDate = contractDate;
        this.m_price = price;
        this.m_building = building;
        this.m_unit = unit;
    }

    public get id(): string {
        return this.m_id;
    }
    public get mls(): string {
        return this.m_mls;
    }
    public get contractDate(): Date {
        return this.m_contractDate;
    }
    public get price(): number {
        return this.m_price;
    }
    public get building(): Building {
        return this.m_building;
    }
    public get unit(): Unit {
        return this.m_unit;
    }
}
