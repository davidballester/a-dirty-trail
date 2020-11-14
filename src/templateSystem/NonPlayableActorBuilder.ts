import { SceneTemplate } from './SceneTemplate';
import { ActorTemplate } from './ActorTemplate';
import NonPlayableActor from '../core/NonPlayableActor';
import ActorBuilder from './ActorBuilder';

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
        const actorBuilder = new ActorBuilder({ actorTemplate });
        const baseActor = actorBuilder.build();
        return new NonPlayableActor({
            name,
            health: baseActor.getHealth(),
            inventory: baseActor.getInventory(),
            skillSet: baseActor.getSkillSet(),
        });
    }
}

export default NonPlayableActorBuilder;
