import Action from '../actions/Action';
import AdvanceAction from '../actions/AdvanceAction';
import AttackAction from '../actions/AttackAction';
import DiscardWeaponAction from '../actions/DiscardWeaponAction';
import LootAction from '../actions/LootAction';
import ReloadAction from '../actions/ReloadAction';
import ScapeAction from '../actions/ScapeAction';
import UnloadAction from '../actions/UnloadAction';
import ActionsMap from './ActionsMap';

describe('ActionsMap', () => {
    let action: Action<any>;
    let actionsMap: ActionsMap;
    beforeEach(() => {
        action = ({
            id: 'action',
            getType: jest.fn().mockReturnValue('custom'),
        } as unknown) as Action<any>;
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
            const anotherAction = ({
                id: 'another-action',
                getType: jest.fn().mockReturnValue('anotherType'),
            } as unknown) as Action<any>;
            actionsMap.addAction(anotherAction);
            const actions = actionsMap.getActionsOfType('anotherType');
            expect(actions).toEqual([anotherAction]);
        });
    });

    describe('get specific action types', () => {
        let attackAction: AttackAction;
        let reloadAction: ReloadAction;
        let unloadAction: UnloadAction;
        let discardWeaponAction: DiscardWeaponAction;
        let lootAction: LootAction;
        let advanceAction: AdvanceAction;
        let scapeAction: ScapeAction;
        beforeEach(() => {
            attackAction = ({
                id: 'attack-action',
                getType: jest.fn().mockReturnValue(AttackAction.TYPE),
            } as unknown) as AttackAction;
            reloadAction = ({
                id: 'reload-action',
                getType: jest.fn().mockReturnValue(ReloadAction.TYPE),
            } as unknown) as ReloadAction;
            unloadAction = ({
                id: 'unload-action',
                getType: jest.fn().mockReturnValue(UnloadAction.TYPE),
            } as unknown) as UnloadAction;
            discardWeaponAction = ({
                id: 'discard-weapon-action',
                getType: jest.fn().mockReturnValue(DiscardWeaponAction.TYPE),
            } as unknown) as UnloadAction;
            lootAction = ({
                id: 'loot-action',
                getType: jest.fn().mockReturnValue(LootAction.TYPE),
            } as unknown) as LootAction;
            advanceAction = ({
                id: 'advance-action',
                getType: jest.fn().mockReturnValue(AdvanceAction.TYPE),
            } as unknown) as AdvanceAction;
            scapeAction = ({
                id: 'scape-action',
                getType: jest.fn().mockReturnValue(ScapeAction.TYPE),
            } as unknown) as ScapeAction;

            actionsMap = new ActionsMap({
                actions: [
                    attackAction,
                    reloadAction,
                    unloadAction,
                    discardWeaponAction,
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

        describe('getUnloadActions', () => {
            it('returns the unload actions', () => {
                const unloadActions = actionsMap.getUnloadActions();
                expect(unloadActions).toEqual([unloadAction]);
            });
        });

        describe('getDiscardWeaponActions', () => {
            it('returns the discard weapon actions', () => {
                const discardWeaponActions = actionsMap.getDiscardWeaponActions();
                expect(discardWeaponActions).toEqual([discardWeaponAction]);
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
