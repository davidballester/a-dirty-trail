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
        if (!!this.getWeapon().getAmmunition()) {
            return true;
        }
        const weaponsThatDoNotUseAmmunition = inventory
            .getWeapons()
            .filter((weapon) => !weapon.getAmmunition());
        if (weaponsThatDoNotUseAmmunition.length === 0) {
            return false;
        }
        const isLastWeaponThatDoNotUseAmmunition =
            weaponsThatDoNotUseAmmunition.length > 1 ||
            weaponsThatDoNotUseAmmunition[0].equals(this.getWeapon());
        if (isLastWeaponThatDoNotUseAmmunition) {
            return false;
        }
        return true;
    }

    execute(): void {
        const inventory = this.getActor().getInventory();
        inventory.removeWeapon(this.getWeapon());
    }
}

export default DiscardWeaponAction;
