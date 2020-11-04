import Action from './Action';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';

class AdvanceAction extends Action<void> {
    public static readonly TYPE = 'advance';

    private narration: Narration;
    private nextSceneDecider: NextSceneDecider;
    private sideEffect: SideEffect;

    constructor({
        actor,
        scene,
        narration,
        name,
        nextSceneDecider,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        sideEffect = () => {},
    }: {
        actor: Actor;
        scene: Scene;
        narration: Narration;
        name?: string;
        nextSceneDecider: NextSceneDecider;
        sideEffect?: SideEffect;
    }) {
        super({ type: AdvanceAction.TYPE, name, scene, actor });
        this.narration = narration;
        this.nextSceneDecider = nextSceneDecider;
        this.sideEffect = sideEffect;
    }

    canExecute(): boolean {
        if (!super.canExecute()) {
            return false;
        }
        return !this.scene.isCombat();
    }

    async execute(): Promise<void> {
        this.sideEffect(this.scene);
        const nextScene = await this.nextSceneDecider(this.scene);
        this.narration.loadNextScene(nextScene);
    }
}

export type NextSceneDecider = (currentScene: Scene) => Scene | Promise<Scene>;
export type SideEffect = (scene: Scene) => void;

export default AdvanceAction;
