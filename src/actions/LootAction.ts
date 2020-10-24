import Action from './Action';
import Actor from '../core/Actor';
import Inventory from '../core/Inventory';
import Scene from '../core/Scene';

class LootAction extends Action<Inventory> {
    public static readonly TYPE = 'loot';

    private oponent: Actor;

    constructor({
        scene,
        actor,
        oponent,
    }: {
        scene: Scene;
        actor: Actor;
        oponent: Actor;
    }) {
        super({ type: LootAction.TYPE, scene, actor });
        this.oponent = oponent;
    }

    getOponent(): Actor {
        return this.oponent;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        const oponent = this.getOponent();
        return !oponent.isAlive();
    }

    execute(): Inventory {
        const actorInventory = this.getActor().getInventory();
        const oponentInventory = this.getOponent().getInventory();
        const loot = actorInventory.loot(oponentInventory);
        return loot;
    }
}

export default LootAction;
