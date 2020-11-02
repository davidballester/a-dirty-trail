import SideEffectBuilder from './SideEffectBuilder';
import InventoryBuilder from './InventoryBuilder';
import Inventory from '../core/Inventory';
import Actor from '../core/Actor';
import Scene from '../core/Scene';
import { SideEffectTemplate } from './SceneTemplate';
jest.mock('./InventoryBuilder');

describe(SideEffectBuilder.name, () => {
    let player: Actor;
    let getInventory: jest.SpyInstance;
    let loot: jest.SpyInstance;
    let inventory: Inventory;
    let changeName: jest.SpyInstance;
    let modifyHealth: jest.SpyInstance;
    let sideEffectTemplate: SideEffectTemplate;
    let sideEffectBuilder: SideEffectBuilder;
    beforeEach(() => {
        changeName = jest.fn();
        loot = jest.fn();
        getInventory = jest.fn().mockReturnValue({
            loot,
        });
        modifyHealth = jest.fn();
        player = ({
            id: 'player',
            changeName,
            getInventory,
            getHealth: jest.fn().mockReturnValue({ modify: modifyHealth }),
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

        it('modifies the health of the player', () => {
            sideEffectBuilder.build();
            expect(modifyHealth).toHaveBeenCalledWith(-2);
        });
    });
});
