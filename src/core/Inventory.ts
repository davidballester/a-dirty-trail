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
        this.ammunitions = new AmmunitionsInventory(ammunitionsByType);
        this.weapons = new WeaponsInventory(weapons);
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

    getTrinketsModifiersOnSkill(skillName: string): number {
        return this.trinkets.getModifiersOnSkill(skillName);
    }

    loot(inventory: Inventory): Inventory {
        const lootableWeapons = inventory
            .getWeapons()
            .filter((weapon) => weapon.canBeLooted());
        const { weaponsOwned, weaponsNotOwned } = this.classifyWeaponsByOwned(
            lootableWeapons
        );
        const ammunitionsByType = inventory.getAmmunitionsByType();
        const trinkets = inventory.getTrinkets();
        this.weapons.loot(weaponsNotOwned);
        this.ammunitions.loot(ammunitionsByType, weaponsOwned);
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

    private classifyWeaponsByOwned(
        weapons: Weapon[]
    ): { weaponsOwned: Weapon[]; weaponsNotOwned: Weapon[] } {
        return weapons.reduce(
            ({ weaponsOwned, weaponsNotOwned }, weapon) => {
                const isOwned = this.weapons
                    .getAll()
                    .some(
                        (candidate) => candidate.getName() === weapon.getName()
                    );
                if (isOwned) {
                    weaponsOwned.push(weapon);
                } else {
                    weaponsNotOwned.push(weapon);
                }
                return { weaponsOwned, weaponsNotOwned };
            },
            {
                weaponsOwned: [] as Weapon[],
                weaponsNotOwned: [] as Weapon[],
            }
        );
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

    loot(weapons: Weapon[] = []): void {
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

    loot(ammunitionsByType: AmmunitionByType, weapons: Weapon[]): void {
        Object.keys(ammunitionsByType).forEach((type) => {
            const ammunitions = ammunitionsByType[type];
            if (!this.ammunitionsByType[type]) {
                this.ammunitionsByType[type] = 0;
            }
            this.ammunitionsByType[type] += ammunitions;
        });
        weapons.forEach((weapon) => {
            const ammunition = weapon.getAmmunition();
            if (!ammunition) {
                return;
            }
            const type = ammunition.getType();
            if (!this.ammunitionsByType[type]) {
                this.ammunitionsByType[type] = 0;
            }
            this.ammunitionsByType[type] += ammunition.getCurrent();
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

    getModifiersOnSkill(skillName: string): number {
        return this.trinkets.reduce(
            (modifier, trinket) =>
                modifier + trinket.getSkillsModifiers()[skillName] || 0,
            0
        );
    }
}
