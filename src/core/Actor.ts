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
    private flags: string[];

    constructor({
        name,
        health,
        inventory,
        skillSet,
    }: {
        name: string;
        health: Health;
        inventory: Inventory;
        skillSet: SkillSet;
    }) {
        super();
        this.name = name;
        this.health = health;
        this.inventory = inventory;
        this.skillSet = skillSet;
        this.flags = [];
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

    addFlag(flag: string): void {
        if (!this.hasFlag(flag)) {
            this.flags.push(flag);
        }
    }

    hasFlag(flag: string): boolean {
        return this.flags.indexOf(flag) >= 0;
    }

    removeFlag(flag: string): void {
        this.flags = this.flags.filter((candidate) => candidate !== flag);
    }
}

export default Actor;
