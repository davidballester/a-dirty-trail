import AdvanceAction, { NextSceneDecider } from './AdvanceAction';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';

describe('AdvanceAction', () => {
    let janeDoe: Actor;
    let janeDoeIsAlive: jest.SpyInstance;
    let scene: Scene;
    let sceneContainsActor: jest.SpyInstance;
    let narration: Narration;
    let loadNextScene: jest.SpyInstance;
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
    });

    it('initializes without errors', () => {
        new AdvanceAction({
            scene,
            actor: janeDoe,
            name: 'Go on',
            narration,
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
        let nextSceneDecider: NextSceneDecider;
        let nextScene: Scene;
        beforeEach(() => {
            nextScene = ({
                id: 'next scene',
            } as unknown) as Scene;
            nextSceneDecider = jest.fn().mockReturnValue(nextScene);
        });

        it('invokes the loadScene method of the narration', async () => {
            const loadSpy = jest.spyOn(narration, 'loadNextScene');
            const action = new AdvanceAction({
                scene,
                actor: janeDoe,
                name: 'Go on',
                narration,
            });
            await action.execute();
            expect(loadSpy).toHaveBeenCalledWith(undefined);
        });

        it('invokes the loadScene method of the narration with the result of the next scene decider', async () => {
            const loadSpy = jest.spyOn(narration, 'loadNextScene');
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
    });
});
