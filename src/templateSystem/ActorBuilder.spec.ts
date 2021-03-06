import ActorBuilder from './ActorBuilder';
import { ActorTemplate } from './ActorTemplate';
import { v4 as uuidv4 } from 'uuid';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import Skill from '../core/Skill';
import InventoryBuilder from './InventoryBuilder';
import Actor from '../core/Actor';
import Flags from '../core/Flags';
jest.mock('./InventoryBuilder');
jest.mock('uuid');

describe(ActorBuilder.name, () => {
    let actorBuilder: ActorBuilder;
    let actorTemplate: ActorTemplate;
    let inventory: Inventory;
    beforeEach(() => {
        const uuidv4Mock = (uuidv4 as unknown) as jest.Mock;
        uuidv4Mock.mockReturnValue(undefined);
        const inventoryTemplate = {
            id: 'inventory-template',
        };
        actorTemplate = ({
            name: 'Roland Deschain',
            health: '8-10',
            inventory: inventoryTemplate,
            skills: {
                aim: {
                    probabilityOfSuccess: 0.95,
                    levelUpDelta: 0.01,
                },
                stab: 0.5,
            },
            flags: {
                gunslinger: 1,
            },
        } as unknown) as ActorTemplate;
        inventory = ({
            id: 'inventory',
        } as unknown) as Inventory;
        const build = jest.fn().mockReturnValue(inventory);
        const inventoryBuilderMock = (InventoryBuilder as unknown) as jest.Mock;
        inventoryBuilderMock.mockReturnValue({
            build,
        });

        actorBuilder = new ActorBuilder({
            actorTemplate,
        });
    });

    describe('build', () => {
        it('builds an actor', () => {
            const roland = actorBuilder.build();
            const expectedRoland = new Actor({
                name: 'Roland Deschain',
                health: new Health({ current: 8, max: 10 }),
                inventory: inventory,
                skillSet: new SkillSet({
                    skills: [
                        new Skill({
                            name: 'aim',
                            probabilityOfSuccess: 0.95,
                            levelUpDelta: 0.01,
                        }),
                        new Skill({
                            name: 'stab',
                            probabilityOfSuccess: 0.5,
                            levelUpDelta: 0.02,
                        }),
                    ],
                }),
                flags: new Flags({ gunslinger: 1 }),
            });
            expect(roland).toEqual(expectedRoland);
        });
    });
});
