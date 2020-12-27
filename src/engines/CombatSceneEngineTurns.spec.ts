import ScapeAction from '../actions/ScapeAction';
import Actor from '../core/Actor';
import Damage from '../core/Damage';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import Skill from '../core/Skill';
import SkillSet from '../core/SkillSet';
import Weapon, { AttackOutcome } from '../core/Weapon';
import CombatSceneEngine from './CombatSceneEngine';

describe('CombatSceneEngine turns', () => {
    type PlayerTestAction =
        | 'attackJohnDoe'
        | 'attackJillBloggs'
        | 'attackJoeSchmoe'
        | 'killJohnDoe'
        | 'killJillBloggs'
        | 'killJoeSchmoe';
    type OponentTestAction = undefined | 'scape';

    let combatSceneEngine: CombatSceneEngine;
    let janeDoe: Actor;
    let johnDoe: NonPlayableActor;
    let jillBloggs: NonPlayableActor;
    let joeSchmoe: NonPlayableActor;
    let johnDoeIsAlive: jest.SpyInstance;
    let jillBloggsIsAlive: jest.SpyInstance;
    let joeSchmoeIsAlive: jest.SpyInstance;

    const createNonPlayableActor = (name: string): NonPlayableActor =>
        new NonPlayableActor({
            name,
            health: new Health({ current: 2, max: 2 }),
            inventory: new Inventory({
                weapons: [
                    new Weapon({
                        name: 'knife',
                        type: 'knife',
                        skill: 'stab',
                        damage: new Damage({ min: 1, max: 1 }),
                    }),
                ],
            }),
            skillSet: new SkillSet({
                skills: [
                    new Skill({ name: 'stab', probabilityOfSuccess: 0.5 }),
                ],
            }),
        });

    const executePlayerAction = async (
        playerAction: PlayerTestAction
    ): Promise<void> => {
        const allActions = combatSceneEngine
            .getPlayerActions()
            .getAttackActions();
        const action = allActions.find((action) => {
            if (playerAction.endsWith('JohnDoe')) {
                return action.getOponent().getName() === 'john doe';
            } else if (playerAction.endsWith('JillBloggs')) {
                return action.getOponent().getName() === 'jill bloggs';
            } else {
                return action.getOponent().getName() === 'joe schmoe';
            }
        });
        if (playerAction.startsWith('kill')) {
            jest.spyOn(action, 'execute').mockImplementation(() => {
                const oponentName = action.getOponent().getName();
                switch (oponentName) {
                    case 'john doe': {
                        johnDoeIsAlive.mockReturnValue(false);
                        break;
                    }
                    case 'jill bloggs': {
                        jillBloggsIsAlive.mockReturnValue(false);
                        break;
                    }
                    case 'joe schmoe': {
                        joeSchmoeIsAlive.mockReturnValue(false);
                        break;
                    }
                }
                return ({} as any) as AttackOutcome;
            });
        }
        jest.spyOn(action, 'canExecute').mockReturnValue(true);
        await combatSceneEngine.executePlayerAction(action);
    };

    const executeOponentAction = async (
        oponentAction: OponentTestAction
    ): Promise<void> => {
        if (!oponentAction || oponentAction !== 'scape') {
            await combatSceneEngine.executeNextOponentAction();
            return;
        }
        const currentOponent = combatSceneEngine.getActorCurrentTurn() as NonPlayableActor;
        const getNextActionMock = jest
            .spyOn(currentOponent, 'getNextAction')
            .mockImplementationOnce(
                (scene: Scene) =>
                    new ScapeAction({ actor: currentOponent, scene })
            );
        await combatSceneEngine.executeNextOponentAction();
        getNextActionMock.mockRestore();
        return;
    };

    beforeEach(() => {
        janeDoe = new Actor({
            name: 'jane doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({
                weapons: [
                    new Weapon({
                        name: 'knife',
                        type: 'knife',
                        skill: 'stab',
                        damage: new Damage({ min: 1, max: 1 }),
                    }),
                ],
            }),
            skillSet: new SkillSet({
                skills: [
                    new Skill({ name: 'stab', probabilityOfSuccess: 0.5 }),
                ],
            }),
        });
        jest.spyOn(janeDoe, 'isAlive').mockReturnValue(true);
        ['john doe', 'jill bloggs', 'joe schmoe'].map((name) => {
            const actor = createNonPlayableActor(name);
            switch (name) {
                case 'john doe': {
                    johnDoe = actor;
                    johnDoeIsAlive = jest
                        .spyOn(johnDoe, 'isAlive')
                        .mockReturnValue(true);
                    break;
                }
                case 'jill bloggs': {
                    jillBloggs = actor;
                    jillBloggsIsAlive = jest
                        .spyOn(jillBloggs, 'isAlive')
                        .mockReturnValue(true);
                    break;
                }
                case 'joe schmoe': {
                    joeSchmoe = actor;
                    joeSchmoeIsAlive = jest
                        .spyOn(joeSchmoe, 'isAlive')
                        .mockReturnValue(true);
                    break;
                }
            }
        });
        const scene = new Scene({
            actions: [],
            actors: [johnDoe, jillBloggs, joeSchmoe],
            id: 'combat',
            title: 'combat',
            player: janeDoe,
        });
        combatSceneEngine = new CombatSceneEngine({ scene });
    });

    const simulateCombat = async (
        playerActions: PlayerTestAction[],
        oponentsActions: OponentTestAction[],
        turns: number
    ): Promise<string[]> => {
        const order = [];
        try {
            for (let i = 0; i < turns; i++) {
                order.push(combatSceneEngine.getActorCurrentTurn().getName());
                if (combatSceneEngine.isPlayerTurn()) {
                    await executePlayerAction(playerActions.shift());
                } else {
                    await executeOponentAction(oponentsActions.shift());
                }
            }
        } catch (err) {
            console.error(err.message, order);
            throw err;
        }
        return order;
    };

    describe('no actors killed', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'john doe',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                new Array(4).fill('attackJohnDoe'),
                new Array(4).fill(undefined),
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('next actor killed', () => {
        const expectedOrder = [
            'jane doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'jill bloggs',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                [
                    'killJohnDoe',
                    'attackJillBloggs',
                    'attackJillBloggs',
                    'attackJillBloggs',
                ],
                new Array(3).fill(undefined),
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('actor after next killed', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'john doe',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                ['killJillBloggs', 'attackJohnDoe', 'attackJohnDoe'],
                new Array(3).fill(undefined),
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('last actor killed', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'jane doe',
            'john doe',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                [
                    'attackJoeSchmoe',
                    'attackJoeSchmoe',
                    'killJoeSchmoe',
                    'attackJohnDoe',
                ],
                new Array(3).fill(undefined),
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('first actor killed', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'jane doe',
            'jill bloggs',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                [
                    'attackJohnDoe',
                    'attackJohnDoe',
                    'attackJohnDoe',
                    'killJohnDoe',
                    'attackJillBloggs',
                ],
                new Array(4).fill(undefined),
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('previous actor killed', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'jill bloggs',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                [
                    'attackJohnDoe',
                    'killJohnDoe',
                    'attackJillBloggs',
                    'attackJillBloggs',
                ],
                new Array(4).fill(undefined),
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('previous to previous actor killed', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'jill bloggs',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                [
                    'attackJohnDoe',
                    'attackJohnDoe',
                    'killJohnDoe',
                    'attackJillBloggs',
                ],
                new Array(4).fill(undefined),
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('next actor scaped', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'jill bloggs',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                new Array(4).fill('attackJillBloggs'),
                ['scape', undefined, undefined, undefined],
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('actor after next scaped', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'john doe',
            'jane doe',
            'joe schmoe',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                new Array(5).fill('attackJohnDoe'),
                [undefined, 'scape', undefined, undefined, undefined],
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });

    describe('last actor scaped', () => {
        const expectedOrder = [
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'joe schmoe',
            'jane doe',
            'john doe',
            'jane doe',
            'jill bloggs',
            'jane doe',
            'john doe',
        ];
        let actualOrder: string[];
        beforeEach(async () => {
            actualOrder = await simulateCombat(
                new Array(6).fill('attackJohnDoe'),
                [
                    undefined,
                    undefined,
                    'scape',
                    undefined,
                    undefined,
                    undefined,
                ],
                expectedOrder.length
            );
        });

        it('runs the turns in the expected order', () => {
            expect(actualOrder).toEqual(expectedOrder);
        });
    });
});
