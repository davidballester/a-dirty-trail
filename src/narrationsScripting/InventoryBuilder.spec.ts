import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';
import Weapon from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';
import InventoryBuilder from './InventoryBuilder';
import { SceneTemplateInventory } from './SceneTemplate';
import { v4 as uuidv4 } from 'uuid';
jest.mock('uuid');

describe(InventoryBuilder.name, () => {
    let inventoryBuilder: InventoryBuilder;
    let inventoryTemplate: SceneTemplateInventory;
    beforeEach(() => {
        const uuidv4Mock = (uuidv4 as unknown) as jest.Mock;
        uuidv4Mock.mockReturnValue(undefined);
        inventoryTemplate = {
            ammunitions: {
                'big bullets': 4,
            },
            weapons: {
                'One-shot rifle': {
                    type: 'rifle',
                    damage: '1-2',
                    skill: 'aim',
                    ammunitionType: 'big bullets',
                    ammunition: '0-1',
                },
                knife: {
                    type: 'knife',
                    damage: '1-1',
                    skill: 'stab',
                    canBeLooted: false,
                },
            },
        };
        inventoryBuilder = new InventoryBuilder({ inventoryTemplate });
    });

    describe('build', () => {
        it('builds the inventory', () => {
            const inventory = inventoryBuilder.build();
            expect(inventory).toEqual(
                new Inventory({
                    ammunitionsByType: { 'big bullets': 4 },
                    weapons: [
                        new Firearm({
                            name: 'One-shot rifle',
                            type: 'rifle',
                            damage: new Damage({ min: 1, max: 2 }),
                            skill: 'aim',
                            ammunition: new WeaponAmmunition({
                                type: 'big bullets',
                                current: 0,
                                max: 1,
                            }),
                        }),
                        new Weapon({
                            name: 'knife',
                            type: 'knife',
                            damage: new Damage({ min: 1, max: 1 }),
                            skill: 'stab',
                            canBeLooted: false,
                        }),
                    ],
                })
            );
        });
    });
});
