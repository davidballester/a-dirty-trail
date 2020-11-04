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

    describe('removeWeapon', () => {
        let inventory: Inventory;
        beforeEach(() => {
            inventory = new Inventory({ weapons: [revolver] });
        });

        it('removes the weapon from the inventory', () => {
            inventory.removeWeapon(revolver);
            const weapons = inventory.getWeapons();
            expect(
                weapons.find((weapon) => weapon.equals(revolver))
            ).toBeFalsy();
        });

        it('does nothing if the weapon is not in the inventory', () => {
            inventory.removeWeapon(rifle);
            const weapons = inventory.getWeapons();
            expect(weapons).toEqual([revolver]);
        });
    });

    it('gets the ammunitions', () => {
        const inventory = new Inventory({ ammunitionsByType: { bullets: 5 } });
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
                ammunitionsByType: inventoryAmmunitions,
                trinkets: [watch],
            });
            lootInventory = new Inventory({
                weapons: [rifle],
                ammunitionsByType: lootAmmunitions,
                trinkets: [boxOfMatches],
            });
        });

        it('now has both weapons', () => {
            inventory.loot(lootInventory);
            const weapons = inventory.getWeapons();
            expect(weapons).toEqual([revolver, rifle]);
        });

        it('now has 10 bullets', () => {
            inventory.loot(lootInventory);
            const ammunitionsByType = inventory.getAmmunitionsByType();
            expect(ammunitionsByType['bullets']).toEqual(10);
        });

        it('now has two shells', () => {
            inventory.loot(lootInventory);
            const ammunitionByType = inventory.getAmmunitionsByType();
            expect(ammunitionByType['shells']).toEqual(2);
        });

        it('now has both trinkets', () => {
            inventory.loot(lootInventory);
            const trinkets = inventory.getTrinkets();
            expect(trinkets).toEqual([watch, boxOfMatches]);
        });

        it('returns the looted weapons', () => {
            const loot = inventory.loot(lootInventory);
            const lootedWeapons = loot.getWeapons();
            expect(lootedWeapons).toEqual([rifle]);
        });

        it('returns the looted ammunitions', () => {
            const loot = inventory.loot(lootInventory);
            const lootedAmmunitions = loot.getAmmunitionsByType();
            expect(lootedAmmunitions).toEqual({ bullets: 5, shells: 2 });
        });

        it('returns the looted trinkets', () => {
            const loot = inventory.loot(lootInventory);
            const lootedTrinkets = loot.getTrinkets();
            expect(lootedTrinkets).toEqual([boxOfMatches]);
        });

        describe('non lootable weapons', () => {
            beforeEach(() => {
                rifle = new Weapon({
                    name: 'rifle',
                    type: 'gun',
                    skill: 'aiming',
                    damage: new Damage({ min: 1, max: 2 }),
                    canBeLooted: false,
                });
                lootInventory = new Inventory({
                    weapons: [rifle],
                    ammunitionsByType: { bullets: 5, shells: 2 },
                    trinkets: [boxOfMatches],
                });

                it('does not loot non lootable weapons', () => {
                    inventory.loot(lootInventory);
                    const weapons = inventory.getWeapons();
                    expect(weapons).toEqual([revolver]);
                });

                it('returns an empty weapons loot', () => {
                    const loot = inventory.loot(lootInventory);
                    const lootedWeapons = loot.getWeapons();
                    expect(lootedWeapons).toEqual([]);
                });
            });
        });
    });

    describe('hasTrinket', () => {
        let inventory: Inventory;
        beforeEach(() => {
            inventory = new Inventory({ trinkets: [watch] });
        });

        it('returns true if the inventory has the specified trinket', () => {
            const response = inventory.hasTrinket('watch');
            expect(response).toBeTruthy();
        });

        it('returns true if the inventory has the specified trinket with different notation', () => {
            const response = inventory.hasTrinket(' Watch  ');
            expect(response).toBeTruthy();
        });

        it('returns false if the inventory does not have the specified trinket with different notation', () => {
            const response = inventory.hasTrinket('match');
            expect(response).toBeFalsy;
        });
    });
});
