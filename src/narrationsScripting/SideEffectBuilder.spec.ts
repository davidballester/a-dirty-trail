import SideEffectBuilder from './SideEffectBuilder';
import InventoryBuilder from './InventoryBuilder';
import Inventory from '../core/Inventory';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import { SceneTemplateSideEffect } from './SceneTemplate';
jest.mock('./InventoryBuilder');

describe(SideEffectBuilder.name, () => {
    let player: Actor;
    let getInventory: jest.SpyInstance;
    let loot: jest.SpyInstance;
    let inventory: Inventory;
    let changeName: jest.SpyInstance;
    let sideEffectTemplate: SceneTemplateSideEffect;
    let sideEffectBuilder: SideEffectBuilder;
    beforeEach(() => {
        changeName = jest.fn();
        loot = jest.fn();
        getInventory = jest.fn().mockReturnValue({
            loot,
        });
        player = ({
            id: 'player',
            changeName,
            getInventory,
        } as unknown) as Actor;
        const getPlayer = jest.fn().mockReturnValue(player);
        const scene = ({
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
            rename: 'Roland Deschain',
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
    });
});
