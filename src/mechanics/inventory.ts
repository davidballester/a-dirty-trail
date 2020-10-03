import { v4 as uuidv4 } from 'uuid';

export class Item {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class Inventory {
    id: string;
    name: string;
    items: Item[];

    constructor(name: string, items: Item[] = []) {
        this.id = uuidv4();
        this.name = name;
        this.items = items;
    }
}

export const takeItems = (source: Inventory, target: Inventory) => {
    target.items = [...target.items, ...source.items];
    source.items = [];
};
