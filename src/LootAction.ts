import Action from './Action';
import Actor from './Actor';
import Inventory from './Inventory';
import Scene from './Scene';

class LootAction extends Action<Inventory> {
    public static readonly TYPE = 'loot';

    private oponent: Actor;

    constructor({ actor, oponent }: { actor: Actor; oponent: Actor }) {
        super({ type: LootAction.TYPE, actor });
        this.oponent = oponent;
    }

    getOponent(): Actor {
        return this.oponent;
    }

    canExecute(scene: Scene): boolean {
        if (!super.canExecute(scene)) {
            return false;
        }
        const oponent = this.getOponent();
        return !oponent.isAlive();
    }

    execute(scene: Scene): Inventory {
        const actorInventory = this.getActor().getInventory();
        const oponentInventory = this.getOponent().getInventory();
        const loot = actorInventory.loot(oponentInventory);
        return loot;
    }
}

export default LootAction;
