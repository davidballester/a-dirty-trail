import { when } from 'jest-when';
import Actor from '../core/Actor';
import LootAction from './LootAction';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import SkillSet from '../core/SkillSet';

describe('LootAction', () => {
    let janeDoeInventory: Inventory;
    let janeDoe: Actor;
    let johnDoeInventory: Inventory;
    let johnDoe: NonPlayableActor;
    let scene: Scene;
    beforeEach(() => {
        janeDoeInventory = new Inventory({});
        janeDoe = new Actor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: janeDoeInventory,
            skillSet: new SkillSet({}),
        });
        johnDoeInventory = new Inventory({});
        johnDoe = new NonPlayableActor({
            name: 'John Doe',
            health: new Health({ current: 0, max: 5 }),
            inventory: johnDoeInventory,
            skillSet: new SkillSet({}),
        });
        scene = new Scene({
            player: janeDoe,
            actors: [johnDoe],
            setup: [],
            actions: [],
        });
    });

    it('initializes without errors', () => {
        new LootAction({
            scene,
            actor: janeDoe,
            oponent: johnDoe,
        });
    });

    describe('getOponent', () => {
        it('returns the oponent', () => {
            const action = new LootAction({
                scene,
                actor: janeDoe,
                oponent: johnDoe,
            });
            const oponent = action.getOponent();
            expect(oponent).toEqual(johnDoe);
        });
    });

    describe('canExecute', () => {
        let playerIsAlive: jest.SpyInstance;
        let sceneContainsActor: jest.SpyInstance;
        let oponentIsAlive: jest.SpyInstance;
        let action: LootAction;
        beforeEach(() => {
            playerIsAlive = jest
                .spyOn(janeDoe, 'isAlive')
                .mockReturnValue(true);
            sceneContainsActor = jest
                .spyOn(scene, 'containsActor')
                .mockReturnValue(true);
            oponentIsAlive = jest
                .spyOn(johnDoe, 'isAlive')
                .mockReturnValue(false);
            action = new LootAction({
                scene,
                actor: janeDoe,
                oponent: johnDoe,
            });
        });

        it('returns false if the player is not alive', () => {
            playerIsAlive.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the player is not in the scene', () => {
            when(sceneContainsActor).calledWith(janeDoe).mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the oponent is alive', () => {
            oponentIsAlive.mockReturnValue(true);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the oponent is not in the scene', () => {
            when(sceneContainsActor).calledWith(johnDoe).mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns true otherwise', () => {
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(true);
        });
    });

    describe('execute', () => {
        let inventoryLoot: jest.SpyInstance;
        let loot: Inventory;
        let action: LootAction;
        beforeEach(() => {
            loot = new Inventory({});
            inventoryLoot = jest
                .spyOn(janeDoeInventory, 'loot')
                .mockReturnValue(loot);
            action = new LootAction({
                scene,
                actor: janeDoe,
                oponent: johnDoe,
            });
        });

        it('calls the loot method of the actor inventory', () => {
            action.execute();
            expect(inventoryLoot).toHaveBeenCalledWith(johnDoeInventory);
        });

        it('returns the loot', () => {
            const response = action.execute();
            expect(response).toEqual(loot);
        });
    });
});
