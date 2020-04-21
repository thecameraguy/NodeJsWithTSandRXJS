export class City {
    private m_id: string;
    private m_name: string;
    constructor(id: string, name: string) {
        this.m_id = id;
        this.m_name = name;
    }

    public get id(): string {
        return this.m_id;
    }
    public get name(): string {
        return this.m_name;
    }
}