import Damage from './Damage';
import Inventory from './Inventory';
import Trinket from './Trinket';
import Weapon from './Weapon';

describe('Inventory', () => {
    let revolver: Weapon;
    let rifle: Weapon;
    let watch: Trinket;
    let boxOfMatches: Trinket;
    beforeEach(() => {
        revolver = new Weapon({
            name: 'revolver',
            type: 'gun',
            skill: 'aiming',
            damage: new Damage({ min: 1, max: 2 }),
        });
        rifle = new Weapon({
            name: 'rifle',
            type: 'rifle',
            skill: 'aiming',
            damage: new Damage({ min: 1, max: 2 }),
        });
        watch = new Trinket({ name: 'watch' });
        boxOfMatches = new Trinket({ name: 'box of matches' });
    });

    it('creates a new inventory without errors', () => {
        new Inventory({});
    });

    it('gets the weapons', () => {
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
        const inventory = new Inventory({ trinkets: [watch] });
        const trinkets = inventory.getTrinkets();
        expect(trinkets).toEqual([watch]);
    });

    describe('loot', () => {
        let inventory: Inventory;
        let lootInventory: Inventory;
        beforeEach(() => {
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
