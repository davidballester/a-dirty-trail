import Action from '../actions/Action';
import AdvanceAction from '../actions/AdvanceAction';
import AttackAction from '../actions/AttackAction';
import LootAction from '../actions/LootAction';
import ReloadAction from '../actions/ReloadAction';
import ScapeAction from '../actions/ScapeAction';
import ActionsMap from './ActionsMap';
import Actor from './Actor';
import Damage from './Damage';
import Health from './Health';
import Inventory from './Inventory';
import Narration from './Narration';
import NonPlayableActor from './NonPlayableActor';
import Scene from './Scene';
import SkillSet from './SkillSet';
import Weapon from './Weapon';
import WeaponAmmunition from './WeaponAmmunition';

describe('ActionsMap', () => {
    class CustomAction extends Action<number> {
        canExecute(): boolean {
            throw new Error('Method not implemented.');
        }
        execute(): number {
            throw new Error('Method not implemented.');
        }
    }

    let action: CustomAction;
    let actionsMap: ActionsMap;
    let janeDoe: Actor;
    let scene: Scene;
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
        action = new CustomAction({
            scene,
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
                scene,
                type: 'anotherType',
                name: 'myAction',
                actor: janeDoe,
            });
            actionsMap.addAction(anotherAction);
            const actions = actionsMap.getActionsOfType('anotherType');
            expect(actions).toEqual([anotherAction]);
        });
    });

    describe('get specific action types', () => {
        let attackAction: AttackAction;
        let reloadAction: ReloadAction;
        let lootAction: LootAction;
        let advanceAction: AdvanceAction;
        let scapeAction: ScapeAction;
        beforeEach(() => {
            const revolver = new Weapon({
                name: 'revolver',
                type: 'gun',
                skill: 'aim',
                damage: new Damage({ min: 1, max: 2 }),
                ammunition: new WeaponAmmunition({
                    type: 'bullets',
                    current: 1,
                    max: 6,
                }),
            });
            attackAction = new AttackAction({
                actor: janeDoe,
                scene,
                oponent: janeDoe,
                weapon: revolver,
            });
            reloadAction = new ReloadAction({
                scene,
                actor: janeDoe,
                weapon: revolver,
            });
            lootAction = new LootAction({
                scene,
                actor: janeDoe,
                oponent: janeDoe as NonPlayableActor,
            });
            advanceAction = new AdvanceAction({
                scene,
                actor: janeDoe,
                narration: ({} as unknown) as Narration,
                name: 'Go on',
            });
            scapeAction = new ScapeAction({
                scene,
                actor: janeDoe as NonPlayableActor,
            });

            actionsMap = new ActionsMap({
                actions: [
                    attackAction,
                    reloadAction,
                    lootAction,
                    advanceAction,
                    scapeAction,
                ],
            });
        });

        describe('getAttackActions', () => {
            it('returns the attack actions', () => {
                const attackActions = actionsMap.getAttackActions();
                expect(attackActions).toEqual([attackAction]);
            });
        });

        describe('getReloadActions', () => {
            it('returns the reload actions', () => {
                const reloadActions = actionsMap.getReloadActions();
                expect(reloadActions).toEqual([reloadAction]);
            });
        });

        describe('getLootActions', () => {
            it('returns the loot actions', () => {
                const lootActions = actionsMap.getLootActions();
                expect(lootActions).toEqual([lootAction]);
            });
        });

        describe('getAdvanceActions', () => {
            it('returns the advance actions', () => {
                const advanceActions = actionsMap.getAdvanceActions();
                expect(advanceActions).toEqual([advanceAction]);
            });
        });

        describe('getScapeAction', () => {
            it('returns the scape action', () => {
                const returnedScapeAction = actionsMap.getScapeAction();
                expect(returnedScapeAction).toEqual(scapeAction);
            });
        });
    });
});
