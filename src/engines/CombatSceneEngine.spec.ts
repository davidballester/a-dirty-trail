import { when } from 'jest-when';
import AttackAction from '../actions/AttackAction';
import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import { AttackOutcome } from '../core/Weapon';
import CombatSceneEngine from './CombatSceneEngine';
import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
jest.mock('../actions/ActionBuilder');

describe('CombatSceneEngine', () => {
    let combatSceneEngine: CombatSceneEngine;
    let scene: Scene;
    let sceneGetAliveActors: jest.SpyInstance;
    let sceneContainsActor: jest.SpyInstance;
    let sceneIsCombat: jest.SpyInstance;
    let janeDoe: Actor;
    let janeDoeAction: AttackAction;
    let janeDoeActionOutcome: AttackOutcome;
    let janeDoeActionExecute: jest.SpyInstance;
    let janeDoeActionCanExecute: jest.SpyInstance;
    let janeDoeActionGetOponent: jest.SpyInstance;
    let johnDoe: NonPlayableActor;
    let johnDoeIsAlive: jest.SpyInstance;
    let johnDoeAction: AttackAction;
    let johnDoeActionCanExecute: jest.SpyInstance;
    let johnDoeActionOutcome: AttackOutcome;
    let jillBloggsIsAlive: jest.SpyInstance;
    let jillBloggs: NonPlayableActor;
    let buildActions: jest.SpyInstance;
    let janeDoeActions: ActionsMap;

    const initializeJaneDoe = () => {
        const janeDoeIsAlive = jest.fn().mockReturnValue(true);
        const janeDoeEquals = jest.fn();
        janeDoe = ({
            id: 'jane doe',
            isAlive: janeDoeIsAlive,
            equals: janeDoeEquals,
        } as unknown) as Actor;
        janeDoeAction = new AttackAction({
            actor: janeDoe,
            scene,
            oponent: undefined,
            weapon: undefined,
        });
        janeDoeActionCanExecute = jest
            .spyOn(janeDoeAction, 'canExecute')
            .mockReturnValue(true);
        janeDoeActionOutcome = {} as AttackOutcome;
        janeDoeActionExecute = jest
            .spyOn(janeDoeAction, 'execute')
            .mockReturnValue(janeDoeActionOutcome);
        janeDoeActionGetOponent = jest
            .spyOn(janeDoeAction, 'getOponent')
            .mockImplementation(() => johnDoe);
        when(janeDoeEquals)
            .mockReturnValue(false)
            .calledWith(janeDoe)
            .mockReturnValue(true);
    };

    const initializeJohnDoe = () => {
        johnDoeActionOutcome = {} as AttackOutcome;
        johnDoeActionCanExecute = jest.fn().mockReturnValue(true);
        const johnDoeActionExecute = jest
            .fn()
            .mockReturnValue(johnDoeActionOutcome);
        johnDoeAction = ({
            canExecute: johnDoeActionCanExecute,
            execute: johnDoeActionExecute,
        } as unknown) as AttackAction;
        johnDoeIsAlive = jest.fn().mockReturnValue(true);
        const johnDoeGetNextAction = jest.fn().mockReturnValue(johnDoeAction);
        const johnDoeEquals = jest.fn();
        johnDoe = ({
            id: 'john doe',
            isAlive: johnDoeIsAlive,
            getNextAction: johnDoeGetNextAction,
            equals: johnDoeEquals,
        } as unknown) as NonPlayableActor;
        when(johnDoeEquals)
            .mockReturnValue(false)
            .calledWith(johnDoe)
            .mockReturnValue(true);
    };

    const initializeJillBloggs = () => {
        jillBloggsIsAlive = jest.fn().mockReturnValue(true);
        const jillBloggsEquals = jest.fn();
        jillBloggs = ({
            id: 'jill bloggs',
            isAlive: jillBloggsIsAlive,
            equals: jillBloggsEquals,
            getNextAction: () => ({
                canExecute: () => true,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                execute: () => {},
            }),
        } as unknown) as NonPlayableActor;
        when(jillBloggsEquals)
            .mockReturnValue(false)
            .calledWith(jillBloggs)
            .mockReturnValue(true);
    };

    const initializeScene = () => {
        sceneGetAliveActors = jest.fn().mockReturnValue([johnDoe, jillBloggs]);
        const getPlayer = jest.fn().mockReturnValue(janeDoe);
        sceneContainsActor = jest.fn().mockReturnValue(true);
        sceneIsCombat = jest.fn().mockReturnValue(true);
        scene = ({
            getAliveActors: sceneGetAliveActors,
            getPlayer,
            containsActor: sceneContainsActor,
            isCombat: sceneIsCombat,
        } as unknown) as Scene;
    };

    const initializeActionBuilder = () => {
        const actionBuilderMock = (ActionBuilder as unknown) as jest.Mock;
        janeDoeActions = ({
            id: 'jane doe actions',
        } as unknown) as ActionsMap;
        buildActions = jest.fn().mockReturnValue(janeDoeActions);
        actionBuilderMock.mockImplementation(() => ({
            buildActions,
        }));
    };

    beforeEach(() => {
        initializeJaneDoe();
        initializeJohnDoe();
        initializeJillBloggs();
        initializeScene();
        initializeActionBuilder();
        combatSceneEngine = new CombatSceneEngine({ scene });
    });

    describe('getActorCurrentTurn', () => {
        it('returns the player', () => {
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent actor after advancing turn', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(johnDoe);
        });

        it('is the player oponent actor after advancing turn twice', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent actor after advancing turn three times', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });
    });

    describe('getOponentsInActionOrder', () => {
        it('returns the oponents in the order specified on the scene', () => {
            const oponentsInActionOrder = combatSceneEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([johnDoe, jillBloggs]);
        });
    });

    describe('executePlayerAction', () => {
        it('executes the action', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            expect(janeDoeActionExecute).toHaveBeenCalled();
        });

        it('returns the action outcome', async () => {
            const outcome = await combatSceneEngine.executePlayerAction(
                janeDoeAction
            );
            expect(outcome).toEqual(janeDoeActionOutcome);
        });

        it('throws an error if the action cannot be executed', async () => {
            janeDoeActionCanExecute.mockReturnValue(false);
            try {
                await combatSceneEngine.executePlayerAction(janeDoeAction);
                fail('expected an error');
            } catch (err) {}
            expect(janeDoeActionExecute).not.toHaveBeenCalled();
        });

        it('throws an error if it is not the player turn', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            janeDoeActionExecute.mockClear();
            try {
                await combatSceneEngine.executePlayerAction(janeDoeAction);
                fail('expected an error');
            } catch (err) {}
            expect(janeDoeActionExecute).not.toHaveBeenCalled();
        });
    });

    describe('executeNextOponentAction', () => {
        it('throws an error if it is not the oponent turn', async () => {
            try {
                await combatSceneEngine.executeNextOponentAction();
                fail('expected an error');
            } catch (err) {}
        });

        it('returns undefined if the action cannot be executed', async () => {
            johnDoeActionCanExecute.mockReturnValue(false);
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actionAndOutcome = await combatSceneEngine.executeNextOponentAction();
            expect(actionAndOutcome).toBeUndefined();
        });

        it('advances the turn if the action cannot be executed', async () => {
            johnDoeActionCanExecute.mockReturnValue(false);
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            const nextActor = combatSceneEngine.getActorCurrentTurn();
            expect(nextActor.equals(johnDoe)).toBeFalsy();
        });

        it('returns the action and the outcome', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actionAndOutcome = await combatSceneEngine.executeNextOponentAction();
            expect(actionAndOutcome).toEqual([
                johnDoeAction,
                johnDoeActionOutcome,
            ]);
        });

        it('advances the turn if the action cannot be executed', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            const nextActor = combatSceneEngine.getActorCurrentTurn();
            expect(nextActor.equals(johnDoe)).toBeFalsy();
        });
    });

    describe('next oponent is killed', () => {
        beforeEach(() => {
            janeDoeActionExecute.mockImplementation(() => {
                johnDoeIsAlive.mockReturnValue(false);
                sceneGetAliveActors.mockReturnValue([jillBloggs]);
            });
        });

        it('is the player turn again', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent turn after the player', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            janeDoeActionGetOponent.mockReturnValue(jillBloggs);
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });

        it('updates the list of oponents in order', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const oponentsInActionOrder = combatSceneEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([jillBloggs]);
        });
    });

    describe('last oponent is killed', () => {
        beforeEach(() => {
            janeDoeActionGetOponent.mockReturnValue(jillBloggs);
            janeDoeActionExecute.mockImplementation(() => {
                jillBloggsIsAlive.mockReturnValue(false);
                sceneGetAliveActors.mockReturnValue([johnDoe]);
            });
        });

        it('is john doe turn', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(johnDoe);
        });

        it('is player turn after john doe', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is john doe turn again after the player', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            janeDoeActionGetOponent.mockReturnValue(johnDoe);
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(johnDoe);
        });

        it('updates the list of oponents in order', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const oponentsInActionOrder = combatSceneEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([johnDoe]);
        });
    });

    describe('previous oponent is killed', () => {
        beforeEach(async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            janeDoeActionExecute.mockImplementation(() => {
                johnDoeIsAlive.mockReturnValue(false);
                sceneGetAliveActors.mockReturnValue([jillBloggs]);
            });
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            janeDoeActionGetOponent.mockReturnValue(jillBloggs);
        });

        it('is the next actor turn', async () => {
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });

        it('is the player turn again', async () => {
            await combatSceneEngine.executeNextOponentAction();
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the next actor turn again', async () => {
            await combatSceneEngine.executeNextOponentAction();
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });
    });

    describe('current oponent scapes', () => {
        beforeEach(async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            sceneGetAliveActors.mockReturnValue([jillBloggs]);
            when(sceneContainsActor)
                .mockReturnValue(true)
                .calledWith(johnDoe)
                .mockReturnValue(false);
            await combatSceneEngine.executeNextOponentAction();
        });

        it('is the player turn again', () => {
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent turn after the player', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatSceneEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });

        it('updates the list of oponents in order', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const oponentsInActionOrder = combatSceneEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([jillBloggs]);
        });
    });

    describe('getPlayerActions', () => {
        it('returns an empty actions map if it is not the player turn', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const playerActions = combatSceneEngine.getPlayerActions();
            expect(playerActions).toEqual(new ActionsMap({ actions: [] }));
        });

        it('returns the actions map', () => {
            const playerActions = combatSceneEngine.getPlayerActions();
            expect(playerActions).toEqual(janeDoeActions);
        });
    });

    describe('isCombatOver', () => {
        it('returns false if the scene is combat', () => {
            const isCombatOver = combatSceneEngine.isCombatOver();
            expect(isCombatOver).toBeFalsy();
        });

        it('returns true if the scene is not combat', () => {
            sceneIsCombat.mockReturnValue(false);
            const isCombatOver = combatSceneEngine.isCombatOver();
            expect(isCombatOver).toBeTruthy();
        });
    });

    describe('isPlayerTurn', () => {
        it('returns true if it is the player turn', () => {
            const isPlayerTurn = combatSceneEngine.isPlayerTurn();
            expect(isPlayerTurn).toBeTruthy();
        });

        it('returns true if it is not the player turn', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const isPlayerTurn = combatSceneEngine.isPlayerTurn();
            expect(isPlayerTurn).toBeFalsy();
        });
    });

    describe('getActorNextTurn', () => {
        it('returns the first oponent when it is the player first turn', () => {
            const actorNextTurn = combatSceneEngine.getActorNextTurn();
            expect(actorNextTurn).toEqual(johnDoe);
        });

        it('returns the player when it is the first oponent turn', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorNextTurn = combatSceneEngine.getActorNextTurn();
            expect(actorNextTurn).toEqual(janeDoe);
        });

        it('returns the player when it is last oponent turn', async () => {
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            await combatSceneEngine.executeNextOponentAction();
            await combatSceneEngine.executePlayerAction(janeDoeAction);
            const actorNextTurn = combatSceneEngine.getActorNextTurn();
            expect(actorNextTurn).toEqual(janeDoe);
        });
    });
});
