import { when } from 'jest-when';
import AttackAction from '../actions/AttackAction';
import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import { AttackOutcome } from '../core/Weapon';
import CombatEngine from './CombatEngine';
import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
jest.mock('../actions/ActionBuilder');

describe('CombatEngine', () => {
    let combatEngine: CombatEngine;
    let scene: Scene;
    let sceneGetAliveActors: jest.SpyInstance;
    let sceneContainsActor: jest.SpyInstance;
    let janeDoe: Actor;
    let janeDoeAction: AttackAction;
    let janeDoeActionOutcome: AttackOutcome;
    let janeDoeActionExecute: jest.SpyInstance;
    let janeDoeActionCanExecute: jest.SpyInstance;
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
        janeDoeActionCanExecute = jest.fn().mockReturnValue(true);
        janeDoeActionOutcome = {} as AttackOutcome;
        janeDoeActionExecute = jest.fn().mockReturnValue(janeDoeActionOutcome);
        janeDoeAction = ({
            canExecute: janeDoeActionCanExecute,
            execute: janeDoeActionExecute,
        } as unknown) as AttackAction;
        const janeDoeIsAlive = jest.fn().mockReturnValue(true);
        const janeDoeEquals = jest.fn();
        janeDoe = ({
            id: 'jane doe',
            isAlive: janeDoeIsAlive,
            equals: janeDoeEquals,
        } as unknown) as Actor;
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
        scene = ({
            getAliveActors: sceneGetAliveActors,
            getPlayer,
            containsActor: sceneContainsActor,
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
        combatEngine = new CombatEngine({ scene });
    });

    describe('getActorCurrentTurn', () => {
        it('returns the player', () => {
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent actor after advancing turn', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(johnDoe);
        });

        it('is the player oponent actor after advancing turn twice', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            await combatEngine.executeNextOponentAction();
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent actor after advancing turn three times', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            await combatEngine.executeNextOponentAction();
            await combatEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });
    });

    describe('getOponentsInActionOrder', () => {
        it('returns the oponents in the order specified on the scene', () => {
            const oponentsInActionOrder = combatEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([johnDoe, jillBloggs]);
        });
    });

    describe('executePlayerAction', () => {
        it('executes the action', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            expect(janeDoeActionExecute).toHaveBeenCalled();
        });

        it('returns the action outcome', async () => {
            const outcome = await combatEngine.executePlayerAction(
                janeDoeAction
            );
            expect(outcome).toEqual(janeDoeActionOutcome);
        });

        it('throws an error if the action cannot be executed', async () => {
            janeDoeActionCanExecute.mockReturnValue(false);
            try {
                await combatEngine.executePlayerAction(janeDoeAction);
                fail('expected an error');
            } catch (err) {}
            expect(janeDoeActionExecute).not.toHaveBeenCalled();
        });

        it('throws an error if it is not the player turn', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            janeDoeActionExecute.mockClear();
            try {
                await combatEngine.executePlayerAction(janeDoeAction);
                fail('expected an error');
            } catch (err) {}
            expect(janeDoeActionExecute).not.toHaveBeenCalled();
        });
    });

    describe('executeNextOponentAction', () => {
        it('throws an error if it is not the oponent turn', async () => {
            try {
                await combatEngine.executeNextOponentAction();
                fail('expected an error');
            } catch (err) {}
        });

        it('returns undefined if the action cannot be executed', async () => {
            johnDoeActionCanExecute.mockReturnValue(false);
            await combatEngine.executePlayerAction(janeDoeAction);
            const actionAndOutcome = await combatEngine.executeNextOponentAction();
            expect(actionAndOutcome).toBeUndefined();
        });

        it('returns the action and the outcome', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const actionAndOutcome = await combatEngine.executeNextOponentAction();
            expect(actionAndOutcome).toEqual([
                johnDoeAction,
                johnDoeActionOutcome,
            ]);
        });
    });

    describe('next oponent is killed', () => {
        beforeEach(() => {
            sceneGetAliveActors.mockReturnValue([jillBloggs]);
            johnDoeIsAlive.mockReturnValue(false);
        });

        it('is the player turn again', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent turn after the player', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            await combatEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });

        it('updates the list of oponents in order', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const oponentsInActionOrder = combatEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([jillBloggs]);
        });
    });

    describe('last oponent is killed', () => {
        beforeEach(() => {
            sceneGetAliveActors.mockReturnValue([johnDoe]);
            jillBloggsIsAlive.mockReturnValue(false);
        });

        it('is john doe turn', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(johnDoe);
        });

        it('is player turn after john doe', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            await combatEngine.executeNextOponentAction();
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is john doe turn again after the player', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            await combatEngine.executeNextOponentAction();
            await combatEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(johnDoe);
        });

        it('updates the list of oponents in order', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const oponentsInActionOrder = combatEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([johnDoe]);
        });
    });

    describe('current oponent scapes', () => {
        beforeEach(async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            sceneGetAliveActors.mockReturnValue([jillBloggs]);
            when(sceneContainsActor)
                .mockReturnValue(true)
                .calledWith(johnDoe)
                .mockReturnValue(false);
            await combatEngine.executeNextOponentAction();
        });

        it('is the player turn again', () => {
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(janeDoe);
        });

        it('is the second oponent turn after the player', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const actorCurrentTurn = combatEngine.getActorCurrentTurn();
            expect(actorCurrentTurn).toEqual(jillBloggs);
        });

        it('updates the list of oponents in order', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            const oponentsInActionOrder = combatEngine.getOponentsInActionOrder();
            expect(oponentsInActionOrder).toEqual([jillBloggs]);
        });
    });

    describe('getPlayerActions', () => {
        it('throws an error if it is not the player turn', async () => {
            await combatEngine.executePlayerAction(janeDoeAction);
            try {
                combatEngine.getPlayerActions();
                fail('expected an error');
            } catch (err) {}
        });

        it('returns the actions map', () => {
            const playerActions = combatEngine.getPlayerActions();
            expect(playerActions).toEqual(janeDoeActions);
        });
    });
});
