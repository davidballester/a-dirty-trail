import Narration from '../core/Narration';
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
}

export default NarrationsCatalogue;
