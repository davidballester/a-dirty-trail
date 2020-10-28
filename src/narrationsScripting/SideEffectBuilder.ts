/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Inventory from '../core/Inventory';
import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';
import { RenamePlayerRule, TakeWeaponRule } from './Rules';
import scriptingProcessor from './ScriptingProcessor';

class SideEffectBuilder {
    private scene: Scene;
    private sideEffectScript: string;

    constructor({
        scene,
        sideEffectScript,
    }: {
        scene: Scene;
        sideEffectScript: string;
    }) {
        this.scene = scene;
        this.sideEffectScript = sideEffectScript;
    }

    build(): void {
        const rule = scriptingProcessor.parse(this.sideEffectScript);
        switch (rule.type) {
            case 'renamePlayer': {
                return this.sideEffectRenamePlayer(rule as RenamePlayerRule);
            }
            case 'takeWeapon': {
                return this.sideEffectTakeWeapon(rule as TakeWeaponRule);
            }
        }
    }

    private sideEffectRenamePlayer(rule: RenamePlayerRule): void {
        const player = this.scene.getPlayer();
        player.changeName(rule.newName);
    }

    private sideEffectTakeWeapon(rule: TakeWeaponRule): void {
        const weapon = this.buildWeapon(rule);
        const weaponInventory = new Inventory({ weapons: [weapon] });
        const inventory = this.scene.getPlayer().getInventory();
        inventory.loot(weaponInventory);
    }

    private buildWeapon(takeWeaponRule: TakeWeaponRule): Firearm | Weapon {
        const item = takeWeaponRule.item;
        const weapon = new Weapon({
            name: item.name,
            type: item.type,
            damage: new Damage({ min: item.minDamage, max: item.maxDamage }),
            skill: item.skill,
        });
        if (!!takeWeaponRule.item.ammunitionType) {
            return this.buildFirearm(weapon, takeWeaponRule);
        }
        return weapon;
    }

    private buildFirearm(weapon: Weapon, { item }: TakeWeaponRule): Firearm {
        return new Firearm({
            name: weapon.getName(),
            type: weapon.getType(),
            damage: weapon.getDamage(),
            skill: weapon.getSkill(),
            ammunition: new WeaponAmmunition({
                type: item.ammunitionType!,
                current: item.currentAmmunition!,
                max: item.maxAmmunition!,
            }),
        });
    }
}

export default SideEffectBuilder;
