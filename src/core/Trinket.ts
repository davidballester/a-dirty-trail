import ThingWithId from './ThingWithId';

class Trinket extends ThingWithId {
    private name: string;
    private description?: string;

    constructor({ name, description }: { name: string; description?: string }) {
        super();
        this.name = name;
        this.description = description;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string | undefined {
        return this.description;
    }
}

export default Trinket;
