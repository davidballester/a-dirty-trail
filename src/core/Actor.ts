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
}

export default Actor;
