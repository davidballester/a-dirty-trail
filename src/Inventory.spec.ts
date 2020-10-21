import Inventory from './Inventory';
import { SkillName, Trinket, Weapon } from './models';

describe('Inventory', () => {
    it('creates a new inventory without errors', () => {
        new Inventory({});
    });

    it('gets the weapons', () => {
        const revolver = new Weapon('revolver', 1, 1, SkillName.distanceCombat);
        const inventory = new Inventory({ weapons: [revolver] });
        const weapons = inventory.getWeapons();
        expect(weapons).toEqual([revolver]);
    });

    it('gets the ammunitions', () => {
        const inventory = new Inventory({ ammunitionByType: { bullets: 5 } });
        const ammunitionsByType = inventory.getAmmunitionsByType();
        expect(ammunitionsByType).toEqual({ bullets: 5 });
    });

    it('gets the trinkets', () => {
        const watch = new Trinket('watch');
        const inventory = new Inventory({ trinkets: [watch] });
        const trinkets = inventory.getTrinkets();
        expect(trinkets).toEqual([watch]);
    });

    describe('loot', () => {
        let inventory: Inventory;
        let lootInventory: Inventory;
        let revolver: Weapon;
        let rifle: Weapon;
        let watch: Trinket;
        let boxOfMatches: Trinket;
        beforeEach(() => {
            revolver = new Weapon('revolver', 1, 1, SkillName.distanceCombat);
            rifle = new Weapon('rifle', 1, 1, SkillName.distanceCombat);
            watch = new Trinket('watch');
            boxOfMatches = new Trinket('box of matches');
            const inventoryAmmunitions = { bullets: 5 };
            const lootAmmunitions = { bullets: 5, shells: 2 };

            inventory = new Inventory({
                weapons: [revolver],
                ammunitionByType: inventoryAmmunitions,
                trinkets: [watch],
            });
            lootInventory = new Inventory({
                weapons: [rifle],
                ammunitionByType: lootAmmunitions,
                trinkets: [boxOfMatches],
            });

            inventory.loot(lootInventory);
        });

        it('now has both weapons', () => {
            const weapons = inventory.getWeapons();
            expect(weapons).toEqual([revolver, rifle]);
        });

        it('now has 10 bullets', () => {
            const ammunitionsByType = inventory.getAmmunitionsByType();
            expect(ammunitionsByType['bullets']).toEqual(10);
        });

        it('now has two shells', () => {
            const ammunitionByType = inventory.getAmmunitionsByType();
            expect(ammunitionByType['shells']).toEqual(2);
        });

        it('now has both trinkets', () => {
            const trinkets = inventory.getTrinkets();
            expect(trinkets).toEqual([watch, boxOfMatches]);
        });
    });
});
