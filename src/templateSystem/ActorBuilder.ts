import {
    ActorTemplate,
    FlagsTemplate,
    SkillSetTemplate,
} from './ActorTemplate';
import { InventoryTemplate } from './InventoryTemplate';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import Skill from '../core/Skill';
import InventoryBuilder from './InventoryBuilder';
import Actor from '../core/Actor';
import Flags from '../core/Flags';

class ActorBuilder {
    private actorTemplate: ActorTemplate;

    constructor({ actorTemplate }: { actorTemplate: ActorTemplate }) {
        this.actorTemplate = actorTemplate;
    }

    build(): Actor {
        return new Actor({
            name: this.actorTemplate.name || 'Unknown',
            health: this.buildHealth(this.actorTemplate.health),
            inventory: this.buildInventory(this.actorTemplate.inventory),
            skillSet: this.buildSkillSet(this.actorTemplate.skills),
            flags: this.buildFlags(this.actorTemplate.flags),
        });
    }

    private buildHealth(rule: string): Health {
        const [current, max] = rule.split('-');
        return new Health({ current: parseInt(current), max: parseInt(max) });
    }

    private buildInventory(inventoryTemplate: InventoryTemplate): Inventory {
        const inventoryBuilder = new InventoryBuilder({ inventoryTemplate });
        return inventoryBuilder.build();
    }

    private buildSkillSet(skillSetTemplate: SkillSetTemplate): SkillSet {
        return new SkillSet({
            skills: Object.keys(skillSetTemplate).map((skillName) => {
                const skillTemplate = skillSetTemplate[skillName];
                if (typeof skillTemplate === 'number') {
                    return new Skill({
                        name: skillName,
                        probabilityOfSuccess: skillTemplate,
                    });
                }
                return new Skill({
                    name: skillName,
                    probabilityOfSuccess: skillTemplate.probabilityOfSuccess,
                    levelUpDelta: skillTemplate.levelUpDelta,
                });
            }),
        });
    }

    private buildFlags(flagsTemplate: FlagsTemplate = {}): Flags {
        return new Flags(flagsTemplate);
    }
}

export default ActorBuilder;
