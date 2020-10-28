import Trinket from '../../build/core/Trinket';
import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';
import Weapon from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';
import {
    InventoryTemplate,
    TrinketTemplate,
    WeaponTemplate,
} from './SceneTemplate';

class InventoryBuilder {
    private inventoryTemplate: InventoryTemplate;

    constructor({
        inventoryTemplate,
    }: {
        inventoryTemplate: InventoryTemplate;
    }) {
        this.inventoryTemplate = inventoryTemplate;
    }

    build(): Inventory {
        const weapons = this.buildWeapons();
        const trinkets = this.buildTrinkets();
        return new Inventory({
            ammunitionsByType: this.inventoryTemplate.ammunitions,
            weapons,
            trinkets,
        });
    }

    private buildWeapons(): Weapon[] {
        if (!this.inventoryTemplate.weapons) {
            return [];
        }
        const weapons = this.inventoryTemplate.weapons;
        return Object.keys(weapons).map((weaponName) =>
            this.buildWeapon(weaponName, weapons[weaponName])
        );
    }

    private buildWeapon(name: string, weaponTemplate: WeaponTemplate): Weapon {
        const [minDamage, maxDamage] = weaponTemplate.damage.split('-');
        const damage = new Damage({
            min: parseInt(minDamage),
            max: parseInt(maxDamage),
        });
        if (weaponTemplate.ammunitionType && weaponTemplate.ammunition) {
            const [current, max] = weaponTemplate.ammunition.split('-');
            return new Firearm({
                name,
                damage,
                type: weaponTemplate.type,
                skill: weaponTemplate.skill,
                ammunition: new WeaponAmmunition({
                    type: weaponTemplate.ammunitionType,
                    current: parseInt(current),
                    max: parseInt(max),
                }),
                canBeLooted: weaponTemplate.canBeLooted,
            });
        }
        return new Weapon({
            name,
            damage,
            type: weaponTemplate.type,
            skill: weaponTemplate.skill,
            canBeLooted: weaponTemplate.canBeLooted,
        });
    }

    private buildTrinkets(): Trinket[] {
        const trinkets = this.inventoryTemplate.trinkets;
        if (!trinkets) {
            return [];
        }
        return trinkets.map((trinket) => this.buildTrinket(trinket));
    }

    private buildTrinket(trinketTemplate: TrinketTemplate): Trinket {
        return new Trinket(trinketTemplate);
    }
}

export default InventoryBuilder;
