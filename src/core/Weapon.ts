import Actor from './Actor';
import Damage from './Damage';
import ThingWithId from './ThingWithId';
import WeaponAmmunition from './WeaponAmmunition';

class Weapon extends ThingWithId {
    private name: string;
    private type: string;
    private skill: string;
    private damage: Damage;
    private ammunition?: WeaponAmmunition;
    private lootable: boolean;

    constructor({
        name,
        type,
        skill,
        damage,
        ammunition,
        canBeLooted = true,
    }: {
        name: string;
        type: string;
        skill: string;
        damage: Damage;
        ammunition?: WeaponAmmunition;
        canBeLooted?: boolean;
    }) {
        super();
        this.name = name;
        this.type = type;
        this.skill = skill;
        this.damage = damage;
        this.ammunition = ammunition;
        this.lootable = canBeLooted;
    }

    getName(): string {
        return this.name;
    }

    changeName(name: string): void {
        this.name = name;
    }

    getType(): string {
        return this.type;
    }

    getSkill(): string {
        return this.skill;
    }

    getDamage(): Damage {
        return this.damage;
    }

    getAmmunition(): WeaponAmmunition | undefined {
        return this.ammunition;
    }

    canBeLooted(): boolean {
        return this.lootable;
    }

    canAttack(): boolean {
        const ammunition = this.getAmmunition();
        return !ammunition || !ammunition.isSpent();
    }

    attack(actor: Actor, oponent: Actor): AttackOutcome {
        this.consumeAmmunition();
        const damage = this.getDamage().getRandomDamage();
        const isSuccessful = this.isSkillCheckSuccessful(actor);
        if (isSuccessful) {
            oponent.getHealth().modify(-damage);
        }
        return {
            type: isSuccessful ? 'hit' : 'missed',
            damage,
        };
    }

    reload(ammunition: number): number {
        const weaponAmmunition = this.getAmmunition();
        if (!weaponAmmunition) {
            throw new Error('weapon does not require ammunition');
        }
        return weaponAmmunition.reload(ammunition);
    }

    private consumeAmmunition() {
        const ammunition = this.getAmmunition();
        if (!ammunition) {
            return;
        }
        ammunition.modify(-1);
    }

    private isSkillCheckSuccessful(actor: Actor) {
        const skillName = this.getSkill();
        return actor.rollSkill(skillName);
    }
}

export default Weapon;

export interface AttackOutcome {
    type: 'hit' | 'missed';
    damage: number;
}
