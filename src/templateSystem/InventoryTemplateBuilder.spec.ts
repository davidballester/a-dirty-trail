import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';
import Trinket from '../core/Trinket';
import Weapon from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';
import { InventoryTemplate } from './InventoryTemplate';
import InventoryTemplateBuilder from './InventoryTemplateBuilder';

describe(InventoryTemplateBuilder.name, () => {
    let inventory: Inventory;
    let inventoryTemplate: InventoryTemplate;

    beforeEach(() => {
        const weapons = [
            new Firearm({
                name: 'revolver',
                type: 'gun',
                skill: 'aim',
                damage: new Damage({ min: 1, max: 2 }),
                canBeLooted: true,
                ammunition: new WeaponAmmunition({
                    type: 'bullets',
                    current: 4,
                    max: 6,
                }),
            }),
            new Weapon({
                name: 'knife',
                type: 'knife',
                skill: 'stab',
                damage: new Damage({ min: 1, max: 1 }),
                canBeLooted: false,
            }),
        ];
        const ammunitionsByType = {
            bullets: 5,
        };
        const trinkets = [
            new Trinket({
                name: 'watch',
                description: 'battered and old',
                skillsModifiers: { perception: 0.05 },
            }),
        ];
        inventory = new Inventory({
            weapons,
            ammunitionsByType,
            trinkets,
        });
        const inventoryTemplateBuilder = new InventoryTemplateBuilder({
            inventory,
        });
        inventoryTemplate = inventoryTemplateBuilder.build();
    });

    it('converts the trinkets', () => {
        expect(inventoryTemplate.trinkets).toEqual([
            {
                name: 'watch',
                description: 'battered and old',
                skillsModifiers: { perception: 0.05 },
            },
        ]);
    });

    it('converts the ammunitions', () => {
        expect(inventoryTemplate.ammunitions).toEqual({
            bullets: 5,
        });
    });

    it('converts the firearm', () => {
        expect(inventoryTemplate.weapons.revolver).toEqual({
            type: 'gun',
            skill: 'aim',
            canBeLooted: true,
            damage: '1-2',
            ammunitionType: 'bullets',
            ammunition: '4-6',
        });
    });

    it('converts the weapon', () => {
        expect(inventoryTemplate.weapons.knife).toEqual({
            type: 'knife',
            skill: 'stab',
            canBeLooted: false,
            damage: '1-1',
        });
    });
});
