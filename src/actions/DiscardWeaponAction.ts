import Action from './Action';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';

class DiscardWeaponAction extends Action<void> {
    public static readonly TYPE = 'discard-weapon';

    private weapon: Weapon;

    constructor({
        scene,
        actor,
        weapon,
    }: {
        scene: Scene;
        actor: Actor;
        weapon: Weapon;
    }) {
        super({ type: DiscardWeaponAction.TYPE, scene, actor });
        this.weapon = weapon;
    }

    getWeapon(): Weapon {
        return this.weapon;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        const inventory = this.getActor().getInventory();
        const inventoryContainsWeapon = inventory
            .getWeapons()
            .find((weapon) => weapon.equals(this.getWeapon()));
        if (!inventoryContainsWeapon) {
            return false;
        }
        if (
            !this.weapon.getAmmunition() &&
            !this.areThereTwoOrMoreWeaponsWithoutAmmunition()
        ) {
            return false;
        }
        return true;
    }

    execute(): void {
        const inventory = this.getActor().getInventory();
        inventory.removeWeapon(this.getWeapon());
    }

    private areThereTwoOrMoreWeaponsWithoutAmmunition(): boolean {
        const weaponsWithoutAmmunition = this.getActor()
            .getInventory()
            .getWeapons()
            .filter((weapon) => !weapon.getAmmunition());
        return weaponsWithoutAmmunition.length > 1;
    }
}

export default DiscardWeaponAction;
