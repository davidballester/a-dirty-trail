import Actor from './Actor';
import Health from './Health';
import Inventory from './Inventory';
import Skill from './Skill';
import SkillSet from './SkillSet';
import Trinket from './Trinket';

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

    describe('flags', () => {
        describe('addFlag', () => {
            it('adds a flag without issues', () => {
                actor.addFlag('charismatic');
            });

            it('does not add the same flag twice', () => {
                actor.addFlag('charismatic');
                actor.addFlag('charismatic');
                actor.removeFlag('charismatic');
                const hasFlag = actor.hasFlag('charismatic');
                expect(hasFlag).toBeFalsy();
            });
        });

        describe('hasFlag', () => {
            beforeEach(() => {
                actor.addFlag('charismatic');
            });

            it('returns true for the added flag', () => {
                const hasFlag = actor.hasFlag('charismatic');
                expect(hasFlag).toBeTruthy();
            });

            it('returns false for an unknown flag', () => {
                const hasFlag = actor.hasFlag('solemn');
                expect(hasFlag).toBeFalsy();
            });
        });

        describe('removeFlag', () => {
            beforeEach(() => {
                actor.addFlag('charismatic');
            });

            it('removes the flag without issues', () => {
                actor.removeFlag('charismatic');
            });

            it('cannot get a removed flag', () => {
                actor.removeFlag('charismatic');
                const hasFlag = actor.hasFlag('charismatic');
                expect(hasFlag).toBeFalsy();
            });

            it('does not fail to remove an unknown flag', () => {
                actor.removeFlag('solemn');
            });
        });

        describe('getFlags', () => {
            beforeEach(() => {
                actor.addFlag('charismatic');
            });

            it('gets the flags', () => {
                const flags = actor.getFlags();
                expect(flags).toEqual(['charismatic']);
            });
        });
    });

    describe('roll skill', () => {
        let random: jest.SpyInstance;
        beforeEach(() => {
            random = jest.spyOn(Math, 'random');
            skillSet = new SkillSet({
                skills: [new Skill({ name: 'aim', probabilityOfSuccess: 0.5 })],
            });
            actor = new Actor({
                name: 'Jane Doe',
                health,
                inventory,
                skillSet,
            });
        });

        it('succeeds if the random number is lower than the probability of success minus the opposition', () => {
            random.mockReturnValue(0.1);
            const result = actor.rollSkill('aim', -0.1);
            expect(result).toBeTruthy();
        });

        it('succeeds if the random number is equal than the probability of success minus the opposition', () => {
            random.mockReturnValue(0.4);
            const result = actor.rollSkill('aim', -0.1);
            expect(result).toBeTruthy();
        });

        it('fails if the random number is higher than the probability of success minus the opposition', () => {
            random.mockReturnValue(0.4);
            const result = actor.rollSkill('aim', -0.2);
            expect(result).toBeFalsy();
        });

        describe('trinkets modifiers', () => {
            beforeEach(() => {
                actor.getInventory().loot(
                    new Inventory({
                        trinkets: [
                            new Trinket({
                                name: 'scope',
                                skillsModifiers: {
                                    aim: 0.2,
                                },
                            }),
                        ],
                    })
                );
            });

            it('succeeds if the random number is lower than the probability of success minus the opposition plus the trinkets modifiers', () => {
                random.mockReturnValue(0.5);
                const result = actor.rollSkill('aim', -0.1);
                expect(result).toBeTruthy();
            });

            it('succeeds if the random number is equal than the probability of success minus the opposition', () => {
                random.mockReturnValue(0.6);
                const result = actor.rollSkill('aim', -0.1);
                expect(result).toBeTruthy();
            });

            it('fails if the random number is higher than the probability of success minus the opposition', () => {
                random.mockReturnValue(0.7);
                const result = actor.rollSkill('aim', -0.1);
                expect(result).toBeFalsy();
            });
        });
    });

    describe('getProbabilityOfSuccess', () => {
        beforeEach(() => {
            skillSet = new SkillSet({
                skills: [new Skill({ name: 'aim', probabilityOfSuccess: 0.5 })],
            });
            actor = new Actor({
                name: 'Jane Doe',
                health,
                inventory,
                skillSet,
            });
            actor.getInventory().loot(
                new Inventory({
                    trinkets: [
                        new Trinket({
                            name: 'scope',
                            skillsModifiers: {
                                aim: 0.2,
                            },
                        }),
                    ],
                })
            );
        });

        it('returns the calculated probability of success', () => {
            const probabilityOfSuccess = actor.getProbabilityOfSuccess(
                'aim',
                -0.4
            );
            expect(probabilityOfSuccess).toEqual(0.5 + 0.2 - 0.4);
        });

        it('returns 0 if the calculated probability of success is lower than 0', () => {
            const probabilityOfSuccess = actor.getProbabilityOfSuccess(
                'aim',
                -0.9
            );
            expect(probabilityOfSuccess).toEqual(0);
        });

        it('returns 1 if the calculated probability of success is higher than 0', () => {
            const probabilityOfSuccess = actor.getProbabilityOfSuccess(
                'aim',
                0.9
            );
            expect(probabilityOfSuccess).toEqual(1);
        });
    });
});
