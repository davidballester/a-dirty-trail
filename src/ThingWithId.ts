import { v4 as uuidv4 } from 'uuid';

class ThingWithId {
    readonly id: string;
    constructor() {
        this.id = uuidv4();
    }
}

export default ThingWithId;
