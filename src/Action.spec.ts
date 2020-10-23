import Action from './Action';
import Actor from './Actor';
import Health from './Health';
import Inventory from './Inventory';
import Scene from './Scene';
import SkillSet from './SkillSet';

describe('Action', () => {
    class CustomAction extends Action<number> {
        canExecute(scene: Scene): boolean {
            return true;
        }
        execute(scene: Scene): number {
            return 1;
        }
    }

    let action: Action<number>;
    let actor: Actor;
    beforeEach(() => {
        actor = new Actor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        action = new CustomAction({
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
            const action = new CustomAction({ type: 'custom', actor });
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
});
