import { Actor, ActorStatus } from './actor';
import { Item } from './inventory';
import { SkillName } from './skill';

export class Ammunition extends Item {
    quantity: number;
    maxAmmunition: number;

    constructor(name: string, quantity: number, maxAmmunition: number) {
        super(name);
        this.quantity = quantity;
        this.maxAmmunition = maxAmmunition;
    }

    modifyAmmunition(delta: number) {
        this.quantity += delta;
        this.quantity = Math.max(0, this.quantity);
        this.quantity = Math.min(this.maxAmmunition, this.quantity);
    }

    isSpent(): boolean {
        return this.quantity === 0;
    }
}

export class Weapon extends Item {
    static outOfAmmunitionErrorKey = 'out-of-ammunition';

    minDamage: number;
    maxDamage: number;
    skillName: SkillName;
    ammunition?: Ammunition;

    constructor(
        name: string,
        minDamage: number,
        maxDamage: number,
        skillName: SkillName,
        ammunition?: Ammunition
    ) {
        super(name);
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
        this.skillName = skillName;
        this.ammunition = ammunition;
    }

    attack(): number {
        if (this.ammunition && this.ammunition.quantity === 0) {
            throw new Error(Weapon.outOfAmmunitionErrorKey);
        }
        if (this.ammunition) {
            this.ammunition.modifyAmmunition(-1);
        }
        const damageRange = this.maxDamage - this.minDamage;
        const damage = Math.round(Math.random() * damageRange) + this.minDamage;
        return damage;
    }

    reload(ammunition: Ammunition): boolean {
        if (!this.ammunition || !ammunition || !ammunition.quantity) {
            return false;
        }
        if (this.ammunition.name !== ammunition.name) {
            return false;
        }
        this.ammunition.modifyAmmunition(ammunition.quantity);
        ammunition.modifyAmmunition(-ammunition.quantity);
        return true;
    }
}

export enum AttackOutcomeStatus {
    missed,
    outOfAmmo,
    hit,
    oponentDead,
}

export interface AttackOutcome {
    status: AttackOutcomeStatus;
    damage?: number;
}

export const attack = (
    player: Actor,
    weapon: Weapon,
    oponent: Actor
): AttackOutcome => {
    oponent.set(ActorStatus.hostile);
    let damage;
    try {
        damage = weapon.attack();
    } catch (error) {
        return {
            status: AttackOutcomeStatus.outOfAmmo,
        };
    }
    const skill = player.getSkill(weapon.skillName);
    if (!skill.isSuccessful()) {
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
