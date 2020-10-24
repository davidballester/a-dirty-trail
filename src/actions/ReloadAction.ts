import Action from './Action';
import Actor from '../core/Actor';
import Inventory from '../core/Inventory';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';

class ReloadAction extends Action<void> {
    public static readonly TYPE = 'reload';

    private weapon: Weapon;
    private inventory: Inventory;

    constructor({
        scene,
        actor,
        weapon,
        inventory,
    }: {
        scene: Scene;
        actor: Actor;
        weapon: Weapon;
        inventory: Inventory;
    }) {
        super({ type: ReloadAction.TYPE, scene, actor });
        if (!weapon.getAmmunition()) {
            throw new Error('weapon does not require ammunition');
        }
        this.weapon = weapon;
        this.inventory = inventory;
    }

    getWeapon(): Weapon {
        return this.weapon;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        const weapon = this.getWeapon();
        const weaponAmmunition = weapon.getAmmunition()!;
        if (weaponAmmunition.getCurrent() === weaponAmmunition.getMax()) {
            return false;
        }
        const ammunitionsByType = this.inventory.getAmmunitionsByType();
        const ammunition = ammunitionsByType[weaponAmmunition.getType()];
        if (!ammunition) {
            return false;
        }
        return true;
    }

    execute(): void {
        const ammunitionsByType = this.inventory.getAmmunitionsByType();
        const weapon = this.getWeapon();
        const weaponAmmunition = weapon.getAmmunition()!;
        const ammunition = ammunitionsByType[weaponAmmunition.getType()];
        const remainingAmmunition = weapon.reload(ammunition);
        ammunitionsByType[weaponAmmunition.getType()] = remainingAmmunition;
    }
}

export default ReloadAction;
