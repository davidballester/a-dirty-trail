import Damage from '../core/Damage';
import Inventory from '../core/Inventory';
import Trinket from '../core/Trinket';
import Weapon from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';
import {
    InventoryTemplate,
    TrinketTemplate,
    WeaponTemplate,
} from './InventoryTemplate';

class InventoryTemplateBuilder {
    private inventory: Inventory;

    constructor({ inventory }: { inventory: Inventory }) {
        this.inventory = inventory;
    }

    build(): InventoryTemplate {
        return {
            ammunitions: this.inventory.getAmmunitionsByType(),
            trinkets: this.buildTrinketsTemplate(),
            weapons: this.buildWeaponsTemplate(),
        };
    }

    private buildTrinketsTemplate(): TrinketTemplate[] {
        return this.inventory
            .getTrinkets()
            .map((trinket) => this.buildTrinketTemplate(trinket));
    }

    private buildTrinketTemplate(trinket: Trinket): TrinketTemplate {
        return {
            name: trinket.getName(),
            description: trinket.getDescription(),
        };
    }

    private buildWeaponsTemplate(): { [name: string]: WeaponTemplate } {
        return this.inventory.getWeapons().reduce(
            (weaponsTemplate, weapon) => ({
                ...weaponsTemplate,
                [weapon.getName()]: this.buildWeaponTemplate(weapon),
            }),
            {}
        );
    }

    private buildWeaponTemplate(weapon: Weapon): WeaponTemplate {
        const ammunitionTemplate = this.buildAmmunitionTemplate(
            weapon.getAmmunition()
        );
        return {
            damage: this.buildDamageTemplate(weapon.getDamage()),
            skill: weapon.getSkill(),
            type: weapon.getType(),
            canBeLooted: weapon.canBeLooted(),
            ...ammunitionTemplate,
        };
    }

    private buildAmmunitionTemplate(
        weaponAmmunition?: WeaponAmmunition
    ): { ammunitionType?: string; ammunition?: string } {
        if (!weaponAmmunition) {
            return {};
        }
        return {
            ammunitionType: weaponAmmunition.getType(),
            ammunition: `${weaponAmmunition.getCurrent()}-${weaponAmmunition.getMax()}`,
        };
    }

    private buildDamageTemplate(damage: Damage): string {
        return `${damage.getMin()}-${damage.getMax()}`;
    }
}

export default InventoryTemplateBuilder;
