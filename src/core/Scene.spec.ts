import Action from '../actions/Action';
import Actor from './Actor';
import Health from './Health';
import Inventory from './Inventory';
import NonPlayableActor from './NonPlayableActor';
import Scene from './Scene';
import SkillSet from './SkillSet';

describe('Scene', () => {
    class CustomAction extends Action<number> {
        canExecute(): boolean {
            throw new Error('Method not implemented.');
        }
        execute(): number {
            throw new Error('Method not implemented.');
        }
    }

    let setup: string[];
    let gunslinger: Actor;
    let manInBlack: NonPlayableActor;
    let actors: NonPlayableActor[];
    let actions: Action<any>[];
    let scene: Scene;
    beforeEach(() => {
        setup = [
            'The man in black fled across the desert, and the gunslinger followed',
        ];
        gunslinger = new Actor({
            name: 'gunslinger',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        manInBlack = new NonPlayableActor({
            name: 'walter',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        actors = [manInBlack];
        scene = new Scene({ player: gunslinger, setup, actors, actions: [] });
        actions = [
            new CustomAction({ scene, type: 'custom', actor: gunslinger }),
        ];
    });

    describe('getSetup', () => {
        it('returns the setup', () => {
            const returnedSetup = scene.getSetup();
            expect(returnedSetup).toEqual(setup);
        });
    });

    describe('getPlayer', () => {
        it('gets the player', () => {
            const player = scene.getPlayer();
            expect(player).toEqual(gunslinger);
        });

        it('gets undefined if there is no player', () => {
            scene = new Scene({ setup, actors, actions });
            const player = scene.getPlayer();
            expect(player).toBeUndefined();
        });
    });

    describe('setPlayer', () => {
        it('sets the player', () => {
            scene = new Scene({ setup, actors, actions });
            scene.setPlayer(gunslinger);
            const player = scene.getPlayer();
            expect(player).toEqual(gunslinger);
        });

        it('sets the player to undefined', () => {
            scene.setPlayer(undefined);
            const player = scene.getPlayer();
            expect(player).toBeUndefined();
        });
    });

    describe('getActors', () => {
        it('returns the actors', () => {
            const returnedActors = scene.getActors();
            expect(returnedActors).toEqual([manInBlack]);
        });
    });

    describe('getAliveActors', () => {
        it('returns alive actors', () => {
            const sussannah = new NonPlayableActor({
                name: 'sussannah',
                health: new Health({ current: 5, max: 5 }),
                inventory: new Inventory({}),
                skillSet: new SkillSet({}),
            });
            manInBlack = new NonPlayableActor({
                name: 'walter',
                health: new Health({ current: 0, max: 5 }),
                inventory: new Inventory({}),
                skillSet: new SkillSet({}),
            });
            scene = new Scene({
                player: gunslinger,
                setup,
                actors: [sussannah, manInBlack],
                actions,
            });
            const aliveActors = scene.getAliveActors();
            expect(aliveActors).toEqual([sussannah]);
        });
    });

    describe('isCombat', () => {
        it('returns true when there are actors alive', () => {
            const isCombat = scene.isCombat();
            expect(isCombat).toBeTruthy();
        });

        it('returns false when there are actors alive', () => {
            manInBlack.getHealth().modify(-100);
            const isCombat = scene.isCombat();
            expect(isCombat).toBeFalsy();
        });
    });

    describe('getActionsMap | setActions', () => {
        it('returns an actions map', () => {
            scene.setActions(actions);
            const actionsMap = scene.getActionsMap();
            expect(actionsMap).toBeTruthy();
        });
    });

    describe('containsActor', () => {
        it('returns true for the player', () => {
            const containsActor = scene.containsActor(gunslinger);
            expect(containsActor).toBeTruthy();
        });

        it('returns true for a contained actor', () => {
            const containsActor = scene.containsActor(manInBlack);
            expect(containsActor).toBeTruthy();
        });

        it('returns false for an unknown actor', () => {
            const jake = new NonPlayableActor({
                name: 'jake',
                health: new Health({ current: 5, max: 5 }),
                inventory: new Inventory({}),
                skillSet: new SkillSet({}),
            });
            const containsActor = scene.containsActor(jake);
            expect(containsActor).toBeFalsy();
        });

        it('returns false for an unknown actor when there is no player', () => {
            scene.setPlayer(undefined);
            const jake = new NonPlayableActor({
                name: 'jake',
                health: new Health({ current: 5, max: 5 }),
                inventory: new Inventory({}),
                skillSet: new SkillSet({}),
            });
            const containsActor = scene.containsActor(jake);
            expect(containsActor).toBeFalsy();
        });
    });

    describe('removeActor', () => {
        it('removes the actor', () => {
            scene.removeActor(manInBlack);
            const actors = scene.getActors();
            expect(actors).toEqual([]);
        });
    });
});
