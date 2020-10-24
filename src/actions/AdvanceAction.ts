import Action from './Action';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';

class AdvanceAction extends Action<void> {
    public static readonly TYPE = 'advance';

    private narration: Narration;

    constructor({
        actor,
        scene,
        narration,
        name,
    }: {
        actor: Actor;
        scene: Scene;
        narration: Narration;
        name: string;
    }) {
        super({ type: AdvanceAction.TYPE, name, scene, actor });
        this.narration = narration;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        return !this.scene.isCombat();
    }

    execute(): void {
        this.narration.loadNextScene(this.scene);
    }
}

export default AdvanceAction;
