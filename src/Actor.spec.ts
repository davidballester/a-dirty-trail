import Actor from './Actor';
import Health from './Health';
import Inventory from './Inventory';
import Skill from './Skill';
import SkillSet from './SkillSet';

describe('Actor', () => {
    let actor: Actor;
    let health: Health;
    let inventory: Inventory;
    let skillSet: SkillSet;
    beforeEach(() => {
        health = new Health({ current: 5, max: 10 });
        inventory = new Inventory({});
        skillSet = new SkillSet({});
        actor = new Actor({ name: 'Jane Doe', health, inventory, skillSet });
    });

    describe('getName', () => {
        it('gets the name', () => {
            const name = actor.getName();
            expect(name).toEqual('Jane Doe');
        });
    });

    describe('changeName', () => {
        it('sets the new name to something else', () => {
            actor.changeName('Jane Eyre');
            const name = actor.getName();
            expect(name).toEqual('Jane Eyre');
        });
    });

    describe('getHealth', () => {
        it('gets health', () => {
            const returnedHealth = actor.getHealth();
            expect(returnedHealth).toEqual(health);
        });
    });

    describe('isAlive', () => {
        let isAlive: jest.SpyInstance;
        beforeEach(() => {
            isAlive = jest.spyOn(health, 'isAlive');
        });

        it('returns the result of health.isAlive', () => {
            isAlive.mockReturnValue(false);
            const isAliveResponse = actor.isAlive();
            expect(isAliveResponse).toEqual(false);
        });
    });

    describe('getInventory', () => {
        it('gets the inventory', () => {
            const returnedInventory = actor.getInventory();
            expect(returnedInventory).toEqual(inventory);
        });
    });

    describe('loot', () => {
        let loot: jest.SpyInstance;
        let otherInventory: Inventory;
        beforeEach(() => {
            loot = jest.spyOn(inventory, 'loot');
            otherInventory = new Inventory({});
        });

        it('calls inventory.loot with the provided inventory', () => {
            actor.loot(otherInventory);
            expect(loot).toHaveBeenCalledWith(otherInventory);
        });
    });

    describe('getSkillSet', () => {
        it('gets the skill set', () => {
            const returnedSkillSet = actor.getSkillSet();
            expect(returnedSkillSet).toEqual(skillSet);
        });
    });

    describe('getSkill', () => {
        let getSkill: jest.SpyInstance;
        let charisma: Skill;
        beforeEach(() => {
            charisma = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
            });
            getSkill = jest
                .spyOn(skillSet, 'getSkill')
                .mockReturnValue(charisma);
        });

        it('calls skillSet.getSkill with the provided skill name', () => {
            actor.getSkill('charisma');
            expect(getSkill).toHaveBeenCalledWith('charisma');
        });

        it('returns skillSet.getSkill', () => {
            const returnedSkill = actor.getSkill('charisma');
            expect(returnedSkill).toEqual(charisma);
        });
    });
});
