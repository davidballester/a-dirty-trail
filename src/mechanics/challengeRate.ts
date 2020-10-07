import { Actor, Weapon } from '../models';

export const getWeaponChallengeRate = (weapon: Weapon) => {
    const averageDamage =
        (weapon.maxDamage - weapon.minDamage) / 2 + weapon.minDamage;
    if (!weapon.ammunition) {
        return averageDamage;
    }
    const maxAmmunition = weapon.ammunition.maxAmmunition;
    return averageDamage - averageDamage / (maxAmmunition + 1);
};

export const getActorChallengeRate = (actor: Actor) => {
    const health = actor.health.currentHitpoints;
    return (
        Math.max(
            ...actor.inventory.getWeapons().map((weapon) => {
                const weaponChallengeRate = getWeaponChallengeRate(weapon);
                const skillLevel = actor.getSkill(weapon.skillName).level;
                return weaponChallengeRate * skillLevel;
            })
        ) +
        health * 0.5
    );
};
