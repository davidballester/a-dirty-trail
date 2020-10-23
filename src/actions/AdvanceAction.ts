import Action from './Action';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';

class AdvanceAction extends Action<void> {
    public static readonly TYPE = 'advance';

    private narration: Narration;

    constructor({
        actor,
        narration,
        name,
    }: {
        actor: Actor;
        narration: Narration;
        name: string;
    }) {
        super({ type: AdvanceAction.TYPE, name, actor });
        this.narration = narration;
    }

    canExecute(scene: Scene): boolean {
        if (!super.canExecute(scene)) {
            return false;
        }
        return !scene.isCombat();
    }

    execute(scene: Scene): void {
        this.narration.loadNextScene(scene);
    }
}

export default AdvanceAction;
