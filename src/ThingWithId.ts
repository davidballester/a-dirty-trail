import { v4 as uuidv4 } from 'uuid';

class ThingWithId {
    private id: string;

    constructor() {
        this.id = uuidv4();
    }

    getId() {
        return this.id;
    }
}

export default ThingWithId;
