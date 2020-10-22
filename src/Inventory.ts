import ThingWithId from './ThingWithId';
import Trinket from './Trinket';
import Weapon from './Weapon';

class Inventory extends ThingWithId {
    private weapons: WeaponsInventory;
    private ammunitions: AmmunitionsInventory;
    private trinkets: TrinketInventory;

    constructor({
        weapons,
        ammunitionByType,
        trinkets,
    }: {
        weapons?: Weapon[];
        ammunitionByType?: AmmunitionByType;
        trinkets?: Trinket[];
    }) {
        super();
        this.weapons = new WeaponsInventory(weapons);
        this.ammunitions = new AmmunitionsInventory(ammunitionByType);
        this.trinkets = new TrinketInventory(trinkets);
    }

    getWeapons(): Weapon[] {
        return this.weapons.getAll();
    }

    getAmmunitionsByType(): AmmunitionByType {
        return this.ammunitions.getByType();
    }

    getTrinkets(): Trinket[] {
        return this.trinkets.getAll();
    }

    loot(inventory: Inventory) {
        this.weapons.loot(inventory.getWeapons());
        this.ammunitions.loot(inventory.getAmmunitionsByType());
        this.trinkets.loot(inventory.getTrinkets());
    }
}

export default Inventory;

class WeaponsInventory {
    private weapons: Weapon[];

    constructor(weapons: Weapon[] = []) {
        this.weapons = [...weapons];
    }

    getAll() {
        return this.weapons;
    }

    loot(weapons: Weapon[] = []) {
        this.weapons = [...this.weapons, ...weapons];
    }
}

class AmmunitionsInventory {
    private ammunitionsByType: AmmunitionByType;

    constructor(ammunitionsByType: AmmunitionByType = {}) {
        this.ammunitionsByType = { ...ammunitionsByType };
    }

    getByType() {
        return this.ammunitionsByType;
    }

    loot(ammunitionsByType: AmmunitionByType) {
        Object.keys(ammunitionsByType).forEach((type) => {
            const ammunitions = ammunitionsByType[type];
            if (!this.ammunitionsByType[type]) {
                this.ammunitionsByType[type] = 0;
            }
            this.ammunitionsByType[type] += ammunitions;
        });
    }
}

export interface AmmunitionByType {
    [type: string]: number;
}

class TrinketInventory {
    private trinkets: Trinket[];

    constructor(trinkets: Trinket[] = []) {
        this.trinkets = [...trinkets];
    }

    getAll() {
        return this.trinkets;
    }

    loot(trinkets: Trinket[]) {
        this.trinkets = [...this.trinkets, ...trinkets];
    }
}
