import Action from '../actions/Action';
import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
import Scene from '../core/Scene';

class NarrativeSceneEngine {
    private scene: Scene;
    private playerActions: ActionsMap;

    constructor({ scene }: { scene: Scene }) {
        this.scene = scene;
        const actionBuilder = new ActionBuilder({
            scene: this.scene,
            actor: this.scene.getPlayer(),
        });
        this.playerActions = actionBuilder.buildActions();
    }

    getPlayerActions(): ActionsMap {
        return this.playerActions;
    }

    executePlayerAction<T>(action: Action<T>): T | Promise<T> {
        if (!action.canExecute()) {
            throw new Error('The action cannot be executed!');
        }
        return action.execute();
    }

    isNarrationFinished(): boolean {
        const playerActions = this.getPlayerActions();
        const advanceActions = playerActions.getAdvanceActions();
        return !advanceActions.length;
    }
}

export default NarrativeSceneEngine;
