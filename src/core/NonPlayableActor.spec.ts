import { when } from 'jest-when';
import ChallengeRate from './ChallengeRate';
import Health from './Health';
import Inventory from './Inventory';
import NonPlayableActor from './NonPlayableActor';
import Scene from './Scene';
import SkillSet from './SkillSet';
import NonPlayableActorActionBuilder from '../actions/NonPlayableActorActionBuilder';
import Damage from './Damage';
import AttackAction from '../actions/AttackAction';
import ReloadAction from '../actions/ReloadAction';
import WeaponAmmunition from './WeaponAmmunition';
import ScapeAction from '../actions/ScapeAction';
import Firearm from './Firearm';
jest.mock('../actions/NonPlayableActorActionBuilder');

describe('NonPlayableActor', () => {
    describe('getNextAction', () => {
        let janeDoe: NonPlayableActor;
        let scene: Scene;
        let shotgun: Firearm;
        let revolver: Firearm;
        let getWeapons: jest.SpyInstance;
        let getWeaponChallengeRate: jest.SpyInstance;
        let buildActions: jest.SpyInstance;
        let getAttackActions: jest.SpyInstance;
        let getReloadActions: jest.SpyInstance;
        let getScapeAction: jest.SpyInstance;
        let attackWithShotgun: AttackAction;
        let attackWithRevolver: AttackAction;
        let reloadShotgun: ReloadAction;
        let scapeAction: ScapeAction;
        beforeEach(() => {
            shotgun = new Firearm({
                name: 'shotgun',
                type: 'gun',
                skill: 'aiming',
                damage: new Damage({ min: 5, max: 8 }),
                ammunition: new WeaponAmmunition({
                    type: 'shells',
                    current: 1,
                    max: 2,
                }),
            });
            revolver = new Firearm({
                name: 'revolver',
                type: 'gun',
                skill: 'aiming',
                damage: new Damage({ min: 2, max: 4 }),
                ammunition: new WeaponAmmunition({
                    type: 'bullets',
                    current: 2,
                    max: 6,
                }),
            });
            getWeaponChallengeRate = jest.spyOn(
                ChallengeRate,
                'getWeaponChallengeRate'
            );
            when(getWeaponChallengeRate).calledWith(shotgun).mockReturnValue(2);
            when(getWeaponChallengeRate)
                .calledWith(revolver)
                .mockReturnValue(1);
            getWeapons = jest.fn().mockReturnValue([shotgun, revolver]);
            const inventory = ({
                getWeapons,
            } as unknown) as Inventory;
            janeDoe = new NonPlayableActor({
                name: 'Jane Doe',
                health: new Health({ current: 5, max: 5 }),
                inventory,
                skillSet: new SkillSet({}),
            });
            scene = {} as Scene;
            getAttackActions = jest.fn();
            getReloadActions = jest.fn();
            getScapeAction = jest.fn();
            buildActions = jest.fn().mockReturnValue({
                getAttackActions,
                getReloadActions,
                getScapeAction,
            });
            ((NonPlayableActorActionBuilder as unknown) as jest.Mock).mockImplementation(
                () => ({
                    buildActions,
                })
            );

            attackWithShotgun = new AttackAction({
                actor: janeDoe,
                scene,
                oponent: janeDoe,
                weapon: shotgun,
            });
            attackWithRevolver = new AttackAction({
                actor: janeDoe,
                scene,
                oponent: janeDoe,
                weapon: revolver,
            });
            getAttackActions.mockReturnValue([
                attackWithShotgun,
                attackWithRevolver,
            ]);

            reloadShotgun = new ReloadAction({
                actor: janeDoe,
                scene,
                weapon: shotgun,
            });
            getReloadActions.mockReturnValue([reloadShotgun]);

            scapeAction = new ScapeAction({ actor: janeDoe, scene });
            getScapeAction.mockReturnValue(scapeAction);
        });

        it('returns an attack with the deadliest weapon', () => {
            const returnedAction = janeDoe.getNextAction(scene);
            expect(returnedAction).toEqual(attackWithShotgun);
        });

        it('returns an attack with the deadliest weapon if they are sorted the other way around', () => {
            getWeapons.mockReturnValue([revolver, shotgun]);
            const returnedAction = janeDoe.getNextAction(scene);
            expect(returnedAction).toEqual(attackWithShotgun);
        });

        it('returns reload it if they cannot attack with the deadliest weapon', () => {
            getAttackActions.mockReturnValue([attackWithRevolver]);
            const returnedAction = janeDoe.getNextAction(scene);
            expect(returnedAction).toEqual(reloadShotgun);
        });

        it('returns other attack if they cannot reload the deadliest weapon', () => {
            getAttackActions.mockReturnValue([attackWithRevolver]);
            getReloadActions.mockReturnValue([]);
            const returnedAction = janeDoe.getNextAction(scene);
            expect(returnedAction).toEqual(attackWithRevolver);
        });

        it('scapes if they cannot attack nor reload', () => {
            getAttackActions.mockReturnValue([]);
            getReloadActions.mockReturnValue([]);
            const returnedAction = janeDoe.getNextAction(scene);
            expect(returnedAction).toEqual(scapeAction);
        });

        it('scapes if there are no weapons at all', () => {
            getAttackActions.mockReturnValue([]);
            getReloadActions.mockReturnValue([]);
            getWeapons.mockReturnValue([]);
            const returnedAction = janeDoe.getNextAction(scene);
            expect(returnedAction).toEqual(scapeAction);
        });

        it('throws an error if no actions are possible', () => {
            getAttackActions.mockReturnValue([]);
            getReloadActions.mockReturnValue([]);
            getScapeAction.mockReturnValue(undefined);
            getWeapons.mockReturnValue([]);
            try {
                janeDoe.getNextAction(scene);
                fail('error expected');
            } catch (err) {}
        });
    });
});
