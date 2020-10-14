import { Ammunition, Inventory, Item, Weapon } from '../models';

export const takeItems = (playerInventory: Inventory, container: Inventory) => {
    let containerItemsToTake = discardUntransferableItems(container.items);
    containerItemsToTake = discardWeaponsAlreadyAdquired(
        containerItemsToTake,
        playerInventory.getWeapons()
    );
    playerInventory.items = [...containerItemsToTake, ...playerInventory.items];
    container.items = [];
    mergeAmmunitions(playerInventory);
    playerInventory.items = discardSpentAmmunitions(playerInventory.items);
};

const discardUntransferableItems = (items: Item[]) =>
    items.filter((item) => !item.untransferable);

const discardWeaponsAlreadyAdquired = (items: Item[], weapons: Weapon[]) => {
    const weaponsAlreadyAdquiredNames = weapons.map((weapon) => weapon.name);
    return items.filter(
        (item) =>
            !(item instanceof Weapon) ||
            weaponsAlreadyAdquiredNames.indexOf(item.name) === -1
    );
};

const discardSpentAmmunitions = (items: Item[]) =>
    items.filter((item) => !(item instanceof Ammunition) || !item.isSpent());

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
