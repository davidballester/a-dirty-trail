import Action from './Action';
import Actor from '../core/Actor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import Scene from '../core/Scene';
import SkillSet from '../core/SkillSet';

describe('Action', () => {
    class CustomAction extends Action<number> {
        canExecute(): boolean {
            return super.canExecute();
        }
        execute(): number {
            throw new Error('not supported');
        }
    }

    let action: Action<number>;
    let scene: Scene;
    let actor: Actor;
    beforeEach(() => {
        actor = new Actor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        scene = new Scene({
            player: actor,
            setup: [],
            actors: [],
            actions: [],
        });
        action = new CustomAction({
            scene,
            type: 'custom',
            name: 'myAction',
            actor: actor,
        });
    });

    describe('getType', () => {
        it('returns the type', () => {
            const type = action.getType();
            expect(type).toEqual('custom');
        });
    });

    describe('getName', () => {
        it('returns the name', () => {
            const name = action.getName();
            expect(name).toEqual('myAction');
        });

        it('returns no name if the action has no name', () => {
            const action = new CustomAction({ scene, type: 'custom', actor });
            const name = action.getName();
            expect(name).toBeUndefined();
        });
    });

    describe('getActor', () => {
        it('returns the actor', () => {
            const returnedActor = action.getActor();
            expect(returnedActor).toEqual(actor);
        });
    });

    describe('canExecute', () => {
        let actorIsAlive: jest.SpyInstance;
        let sceneContainsActor: jest.SpyInstance;
        beforeEach(() => {
            actorIsAlive = jest.spyOn(actor, 'isAlive').mockReturnValue(true);
            sceneContainsActor = jest
                .spyOn(scene, 'containsActor')
                .mockReturnValue(true);
        });

        it('returns false if the actor is not alive', () => {
            actorIsAlive.mockReturnValue(false);
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
});
