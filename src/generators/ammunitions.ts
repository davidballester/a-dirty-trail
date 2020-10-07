import * as weapons from '../database/weapons';
import { getWeaponChallengeRate } from '../mechanics/challengeRate';
import { Ammunition, Weapon } from '../models';

const ammunitionTypesToWeaponsChallengeRates = Object.keys(weapons)
    .map((weaponName) => weapons[weaponName] as Weapon)
    .filter((weapon) => !!weapon.ammunition)
    .reduce(
        (map, weapon) => ({
            ...map,
            [weapon.ammunition!.name]: [
                ...(map[weapon.ammunition!.name] || []),
                getWeaponChallengeRate(weapon),
            ],
        }),
        {}
    );

const ammunitionTypesToAvgChallengeRate = Object.keys(
    ammunitionTypesToWeaponsChallengeRates
).reduce(
    (map, ammunitionType) => ({
        ...map,
        [ammunitionType]:
            ammunitionTypesToWeaponsChallengeRates[ammunitionType].reduce(
                (total, cr) => total + cr,
                0
            ) / ammunitionTypesToWeaponsChallengeRates[ammunitionType].length,
    }),
    {}
);

export const generateAmmunition = (
    ammunitionType: string,
    challengeRate: number
): Ammunition => {
    const ammunitionChallengeRate =
        ammunitionTypesToAvgChallengeRate[ammunitionType];
    const cartridges = Math.max(
        Math.ceil(challengeRate / ammunitionChallengeRate),
        1
    );
    return new Ammunition(ammunitionType, cartridges, 50);
};
