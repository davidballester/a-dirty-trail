import {
    Action,
    Actor,
    Ammunition,
    AttackAction,
    NonPlayableActor,
    ReloadAction,
    ScapeAction,
    Weapon,
} from '../models';
import { getActorChallengeRate, getWeaponChallengeRate } from './challengeRate';

export const buildOponentsActions = (
    oponents: NonPlayableActor[],
    player: Actor
) =>
    oponents
        .map((oponent) => buildOponentAction(oponent, player))
        .sort(
            (firstAction, secondAction) =>
                getActorChallengeRate(secondAction.player) -
                getActorChallengeRate(firstAction.player)
        );

const buildOponentAction = (oponent: NonPlayableActor, player: Actor) => {
    switch (oponent.combatStrategy) {
        case 'offensive': {
            return buildOponentOffensiveAction(oponent, player);
        }
        case 'defensive': {
            return buildOponentDefensiveAction(oponent, player);
        }
    }
};

const buildOponentOffensiveAction = (
    oponent: NonPlayableActor,
    player: Actor
) =>
    buildOponentOffensiveActionRecursive(
        oponent,
        player,
        oponent.inventory.getWeapons()
    );

const buildOponentOffensiveActionRecursive = (
    oponent: NonPlayableActor,
    player: Actor,
    weapons: Weapon[]
): Action => {
    if (!weapons.length) {
        return new ScapeAction(oponent);
    }
    const bestWeapon = getWeaponWithHighestChallengeRate(weapons);
    if (!bestWeapon.ammunition || !bestWeapon.ammunition.isSpent()) {
        return new AttackAction(oponent, bestWeapon, player);
    }
    const ammunitionForBestWeapon = oponent.inventory.items.find(
        (item) =>
            item instanceof Ammunition &&
            item.name === bestWeapon.ammunition!.name
    ) as Ammunition;
    const otherWeapons = weapons.filter(({ id }) => id !== bestWeapon.id);
    if (!otherWeapons.length) {
        if (ammunitionForBestWeapon) {
            return new ReloadAction(
                oponent,
                bestWeapon,
                ammunitionForBestWeapon
            );
        }
        return new ScapeAction(oponent);
    }
    if (!ammunitionForBestWeapon) {
        return buildOponentOffensiveActionRecursive(
            oponent,
            player,
            otherWeapons
        );
    }
    const relativeHealth =
        oponent.health.currentHitpoints / oponent.health.maxHitpoints;
    if (relativeHealth > 0.5) {
        return new ReloadAction(oponent, bestWeapon, ammunitionForBestWeapon);
    }
    return buildOponentOffensiveActionRecursive(oponent, player, otherWeapons);
};

const getWeaponWithHighestChallengeRate = (weapons: Weapon[]) => {
    let currentWeapon = weapons[0];
    let currentChallengeRate = getWeaponChallengeRate(currentWeapon);
    weapons.slice(1).forEach((weapon) => {
        const challengeRate = getWeaponChallengeRate(weapon);
        if (challengeRate > currentChallengeRate) {
            currentWeapon = weapon;
            currentChallengeRate = challengeRate;
        }
    });
    return currentWeapon;
};

const buildOponentDefensiveAction = (
    oponent: NonPlayableActor,
    player: Actor
): Action =>
    buildOponentDefensiveActionRecursive(
        oponent,
        player,
        oponent.inventory.getWeapons()
    );

const buildOponentDefensiveActionRecursive = (
    oponent: NonPlayableActor,
    player: Actor,
    weapons: Weapon[]
) => {
    if (!weapons.length) {
        return new ScapeAction(oponent);
    }
    const bestWeapon = getWeaponWithHighestChallengeRate(weapons);
    if (!bestWeapon.ammunition || !bestWeapon.ammunition.isSpent()) {
        return new AttackAction(oponent, bestWeapon, player);
    }
    const ammunitionForBestWeapon = oponent.inventory.items.find(
        (item) =>
            item instanceof Ammunition &&
            item.name === bestWeapon.ammunition!.name
    ) as Ammunition;
    if (ammunitionForBestWeapon) {
        return new ReloadAction(oponent, bestWeapon, ammunitionForBestWeapon);
    }
    const otherWeapons = weapons.filter(({ id }) => id !== bestWeapon.id);
    return buildOponentOffensiveActionRecursive(oponent, player, otherWeapons);
};
