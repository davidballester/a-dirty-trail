import NonPlayableActorBuilder from './NonPlayableActorBuilder';
import SceneTemplate from './SceneTemplate';
import { v4 as uuidv4 } from 'uuid';
import NonPlayableActor from '../core/NonPlayableActor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import Skill from '../core/Skill';
import InventoryBuilder from './InventoryBuilder';
jest.mock('./InventoryBuilder');
jest.mock('uuid');

describe(NonPlayableActorBuilder.name, () => {
    let nonPlayableActorBuilder: NonPlayableActorBuilder;
    let sceneTemplate: SceneTemplate;
    let inventory: Inventory;
    beforeEach(() => {
        const uuidv4Mock = (uuidv4 as unknown) as jest.Mock;
        uuidv4Mock.mockReturnValue(undefined);
        const inventoryTemplate = {
            id: 'inventory-template',
        };
        sceneTemplate = ({
            metadata: {
                actors: {
                    'Scarred brigand': {
                        health: '1-2',
                        inventory: inventoryTemplate,
                        skills: {
                            aim: 0.4,
                        },
                    },
                },
            },
        } as unknown) as SceneTemplate;
        inventory = ({
            id: 'inventory',
        } as unknown) as Inventory;
        const build = jest.fn().mockReturnValue(inventory);
        const inventoryBuilderMock = (InventoryBuilder as unknown) as jest.Mock;
        inventoryBuilderMock.mockReturnValue({
            build,
        });

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
