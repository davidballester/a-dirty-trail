import NonPlayableActorBuilder from './NonPlayableActorBuilder';
import ActorBuilder from './ActorBuilder';
import SceneTemplate from './SceneTemplate';
import { v4 as uuidv4 } from 'uuid';
import NonPlayableActor from '../core/NonPlayableActor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import Skill from '../core/Skill';
jest.mock('./ActorBuilder');
jest.mock('uuid');

describe(NonPlayableActorBuilder.name, () => {
    let nonPlayableActorBuilder: NonPlayableActorBuilder;
    let sceneTemplate: SceneTemplate;
    let actorBuilderMock: jest.Mock;
    let inventory: Inventory;
    beforeEach(() => {
        const uuidv4Mock = (uuidv4 as unknown) as jest.Mock;
        uuidv4Mock.mockReturnValue(undefined);
        inventory = ({
            id: 'inventory',
        } as unknown) as Inventory;
        actorBuilderMock = (ActorBuilder as unknown) as jest.Mock;
        actorBuilderMock.mockReturnValue({
            build: jest.fn().mockReturnValue({
                getHealth: jest
                    .fn()
                    .mockReturnValue(new Health({ current: 1, max: 2 })),
                getInventory: jest.fn().mockReturnValue(inventory),
                getSkillSet: jest.fn().mockReturnValue(
                    new SkillSet({
                        skills: [
                            new Skill({
                                name: 'aim',
                                probabilityOfSuccess: 0.4,
                            }),
                        ],
                    })
                ),
            }),
        });
        sceneTemplate = ({
            metadata: {
                actors: {
                    'Scarred brigand': {
                        id: 'scarred-brigand',
                    },
                },
            },
        } as unknown) as SceneTemplate;
        nonPlayableActorBuilder = new NonPlayableActorBuilder({
            sceneTemplate,
        });
    });

    describe('build', () => {
        it('builds a non playable actor', () => {
            const actors = nonPlayableActorBuilder.build();
            expect(actors).toEqual([
                new NonPlayableActor({
                    name: 'Scarred brigand',
                    health: new Health({ current: 1, max: 2 }),
                    inventory: inventory,
                    skillSet: new SkillSet({
                        skills: [
                            new Skill({
                                name: 'aim',
                                probabilityOfSuccess: 0.4,
                            }),
                        ],
                    }),
                }),
            ]);
        });
    });
});
