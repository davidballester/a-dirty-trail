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

    constructor({
        name,
        type,
        skill,
        damage,
        ammunition,
    }: {
        name: string;
        type: string;
        skill: string;
        damage: Damage;
        ammunition?: WeaponAmmunition;
    }) {
        super();
        this.name = name;
        this.type = type;
        this.skill = skill;
        this.damage = damage;
        this.ammunition = ammunition;
    }

    getName(): string {
        return this.name;
    }

    changeName(name: string) {
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

    reload(ammunition: number) {
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
        const skill = actor.getSkill(this.getSkill());
        return skill.rollSuccess();
    }
}

export default Weapon;

export interface AttackOutcome {
    type: 'hit' | 'missed';
    damage: number;
}
