import { Inventory } from '../models';

export const takeItems = (source: Inventory, target: Inventory) => {
    target.items = [...target.items, ...source.items];
    source.items = [];
};
