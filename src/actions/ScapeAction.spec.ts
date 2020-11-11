import ScapeAction from './ScapeAction';
import Scene from '../core/Scene';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import NonPlayableActor from '../core/NonPlayableActor';

describe('ScapeAction', () => {
    let janeDoe: NonPlayableActor;
    let scene: Scene;
    beforeEach(() => {
        janeDoe = new NonPlayableActor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        scene = new Scene({
            id: 'foo',
            title: 'Foo',
            player: janeDoe,
            actors: [janeDoe],
            actions: [],
        });
    });

    it('initializes without errors', () => {
        new ScapeAction({
            scene,
            actor: janeDoe,
        });
    });

    describe('execute', () => {
        it('invokes the removeActor method of the scene', () => {
            const removeActorSpy = jest.spyOn(scene, 'removeActor');
            const action = new ScapeAction({
                scene,
                actor: janeDoe,
            });
            action.execute();
            expect(removeActorSpy).toHaveBeenCalledWith(janeDoe);
        });
    });
});
