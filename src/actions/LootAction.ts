import Action from './Action';
import Actor from '../core/Actor';
import Inventory from '../core/Inventory';
import Scene from '../core/Scene';
import NonPlayableActor from '../core/NonPlayableActor';

class LootAction extends Action<Inventory> {
    public static readonly TYPE = 'loot';

    private oponent: NonPlayableActor;

    constructor({
        scene,
        actor,
        oponent,
    }: {
        scene: Scene;
        actor: Actor;
        oponent: NonPlayableActor;
    }) {
        super({ type: LootAction.TYPE, scene, actor });
        this.oponent = oponent;
    }

    getOponent(): NonPlayableActor {
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
        const oponent = this.getOponent();
        const actorInventory = this.getActor().getInventory();
        const oponentInventory = oponent.getInventory();
        const loot = actorInventory.loot(oponentInventory);
        this.scene.removeActor(oponent);
        return loot;
    }
}

export default LootAction;
