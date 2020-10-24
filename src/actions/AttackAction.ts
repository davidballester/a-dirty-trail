import Action from './Action';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import Weapon, { AttackOutcome } from '../core/Weapon';

class AttackAction extends Action<AttackOutcome> {
    public static readonly TYPE = 'attack';

    private oponent: Actor;
    private weapon: Weapon;

    constructor({
        actor,
        scene,
        oponent,
        weapon,
    }: {
        actor: Actor;
        scene: Scene;
        oponent: Actor;
        weapon: Weapon;
    }) {
        super({ type: AttackAction.TYPE, actor, scene });
        this.oponent = oponent;
        this.weapon = weapon;
    }

    getOponent(): Actor {
        return this.oponent;
    }

    getWeapon(): Weapon {
        return this.weapon;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        const weapon = this.getWeapon();
        if (!weapon.canAttack()) {
            return false;
        }
        const oponent = this.getOponent();
        const isOponentAlive = oponent.isAlive();
        const isOponentInScene = this.scene.containsActor(oponent);
        return isOponentAlive && isOponentInScene;
    }

    execute(): AttackOutcome {
        const weapon = this.getWeapon();
        const actor = this.getActor();
        const oponent = this.getOponent();
        return weapon.attack(actor, oponent);
    }
}

export default AttackAction;
