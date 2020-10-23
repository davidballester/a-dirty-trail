import Actor from './Actor';
import Damage from './Damage';
import Weapon from './Weapon';

export const getWeaponChallengeRate = (weapon: Weapon): number => {
    const averageDamage = getAverageDamage(weapon.getDamage());
    const ammunition = weapon.getAmmunition();
    if (!ammunition) {
        return averageDamage;
    }
    const maxAmmunition = ammunition.getMax();
    const weaponChallengeRate =
        averageDamage - averageDamage / (maxAmmunition + 1);
    return weaponChallengeRate;
};

const getAverageDamage = (damage: Damage): number => {
    const minDamage = damage.getMin();
    const maxDamage = damage.getMax();
    const amplitude = maxDamage - minDamage;
    const halfAmplitude = amplitude / 2;
    const averageDamage = halfAmplitude + minDamage;
    return averageDamage;
};

export const getActorChallengeRate = (actor: Actor) => {
    const health = actor.getHealth().getCurrent();
    const highestWeaponChallengeRate = getHighestWeaponChallengeRate(actor);
    const challengeRate = highestWeaponChallengeRate + health * 0.5;
    return challengeRate;
};

const getHighestWeaponChallengeRate = (actor: Actor) => {
    const weapons = actor.getInventory().getWeapons();
    const challengeRates = weapons.map(getWeaponChallengeRate);
    const highestChallengeRate = challengeRates.reduce(
        (highest, challengeRate) =>
            challengeRate > highest ? challengeRate : highest,
        0
    );
    return highestChallengeRate || 0;
};
