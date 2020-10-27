import Action from './Action';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import Firearm from '../core/Firearm';

class ReloadAction extends Action<void> {
    public static readonly TYPE = 'reload';

    private weapon: Firearm;

    constructor({
        scene,
        actor,
        weapon,
    }: {
        scene: Scene;
        actor: Actor;
        weapon: Firearm;
    }) {
        super({ type: ReloadAction.TYPE, scene, actor });
        this.weapon = weapon;
    }

    getWeapon(): Firearm {
        return this.weapon;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        const weapon = this.getWeapon();
        const weaponAmmunition = weapon.getAmmunition();
        if (weaponAmmunition.getCurrent() === weaponAmmunition.getMax()) {
            return false;
        }
        const inventory = this.getActor().getInventory();
        const ammunitionsByType = inventory.getAmmunitionsByType();
        const ammunition = ammunitionsByType[weaponAmmunition.getType()];
        if (!ammunition) {
            return false;
        }
        return true;
    }

    execute(): void {
        const inventory = this.getActor().getInventory();
        const ammunitionsByType = inventory.getAmmunitionsByType();
        const weapon = this.getWeapon();
        const weaponAmmunition = weapon.getAmmunition();
        const ammunition = ammunitionsByType[weaponAmmunition.getType()];
        const remainingAmmunition = weapon.reload(ammunition);
        ammunitionsByType[weaponAmmunition.getType()] = remainingAmmunition;
    }
}

export default ReloadAction;
