import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
import Scene from '../core/Scene';

class NarrationEngine {
    private scene: Scene;

    constructor({ scene }: { scene: Scene }) {
        this.scene = scene;
    }

    getPlayerActions(): ActionsMap {
        const actionBuilder = new ActionBuilder({
            scene: this.scene,
            actor: this.scene.getPlayer(),
        });
        return actionBuilder.buildActions();
    }
}

export default NarrationEngine;
