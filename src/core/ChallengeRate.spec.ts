import Actor from './Actor';
import { getWeaponChallengeRate, getActorChallengeRate } from './ChallengeRate';
import Damage from './Damage';
import Health from './Health';
import Inventory from './Inventory';
import SkillSet from './SkillSet';
import Weapon from './Weapon';
import WeaponAmmunition from './WeaponAmmunition';

describe('getWeaponChallengeRate', () => {
    let revolver: Weapon;
    let shotgun: Weapon;
    let club: Weapon;
    beforeEach(() => {
        revolver = new Weapon({
            name: 'revolver',
            type: 'gun',
            skill: 'aiming',
            damage: new Damage({ min: 1, max: 2 }),
            ammunition: new WeaponAmmunition({
                type: 'bullets',
                current: 6,
                max: 6,
            }),
        });
        shotgun = new Weapon({
            name: 'shotgun',
            type: 'gun',
            skill: 'aiming',
            damage: new Damage({ min: 1, max: 2 }),
            ammunition: new WeaponAmmunition({
                type: 'shells',
                current: 2,
                max: 2,
            }),
        });
        club = new Weapon({
            name: 'club',
            type: 'club',
            skill: 'swinging',
            damage: new Damage({ min: 1, max: 2 }),
        });
    });

    it('returns the average damage for weapons without ammunition', () => {
        const challengeRate = getWeaponChallengeRate(club);
        expect(challengeRate).toEqual(1.5);
    });

    it('returns a lower value for weapons with same damage and ammunition', () => {
        const challengeRate = getWeaponChallengeRate(revolver);
        expect(challengeRate).toBeLessThan(1.5);
    });

    it('returns an even lower value for weapons with less ammunition', () => {
        const revolverChallengeRate = getWeaponChallengeRate(club);
        const shotgunChallengeRate = getWeaponChallengeRate(shotgun);
        expect(shotgunChallengeRate).toBeLessThan(revolverChallengeRate);
    });
});

describe('getActorChallengeRate', () => {
    let club: Weapon;
    let shotgun: Weapon;
    let actor: Actor;
    beforeEach(() => {
        club = new Weapon({
            name: 'club',
            type: 'club',
            skill: 'swinging',
            damage: new Damage({ min: 1, max: 2 }),
        });
        shotgun = new Weapon({
            name: 'shotgun',
            type: 'gun',
            skill: 'aiming',
            damage: new Damage({ min: 1, max: 2 }),
            ammunition: new WeaponAmmunition({
                type: 'shells',
                current: 2,
                max: 2,
            }),
        });
        actor = new Actor({
            name: 'player',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({ weapons: [club, shotgun] }),
            skillSet: new SkillSet({}),
        });
    });

    it('returns the expected challenge rate', () => {
        const challengeRate = getActorChallengeRate(actor);
        expect(challengeRate).toEqual(4);
    });
});
