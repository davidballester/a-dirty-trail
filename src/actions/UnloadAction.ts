import Action from './Action';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';

class UnloadAction extends Action<void> {
    public static readonly TYPE = 'unload';

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
        super({ type: UnloadAction.TYPE, scene, actor });
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
        if (weaponAmmunition.getCurrent() === 0) {
            return false;
        }
        return true;
    }

    execute(): void {
        const inventory = this.getActor().getInventory();
        const weapon = this.getWeapon();
        const weaponAmmunition = weapon.getAmmunition();
        const currentAmmunition = weaponAmmunition.getCurrent();
        const ammunitionInventory = new Inventory({
            ammunitionsByType: {
                [weaponAmmunition.getType()]: currentAmmunition,
            },
        });
        inventory.loot(ammunitionInventory);
        weaponAmmunition.modify(-currentAmmunition);
    }
}

export default UnloadAction;
