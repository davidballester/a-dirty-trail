import AdvanceAction from './AdvanceAction';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';

describe('AdvanceAction', () => {
    class CustomNarration extends Narration {
        loadNextScene(scene: Scene): void {}
    }

    let janeDoe: Actor;
    let scene: Scene;
    let narration: Narration;
    beforeEach(() => {
        janeDoe = new Actor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        scene = new Scene({
            player: janeDoe,
            setup: [],
            actors: [],
            actions: [],
        });
        narration = new CustomNarration({ title: 'My narration ' });
    });

    it('initializes without errors', () => {
        new AdvanceAction({ actor: janeDoe, name: 'Go on', narration });
    });

    describe('canExecute', () => {
        let actorIsAlive: jest.SpyInstance;
        let sceneContainsActor: jest.SpyInstance;
        let action: AdvanceAction;
        beforeEach(() => {
            actorIsAlive = jest.spyOn(janeDoe, 'isAlive').mockReturnValue(true);
            sceneContainsActor = jest
                .spyOn(scene, 'containsActor')
                .mockReturnValue(true);
            action = new AdvanceAction({
                actor: janeDoe,
                name: 'Go on',
                narration,
            });
        });

        it('returns false if the actor is not alive', () => {
            actorIsAlive.mockReturnValue(false);
            const canExecute = action.canExecute(scene);
            expect(canExecute).toEqual(false);
        });

        it('returns false if the actor is not in the scene', () => {
            sceneContainsActor.mockReturnValue(false);
            const canExecute = action.canExecute(scene);
            expect(canExecute).toEqual(false);
        });

        it('returns true otherwise', () => {
            const canExecute = action.canExecute(scene);
            expect(canExecute).toEqual(true);
        });
    });

    describe('execute', () => {
        it('invokes the loadScene method of the narration', () => {
            const loadSpy = jest.spyOn(narration, 'loadNextScene');
            const action = new AdvanceAction({
                actor: janeDoe,
                name: 'Go on',
                narration,
            });
            action.execute(scene);
            expect(loadSpy).toHaveBeenCalledWith(scene);
        });
    });
});
