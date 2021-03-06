import Flags from './Flags';
import Health from './Health';
import Inventory from './Inventory';
import Skill from './Skill';
import SkillSet from './SkillSet';
import ThingWithId from './ThingWithId';

class Actor extends ThingWithId {
    private name: string;
    private health: Health;
    private inventory: Inventory;
    private skillSet: SkillSet;
    private flags: Flags;

    constructor({
        name,
        health,
        inventory,
        skillSet,
        flags = new Flags(),
    }: {
        name: string;
        health: Health;
        inventory: Inventory;
        skillSet: SkillSet;
        flags?: Flags;
    }) {
        super();
        this.name = name;
        this.health = health;
        this.inventory = inventory;
        this.skillSet = skillSet;
        this.flags = flags;
    }

    getName(): string {
        return this.name;
    }

    changeName(name: string): void {
        this.name = name;
    }

    getHealth(): Health {
        return this.health;
    }

    isAlive(): boolean {
        return this.getHealth().isAlive();
    }

    getInventory(): Inventory {
        return this.inventory;
    }

    loot(inventory: Inventory): Inventory {
        return this.getInventory().loot(inventory);
    }

    getSkillSet(): SkillSet {
        return this.skillSet;
    }

    getSkill(skillName: string): Skill {
        return this.getSkillSet().getSkill(skillName);
    }

    getFlags(): Flags {
        return this.flags;
    }

    rollSkill(skillName: string, modifier = 0): boolean {
        const skill = this.getSkill(skillName);
        const trinketsModifier = this.getInventory().getTrinketsModifiersOnSkill(
            skillName
        );
        return skill.rollSuccessWithModifier(modifier + trinketsModifier);
    }

    getProbabilityOfSuccess(skillName: string, modifier = 0): number {
        const skill = this.getSkill(skillName);
        const trinketsModifier = this.getInventory().getTrinketsModifiersOnSkill(
            skillName
        );
        const probabilityOfSuccess =
            skill.getProbabilityOfSuccess() + trinketsModifier + modifier;
        return Math.max(0, Math.min(1, probabilityOfSuccess));
    }
}

export default Actor;
