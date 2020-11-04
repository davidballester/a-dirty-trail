import ThingWithId from './ThingWithId';
import Trinket from './Trinket';
import Weapon from './Weapon';

class Inventory extends ThingWithId {
    private weapons: WeaponsInventory;
    private ammunitions: AmmunitionsInventory;
    private trinkets: TrinketInventory;

    constructor({
        weapons,
        ammunitionsByType,
        trinkets,
    }: {
        weapons?: Weapon[];
        ammunitionsByType?: AmmunitionByType;
        trinkets?: Trinket[];
    }) {
        super();
        this.weapons = new WeaponsInventory(weapons);
        this.ammunitions = new AmmunitionsInventory(ammunitionsByType);
        this.trinkets = new TrinketInventory(trinkets);
    }

    getWeapons(): Weapon[] {
        return this.weapons.getAll();
    }

    removeWeapon(weapon: Weapon): void {
        this.weapons.remove(weapon);
    }

    getAmmunitionsByType(): AmmunitionByType {
        return this.ammunitions.getByType();
    }

    getTrinkets(): Trinket[] {
        return this.trinkets.getAll();
    }

    loot(inventory: Inventory): Inventory {
        const lootableWeapons = inventory
            .getWeapons()
            .filter((weapon) => weapon.canBeLooted());
        const ammunitionsByType = inventory.getAmmunitionsByType();
        const trinkets = inventory.getTrinkets();
        this.weapons.loot(lootableWeapons);
        this.ammunitions.loot(ammunitionsByType);
        this.trinkets.loot(trinkets);
        const loot = new Inventory({
            weapons: lootableWeapons,
            ammunitionsByType,
            trinkets,
        });
        return loot;
    }

    hasTrinket(trinketName: string): boolean {
        return this.trinkets.has(trinketName);
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

    remove(weapon: Weapon): void {
        this.weapons = this.weapons.filter(
            (candidate) => !candidate.equals(weapon)
        );
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

    has(trinketName = ''): boolean {
        return !!this.trinkets.find(
            (trinket) =>
                trinket.getName().trim().toLowerCase() ===
                trinketName.trim().toLowerCase()
        );
    }
}
