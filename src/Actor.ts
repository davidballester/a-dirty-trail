import Health from './Health';
import Inventory from './Inventory';
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

    getName() {
        return this.name;
    }

    changeName(name: string) {
        this.name = name;
    }

    getHealth() {
        return this.health;
    }

    isAlive() {
        return this.health.isAlive();
    }

    getInventory() {
        return this.inventory;
    }

    loot(inventory: Inventory) {
        this.inventory.loot(inventory);
    }

    getSkillSet() {
        return this.skillSet;
    }

    getSkill(skillName: string) {
        return this.skillSet.getSkill(skillName);
    }
}

export default Actor;
