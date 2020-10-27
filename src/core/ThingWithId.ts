import { v4 as uuidv4 } from 'uuid';

class ThingWithId {
    private id: string;

    constructor() {
        this.id = uuidv4();
    }

    getId(): string {
        return this.id;
    }

    equals(thingWithId: ThingWithId): boolean {
        return this.getId() === thingWithId.getId();
    }
}

export default ThingWithId;
