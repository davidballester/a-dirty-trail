import Action from '../actions/Action';
import ActionsMap from './ActionsMap';
import Actor from './Actor';
import Health from './Health';
import Inventory from './Inventory';
import Scene from './Scene';
import SkillSet from './SkillSet';

describe('ActionsMap', () => {
    class CustomAction extends Action<number> {
        canExecute(scene: Scene): boolean {
            throw new Error('Method not implemented.');
        }
        execute(scene: Scene): number {
            throw new Error('Method not implemented.');
        }
    }

    let action: CustomAction;
    let actionsMap: ActionsMap;
    let janeDoe: Actor;
    beforeEach(() => {
        janeDoe = new Actor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        action = new CustomAction({
            type: 'custom',
            name: 'myAction',
            actor: janeDoe,
        });
        actionsMap = new ActionsMap({ actions: [action] });
    });

    describe('getActionsOfType', () => {
        it('returns the actions of the given type', () => {
            const actions = actionsMap.getActionsOfType('custom');
            expect(actions).toEqual([action]);
        });

        it('returns an empty array for an unknown type', () => {
            const actions = actionsMap.getActionsOfType('foo');
            expect(actions).toEqual([]);
        });
    });

    describe('addAction', () => {
        it('adds the action to the list of existing actions of that type', () => {
            actionsMap.addAction(action);
            const actions = actionsMap.getActionsOfType('custom');
            expect(actions).toEqual([action, action]);
        });

        it('adds the action to a new list for the new type', () => {
            const anotherAction = new CustomAction({
                type: 'anotherType',
                name: 'myAction',
                actor: janeDoe,
            });
            actionsMap.addAction(anotherAction);
            const actions = actionsMap.getActionsOfType('anotherType');
            expect(actions).toEqual([anotherAction]);
        });
    });
});
