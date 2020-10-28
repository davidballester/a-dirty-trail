import SceneTemplate, {
    ActorTemplate,
    InventoryTemplate,
} from './SceneTemplate';
import NonPlayableActor from '../core/NonPlayableActor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import Skill from '../core/Skill';
import InventoryBuilder from './InventoryBuilder';

class NonPlayableActorBuilder {
    private actors: { [key: string]: ActorTemplate };

    constructor({ sceneTemplate }: { sceneTemplate: SceneTemplate }) {
        this.actors = sceneTemplate.metadata.actors || {};
    }

    build(): NonPlayableActor[] {
        return Object.keys(this.actors).map((actorName) =>
            this.buildActor(actorName, this.actors[actorName])
        );
    }

    private buildActor(
        name: string,
        actorTemplate: ActorTemplate
    ): NonPlayableActor {
        return new NonPlayableActor({
            name,
            health: this.buildHealth(actorTemplate.health),
            inventory: this.buildInventory(actorTemplate.inventory),
            skillSet: this.buildSkillSet(actorTemplate.skills),
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

    private buildSkillSet(skills: { [name: string]: number }): SkillSet {
        return new SkillSet({
            skills: Object.keys(skills).map(
                (skillName) =>
                    new Skill({
                        name: skillName,
                        probabilityOfSuccess: skills[skillName],
                    })
            ),
        });
    }
}

export default NonPlayableActorBuilder;
