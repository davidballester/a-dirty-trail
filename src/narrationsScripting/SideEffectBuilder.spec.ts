import { when } from 'jest-when';
import SideEffectBuilder from './SideEffectBuilder';
import scriptingProcessor from './ScriptingProcessor';
import { RenamePlayerRule, Rule, TakeWeaponRule } from './Rules';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';
jest.mock('../core/Weapon');
jest.mock('../core/Firearm');
jest.mock('../core/Inventory');

describe(SideEffectBuilder.name, () => {
    let parse: jest.SpyInstance;
    let rule: Rule;
    let getPlayer: jest.SpyInstance;
    let player: Actor;
    let getInventory: jest.SpyInstance;
    let changeName: jest.SpyInstance;
    let sideEffectBuilder: SideEffectBuilder;
    beforeEach(() => {
        parse = jest.spyOn(scriptingProcessor, 'parse');
        const sideEffectScript = 'my script';
        when(parse)
            .mockImplementation(() => {
                throw new Error('unknown argument');
            })
            .calledWith(sideEffectScript)
            .mockImplementation(() => rule);
        changeName = jest.fn();
        getInventory = jest.fn();
        player = ({
            id: 'player',
            changeName,
            getInventory,
        } as unknown) as Actor;
        getPlayer = jest.fn().mockReturnValue(player);
        const scene = ({
            getPlayer,
        } as unknown) as Scene;
        sideEffectBuilder = new SideEffectBuilder({ scene, sideEffectScript });
    });

    describe('change name rule', () => {
        beforeEach(() => {
            rule = {
                type: 'renamePlayer',
                newName: 'Roland Deschain',
            } as RenamePlayerRule;
        });

        it('invokes the change name of the player', () => {
            sideEffectBuilder.build();
            expect(changeName).toHaveBeenCalledWith('Roland Deschain');
        });
    });

    describe('take weapon rule', () => {
        let weaponMock: jest.Mock;
        let weapon: Weapon;
        let firearmMock: jest.Mock;
        let firearm: Firearm;
        let loot: jest.SpyInstance;
        let inventoryMock: jest.Mock;
        let inventory: Inventory;
        beforeEach(() => {
            rule = {
                type: 'takeWeapon',
                item: {
                    itemType: 'weapon',
                    name: 'revolver',
                    type: 'gun',
                    minDamage: 1,
                    maxDamage: 2,
                    skill: 'aim',
                    ammunitionType: 'big bullets',
                    currentAmmunition: 4,
                    maxAmmunition: 6,
                },
            } as TakeWeaponRule;
            weapon = ({
                getName: jest.fn(),
                getType: jest.fn(),
                getDamage: jest.fn(),
                getSkill: jest.fn(),
            } as unknown) as Weapon;
            weaponMock = (Weapon as unknown) as jest.Mock;
            weaponMock.mockReturnValue(weapon);
            firearm = ({
                id: 'firearm',
            } as unknown) as Firearm;
            firearmMock = (Firearm as unknown) as jest.Mock;
            firearmMock.mockReturnValue(firearm);
            loot = jest.fn();
            getInventory.mockReturnValue({
                loot,
            });
            inventoryMock = (Inventory as unknown) as jest.Mock;
            inventory = ({
                id: 'inventory',
            } as unknown) as Inventory;
            inventoryMock.mockReturnValue(inventory);
        });

        it('instantiates a new inventory with the firearm', () => {
            sideEffectBuilder.build();
            expect(inventoryMock).toHaveBeenCalledWith({ weapons: [firearm] });
        });

        it('loots the inventory with the firearm', () => {
            sideEffectBuilder.build();
            expect(loot).toHaveBeenCalledWith(inventory);
        });
    });
});
