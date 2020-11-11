import { v4 as uuidv4 } from 'uuid';

class ThingWithId {
    private id: string;

    constructor(id = uuidv4()) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    equals(thingWithId: ThingWithId): boolean {
        return this.getId() === thingWithId.getId();
    }
}

export default ThingWithId;
