import AdvanceAction, { NextSceneDecider } from './AdvanceAction';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';

describe('AdvanceAction', () => {
    let janeDoe: Actor;
    let janeDoeIsAlive: jest.SpyInstance;
    let scene: Scene;
    let sceneContainsActor: jest.SpyInstance;
    let narration: Narration;
    let loadNextScene: jest.SpyInstance;
    let nextSceneDecider: NextSceneDecider;
    beforeEach(() => {
        janeDoeIsAlive = jest.fn().mockReturnValue(true);
        janeDoe = ({
            id: 'jane doe',
            isAlive: janeDoeIsAlive,
        } as unknown) as Actor;
        sceneContainsActor = jest.fn().mockReturnValue(true);
        scene = ({
            id: 'scene',
            containsActor: sceneContainsActor,
            isCombat: jest.fn().mockReturnValue(false),
        } as unknown) as Scene;
        loadNextScene = jest.fn();
        narration = ({
            loadNextScene,
        } as unknown) as Narration;
        nextSceneDecider = (jest.fn() as unknown) as NextSceneDecider;
    });

    it('initializes without errors', () => {
        new AdvanceAction({
            scene,
            actor: janeDoe,
            name: 'Go on',
            narration,
            nextSceneDecider,
        });
    });

    describe('canExecute', () => {
        let action: AdvanceAction;
        beforeEach(() => {
            action = new AdvanceAction({
                scene,
                actor: janeDoe,
                name: 'Go on',
                narration,
                nextSceneDecider,
            });
        });

        it('returns false if the actor is not alive', () => {
            janeDoeIsAlive.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the actor is not in the scene', () => {
            sceneContainsActor.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns true otherwise', () => {
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(true);
        });
    });

    describe('execute', () => {
        let nextScene: Scene;
        let loadSpy: jest.SpyInstance;
        beforeEach(() => {
            nextScene = ({
                id: 'next scene',
            } as unknown) as Scene;
            ((nextSceneDecider as unknown) as jest.SpyInstance).mockReturnValue(
                nextScene
            );
            loadSpy = jest.spyOn(narration, 'loadNextScene');
        });

        it('invokes the loadNextScene method of the narration with the result of the next scene decider', async () => {
            const action = new AdvanceAction({
                scene,
                actor: janeDoe,
                name: 'Go on',
                narration,
                nextSceneDecider,
            });
            await action.execute();
            expect(loadSpy).toHaveBeenCalledWith(nextScene);
        });

        it('invokes the side effect as part of the execution', async () => {
            const sideEffect = jest.fn();
            const action = new AdvanceAction({
                scene,
                actor: janeDoe,
                name: 'Go on',
                narration,
                nextSceneDecider,
                sideEffect,
            });
            await action.execute();
            expect(sideEffect).toHaveBeenCalledWith(scene);
        });
    });
});
