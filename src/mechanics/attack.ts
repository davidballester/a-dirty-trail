import {
    Ammunition,
    AttackOutcome,
    AttackOutcomeStatus,
    Weapon,
    Actor,
    ActorStatus,
} from '../models';
import { isSkillSuccessful } from './skill';

export const reloadWeapon = (weapon: Weapon, ammunition: Ammunition) => {
    if (!weapon.ammunition || !ammunition || !ammunition.quantity) {
        return false;
    }
    if (weapon.ammunition.name !== ammunition.name) {
        return false;
    }
    weapon.ammunition.modifyAmmunition(ammunition.quantity);
    ammunition.modifyAmmunition(-ammunition.quantity);
    return true;
};

export const attack = (
    player: Actor,
    weapon: Weapon,
    oponent: Actor
): AttackOutcome => {
    oponent.set(ActorStatus.hostile);
    let damage;
    try {
        damage = useWeapon(weapon);
    } catch (error) {
        return {
            status: AttackOutcomeStatus.outOfAmmo,
        };
    }
    const skill = player.getSkill(weapon.skillName);
    if (!isSkillSuccessful(skill)) {
        return {
            status: AttackOutcomeStatus.missed,
        };
    }
    oponent.health.modifyHitpoints(-damage);
    return {
        status: oponent.isAlive()
            ? AttackOutcomeStatus.hit
            : AttackOutcomeStatus.oponentDead,
        damage,
    };
};

const useWeapon = (weapon: Weapon) => {
    if (weapon.ammunition && weapon.ammunition.quantity === 0) {
        throw new Error('out-of-ammunition');
    }
    if (weapon.ammunition) {
        weapon.ammunition.modifyAmmunition(-1);
    }
    const damageRange = weapon.maxDamage - weapon.minDamage;
    const damage = Math.round(Math.random() * damageRange) + weapon.minDamage;
    return damage;
};
