import Action from '../actions/Action';
import { SideEffect } from '../actions/AdvanceAction';
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

    let setup: string;
    let gunslinger: Actor;
    let manInBlack: NonPlayableActor;
    let actors: NonPlayableActor[];
    let actions: Action<any>[];
    let scene: Scene;
    let title: string;
    let sideEffect: SideEffect;
    beforeEach(() => {
        setup =
            'The man in black fled across the desert, and the gunslinger followed';
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
        title = '19';
        sideEffect = jest.fn();
        scene = new Scene({
            id: title,
            title,
            player: gunslinger,
            setup,
            actors,
            actions: [],
            sideEffect,
        });
        actions = [
            new CustomAction({ scene, type: 'custom', actor: gunslinger }),
        ];
    });

    describe('getSetup', () => {
        it('returns the setup', () => {
            const returnedSetup = scene.getSetup();
            expect(returnedSetup).toEqual(setup);
        });

        it('returns undefined if not setup is provided', () => {
            scene = new Scene({
                id: title,
                title,
                player: gunslinger,
                actors,
                actions: [],
            });
            const returnedSetup = scene.getSetup();
            expect(returnedSetup).toBeUndefined();
        });
    });

    describe('getPlayer', () => {
        it('gets the player', () => {
            const player = scene.getPlayer();
            expect(player).toEqual(gunslinger);
        });
    });

    describe('getTitle', () => {
        it('gets the title', () => {
            const returnedTitle = scene.getTitle();
            expect(returnedTitle).toEqual(title);
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
                id: title,
                title,
                player: gunslinger,
                setup,
                actors: [sussannah, manInBlack],
                actions,
            });
            const aliveActors = scene.getAliveActors();
            expect(aliveActors).toEqual([sussannah]);
        });
    });

    describe('getDeadActors', () => {
        it('returns dead actors', () => {
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
                id: title,
                title,
                player: gunslinger,
                setup,
                actors: [sussannah, manInBlack],
                actions,
            });
            const deadActors = scene.getDeadActors();
            expect(deadActors).toEqual([manInBlack]);
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

    describe('getActions | setActions', () => {
        it('returns the actions', () => {
            scene.setActions(actions);
            const returnedActions = scene.getActions();
            expect(returnedActions).toEqual(actions);
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
    });

    describe('removeActor', () => {
        it('removes the actor', () => {
            scene.removeActor(manInBlack);
            const actors = scene.getActors();
            expect(actors).toEqual([]);
        });
    });

    describe('executeSideEffect', () => {
        it('executes the side effect', () => {
            scene.executeSideEffect();
            expect(sideEffect).toHaveBeenCalledWith(scene);
        });
    });
});
