import AdvanceActionWithSideEffect, {
    SideEffect,
} from './AdvanceActionWithSideEffect';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';

describe('AdvanceActionWithSideEffect', () => {
    let janeDoe: Actor;
    let scene: Scene;
    let narration: Narration;
    let sideEffect: SideEffect;
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
    });

    it('initializes without errors', () => {
        new AdvanceActionWithSideEffect({
            scene,
            actor: janeDoe,
            name: 'Go on',
            narration,
            sideEffect,
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
            }).execute();
            expect(sideEffect).toHaveBeenCalledWith(scene);
        });
    });
});
