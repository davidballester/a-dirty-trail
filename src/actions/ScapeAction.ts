import Action from './Action';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';

class ScapeAction extends Action<void> {
    public static readonly TYPE = 'scape';

    constructor({ actor, scene }: { actor: NonPlayableActor; scene: Scene }) {
        super({ type: ScapeAction.TYPE, scene, actor });
    }

    execute(): void {
        this.scene.removeActor(this.getActor() as NonPlayableActor);
    }
}

export default ScapeAction;
