import SideEffectBuilder from './SideEffectBuilder';
import InventoryBuilder from './InventoryBuilder';
import Inventory from '../core/Inventory';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import { SideEffectTemplate } from './SideEffectTemplate';
import Skill from '../core/Skill';
jest.mock('./InventoryBuilder');

describe(SideEffectBuilder.name, () => {
    let scene: Scene;
    let player: Actor;
    let getInventory: jest.SpyInstance;
    let loot: jest.SpyInstance;
    let remove: jest.SpyInstance;
    let inventory: Inventory;
    let changeName: jest.SpyInstance;
    let modifyHealth: jest.SpyInstance;
    let sideEffectTemplate: SideEffectTemplate;
    let sideEffectBuilder: SideEffectBuilder;
    let addFlag: jest.SpyInstance;
    let removeFlag: jest.SpyInstance;
    let modifyFlag: jest.SpyInstance;
    let getSkill: jest.SpyInstance;
    let setProbabilityOfSuccess: jest.SpyInstance;
    let modifyProbabilityOfSuccess: jest.SpyInstance;
    beforeEach(() => {
        changeName = jest.fn();
        loot = jest.fn();
        remove = jest.fn();
        getInventory = jest.fn().mockReturnValue({
            loot,
            remove,
        });
        modifyHealth = jest.fn();
        addFlag = jest.fn();
        removeFlag = jest.fn();
        modifyFlag = jest.fn();
        setProbabilityOfSuccess = jest.fn();
        modifyProbabilityOfSuccess = jest.fn();
        const skill = ({
            setProbabilityOfSuccess,
            modifyProbabilityOfSuccess,
        } as unknown) as Skill;
        getSkill = jest.fn().mockReturnValue(skill);
        player = ({
            id: 'player',
            changeName,
            getInventory,
            getHealth: jest.fn().mockReturnValue({ modify: modifyHealth }),
            getFlags: jest.fn().mockReturnValue({
                addFlag,
                removeFlag,
                modifyFlag,
            }),
            getSkill,
        } as unknown) as Actor;
        const getPlayer = jest.fn().mockReturnValue(player);
        scene = ({
            getPlayer,
        } as unknown) as Scene;
        inventory = ({
            id: 'inventory',
        } as unknown) as Inventory;
        const inventoryBuilderMock = (InventoryBuilder as unknown) as jest.Mock;
        inventoryBuilderMock.mockReturnValue({
            build: jest.fn().mockReturnValue(inventory),
        });
        sideEffectTemplate = {
            loot: {},
            removeItems: {},
            rename: 'Roland Deschain',
            modifyHealth: -2,
        };
        sideEffectBuilder = new SideEffectBuilder({
            scene,
            sideEffectTemplate,
        });
    });

    describe('build', () => {
        it('renames the player', () => {
            sideEffectBuilder.build();
            expect(changeName).toHaveBeenCalledWith('Roland Deschain');
        });

        it('loots the inventory returned by the inventory builder', () => {
            sideEffectBuilder.build();
            expect(loot).toHaveBeenCalledWith(inventory);
        });

        it('removes the inventory returned by the inventory builder', () => {
            sideEffectBuilder.build();
            expect(remove).toHaveBeenCalledWith(inventory);
        });

        it('modifies the health of the player', () => {
            sideEffectBuilder.build();
            expect(modifyHealth).toHaveBeenCalledWith(-2);
        });

        describe('flags', () => {
            beforeEach(() => {
                sideEffectTemplate = {
                    ...sideEffectTemplate,
                    addFlag: 'charismatic',
                    addFlags: ['approachable', 'fun'],
                    removeFlag: 'sulky',
                    removeFlags: ['solemn', 'sad'],
                    modifyFlag: {
                        name: 'karma',
                        value: 1,
                    },
                    modifyFlags: [
                        {
                            name: 'coins',
                            value: 2,
                        },
                    ],
                };
                sideEffectBuilder = new SideEffectBuilder({
                    scene,
                    sideEffectTemplate,
                });
                sideEffectBuilder.build();
            });

            it('adds the flags', () => {
                expect(addFlag).toHaveBeenCalledWith('charismatic');
                expect(addFlag).toHaveBeenCalledWith('approachable');
                expect(addFlag).toHaveBeenCalledWith('fun');
                expect(addFlag).toHaveBeenCalledTimes(3);
            });

            it('removes the flags', () => {
                expect(removeFlag).toHaveBeenCalledWith('sulky');
                expect(removeFlag).toHaveBeenCalledWith('solemn');
                expect(removeFlag).toHaveBeenCalledWith('sad');
                expect(removeFlag).toHaveBeenCalledTimes(3);
            });

            it('modifies the flags', () => {
                expect(modifyFlag).toHaveBeenCalledWith('karma', 1);
                expect(modifyFlag).toHaveBeenCalledWith('coins', 2);
                expect(modifyFlag).toHaveBeenCalledTimes(2);
            });
        });

        describe('skills', () => {
            beforeEach(() => {
                sideEffectTemplate = {
                    ...sideEffectTemplate,
                    modifySkill: {
                        name: 'myFirstSkill',
                        value: 0.1,
                    },
                    modifySkills: [
                        {
                            name: 'mySecondSkill',
                            modifier: 0.2,
                        },
                    ],
                };
                sideEffectBuilder = new SideEffectBuilder({
                    scene,
                    sideEffectTemplate,
                });
                sideEffectBuilder.build();
            });

            it('accesses the skill', () => {
                expect(getSkill).toHaveBeenCalledWith('myFirstSkill');
                expect(getSkill).toHaveBeenCalledWith('mySecondSkill');
            });

            it('sets the value of the the skill', () => {
                expect(setProbabilityOfSuccess).toHaveBeenCalledWith(0.1);
            });

            it('modifies the value of the the skill', () => {
                expect(modifyProbabilityOfSuccess).toHaveBeenCalledWith(0.2);
            });
        });
    });
});
