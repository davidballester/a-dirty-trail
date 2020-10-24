import Actor from './Actor';
import Damage from './Damage';
import Weapon from './Weapon';

class ChallengeRate {
    static getWeaponChallengeRate(weapon: Weapon): number {
        const averageDamage = ChallengeRate.getAverageDamage(
            weapon.getDamage()
        );
        const ammunition = weapon.getAmmunition();
        if (!ammunition) {
            return averageDamage;
        }
        const maxAmmunition = ammunition.getMax();
        const weaponChallengeRate =
            averageDamage - averageDamage / (maxAmmunition + 1);
        return weaponChallengeRate;
    }

    private static getAverageDamage(damage: Damage): number {
        const minDamage = damage.getMin();
        const maxDamage = damage.getMax();
        const amplitude = maxDamage - minDamage;
        const halfAmplitude = amplitude / 2;
        const averageDamage = halfAmplitude + minDamage;
        return averageDamage;
    }

    static getActorChallengeRate(actor: Actor): number {
        const health = actor.getHealth().getCurrent();
        const highestWeaponChallengeRate = ChallengeRate.getHighestWeaponChallengeRate(
            actor
        );
        const challengeRate = highestWeaponChallengeRate + health * 0.5;
        return challengeRate;
    }

    private static getHighestWeaponChallengeRate(actor: Actor): number {
        const weapons = actor.getInventory().getWeapons();
        const challengeRates = weapons.map(
            ChallengeRate.getWeaponChallengeRate
        );
        const highestChallengeRate = challengeRates.reduce(
            (highest, challengeRate) =>
                challengeRate > highest ? challengeRate : highest,
            0
        );
        return highestChallengeRate || 0;
    }
}

export default ChallengeRate;
