import Action from './Action';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';

class AdvanceAction extends Action<void> {
    public static readonly TYPE = 'advance';

    private narration: Narration;
    private nextSceneDecider: NextSceneDecider;

    constructor({
        actor,
        scene,
        narration,
        name,
        nextSceneDecider = () => undefined,
    }: {
        actor: Actor;
        scene: Scene;
        narration: Narration;
        name: string;
        nextSceneDecider?: NextSceneDecider;
    }) {
        super({ type: AdvanceAction.TYPE, name, scene, actor });
        this.narration = narration;
        this.nextSceneDecider = nextSceneDecider;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        return !this.scene.isCombat();
    }

    execute(): void {
        const nextScene = this.nextSceneDecider(this.scene);
        this.narration.loadNextScene(nextScene);
    }
}

export type NextSceneDecider = (currentScene: Scene) => Scene | undefined;

export default AdvanceAction;
