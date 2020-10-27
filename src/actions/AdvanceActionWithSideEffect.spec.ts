import AdvanceActionWithSideEffect, {
    SideEffect,
} from './AdvanceActionWithSideEffect';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
import { NextSceneDecider } from './AdvanceAction';

describe('AdvanceActionWithSideEffect', () => {
    let janeDoe: Actor;
    let scene: Scene;
    let narration: Narration;
    let sideEffect: SideEffect;
    let nextSceneDecider: NextSceneDecider;
    beforeEach(() => {
        janeDoe = ({
            id: 'jane doe',
        } as unknown) as Actor;
        scene = ({
            id: 'scene',
        } as unknown) as Scene;
        narration = ({
            loadNextScene: jest.fn(),
        } as unknown) as Narration;
        sideEffect = jest.fn();
        nextSceneDecider = (jest.fn() as unknown) as NextSceneDecider;
    });

    it('initializes without errors', () => {
        new AdvanceActionWithSideEffect({
            scene,
            actor: janeDoe,
            name: 'Go on',
            narration,
            sideEffect,
            nextSceneDecider,
        });
    });

    describe('execute', () => {
        it('invokes the side effect with the scene as argument', () => {
            new AdvanceActionWithSideEffect({
                scene,
                actor: janeDoe,
                name: 'Go on',
                narration,
                sideEffect,
                nextSceneDecider,
            }).execute();
            expect(sideEffect).toHaveBeenCalledWith(scene);
        });
    });
});
