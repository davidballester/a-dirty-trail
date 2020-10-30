import Actor from '../core/Actor';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import SceneBuilder from './SceneBuilder';
import SceneTemplate from './SceneTemplate';

class NextSceneDeciderBuilder {
    private narration: Narration;
    private baseSceneTemplatePath: string;
    private nextSceneRelativePath: string;
    private player: Actor;

    constructor({
        narration,
        baseSceneTemplatePath,
        nextSceneRelativePath,
        player,
    }: {
        narration: Narration;
        baseSceneTemplatePath: string;
        nextSceneRelativePath: string;
        player: Actor;
    }) {
        this.narration = narration;
        this.baseSceneTemplatePath = baseSceneTemplatePath;
        this.nextSceneRelativePath = nextSceneRelativePath;
        this.player = player;
    }

    public async build(): Promise<Scene> {
        const nextSceneTemplate = await this.getNextSceneTemplate();
        const sceneBuilder = new SceneBuilder({
            sceneTemplate: nextSceneTemplate,
            narration: this.narration,
            player: this.player,
        });
        return sceneBuilder.build();
    }

    private async getNextSceneTemplate(): Promise<SceneTemplate> {
        const nextScenePath = this.getNextSceneTemplateModulePath();
        const nextSceneTemplateModule = (await import(nextScenePath)) as {
            default: SceneTemplate;
        };
        const nextSceneTemplate = nextSceneTemplateModule.default;
        nextSceneTemplate.modulePath = nextScenePath;
        return nextSceneTemplate;
    }

    private getNextSceneTemplateModulePath(): string {
        const sceneTemplatePathWithoutSceneName = this.baseSceneTemplatePath.substring(
            0,
            this.baseSceneTemplatePath.lastIndexOf('/')
        );
        return (
            sceneTemplatePathWithoutSceneName + '/' + this.nextSceneRelativePath
        );
    }
}

export default NextSceneDeciderBuilder;
