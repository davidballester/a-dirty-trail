import Narration from '../core/Narration';
import ActorBuilder from '../templateSystem/ActorBuilder';
import { NarrationTemplate } from '../templateSystem/NarrationTemplate';
import SceneTemplateResolver from '../templateSystem/SceneTemplateResolver';

abstract class NarrationsCatalogue {
    private sceneTemplateResolver: SceneTemplateResolver;

    constructor({
        sceneTemplateResolver,
    }: {
        sceneTemplateResolver: SceneTemplateResolver;
    }) {
        this.sceneTemplateResolver = sceneTemplateResolver;
    }

    abstract fetchNarrations(): Promise<Narration[]>;

    async initializeNarration(narration: Narration): Promise<Narration> {
        const firstScene = await this.sceneTemplateResolver.fetchScene(
            narration
        );
        narration.setCurrentScene(firstScene);
        return narration;
    }

    async loadNarration(
        narrationTemplate: NarrationTemplate
    ): Promise<Narration> {
        const narration = new Narration({ title: narrationTemplate.title });
        const scene = await this.sceneTemplateResolver.fetchScene(
            narration,
            narrationTemplate.currentSceneTitle
        );
        const actorBuilder = new ActorBuilder({
            actorTemplate: narrationTemplate.actor,
        });
        const actor = actorBuilder.build();
        scene.setPlayer(actor);
        narration.setCurrentScene(scene);
        return narration;
    }
}

export default NarrationsCatalogue;
