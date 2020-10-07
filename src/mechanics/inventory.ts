import { Ammunition, Inventory } from '../models';

export const takeItems = (source: Inventory, target: Inventory) => {
    target.items = [
        ...target.items.filter((item) => !item.untransferable),
        ...source.items,
    ];
    source.items = [];
    mergeAmmunitions(target);
    target.items = target.items.filter(
        (item) => !(item instanceof Ammunition) || !item.isSpent()
    );
};

const mergeAmmunitions = (inventory: Inventory) => {
    const ammunitionsByName: {
        [ammunitionName: string]: Ammunition[];
    } = inventory.items
        .filter((item) => item instanceof Ammunition)
        .reduce(
            (map, ammunition) => ({
                ...map,
                [ammunition.name]: [
                    ...(map[ammunition.name] || []),
                    ammunition,
                ],
            }),
            {}
        );
    Object.keys(ammunitionsByName).forEach((ammunitionName) => {
        const ammunitions = ammunitionsByName[ammunitionName];
        if (ammunitions.length > 1) {
            const firstAmmunition = ammunitions[0];
            ammunitions.slice(1).forEach((ammunition) => {
                firstAmmunition.modifyAmmunition(ammunition.quantity);
                ammunition.modifyAmmunition(-ammunition.quantity);
            });
        }
    });
};
