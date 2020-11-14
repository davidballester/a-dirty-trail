import Actor from '../core/Actor';
import { InventoryTemplate } from './InventoryTemplate';
import InventoryTemplateBuilder from './InventoryTemplateBuilder';
import { ActorTemplate, FlagsTemplate } from './ActorTemplate';

class ActorTemplateBuilder {
    private actor: Actor;

    constructor({ actor }: { actor: Actor }) {
        this.actor = actor;
    }

    build(): ActorTemplate {
        return {
            name: this.actor.getName(),
            health: this.buildHealthTemplate(),
            inventory: this.buildInventoryTemplate(),
            skills: this.buildSkillsTemplate(),
            flags: this.buildFlagsTemplate(),
        };
    }

    private buildHealthTemplate(): string {
        const health = this.actor.getHealth();
        return `${health.getCurrent()}-${health.getMax()}`;
    }

    private buildInventoryTemplate(): InventoryTemplate {
        const inventoryTemplateBuilder = new InventoryTemplateBuilder({
            inventory: this.actor.getInventory(),
        });
        return inventoryTemplateBuilder.build();
    }

    private buildSkillsTemplate(): { [skillName: string]: number } {
        const skillSet = this.actor.getSkillSet();
        const skills = skillSet.getAll();
        return skills.reduce(
            (skillsTemplate, skill) => ({
                ...skillsTemplate,
                [skill.getName()]: skill.getProbabilityOfSuccess(),
            }),
            {}
        );
    }

    private buildFlagsTemplate(): FlagsTemplate {
        return this.actor.getFlags().getFlagMap();
    }
}

export default ActorTemplateBuilder;
