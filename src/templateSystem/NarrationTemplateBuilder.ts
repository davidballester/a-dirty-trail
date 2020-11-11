import Narration from '../core/Narration';
import ActorTemplateBuilder from './ActorTemplateBuilder';
import { NarrationTemplate } from './NarrationTemplate';
import { ActorTemplate } from './SceneTemplate';

class NarrationTemplateBuilder {
    private narration: Narration;

    constructor({ narration }: { narration: Narration }) {
        this.narration = narration;
    }

    build(): NarrationTemplate {
        const currentScene = this.narration.getCurrentScene();
        if (!currentScene) {
            throw new Error('a current scene is required');
        }
        const actorTemplate = this.buildActorTemplate();
        return {
            title: this.narration.getTitle(),
            actor: actorTemplate,
            currentSceneId: currentScene.getId(),
        };
    }

    private buildActorTemplate(): ActorTemplate {
        const currentScene = this.narration.getCurrentScene();
        if (!currentScene) {
            throw new Error('a current scene is required');
        }
        const player = currentScene.getPlayer();
        const actorTemplateBuilder = new ActorTemplateBuilder({
            actor: player,
        });
        return actorTemplateBuilder.build();
    }
}

export default NarrationTemplateBuilder;
