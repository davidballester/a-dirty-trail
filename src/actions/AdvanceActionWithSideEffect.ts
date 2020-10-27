import Actor from '../core/Actor';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import AdvanceAction, { NextSceneDecider } from './AdvanceAction';

class AdvanceActionWithSideEffect extends AdvanceAction {
    private sideEffect: SideEffect;

    constructor({
        actor,
        scene,
        narration,
        name,
        nextSceneDecider,
        sideEffect,
    }: {
        actor: Actor;
        scene: Scene;
        narration: Narration;
        name: string;
        nextSceneDecider: NextSceneDecider;
        sideEffect: SideEffect;
    }) {
        super({ actor, scene, narration, name, nextSceneDecider });
        this.sideEffect = sideEffect;
    }

    async execute(): Promise<void> {
        this.sideEffect(this.scene);
        await super.execute();
    }
}

export type SideEffect = (scene: Scene) => void;

export default AdvanceActionWithSideEffect;
