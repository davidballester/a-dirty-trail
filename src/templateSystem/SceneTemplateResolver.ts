/* eslint-disable @typescript-eslint/no-non-null-assertion */
import SceneTemplate from './SceneTemplate';
import parseMarkdown from 'markdown-yaml-metadata-parser';
import SceneBuilder from './SceneBuilder';
import Narration from '../core/Narration';
import Scene from '../core/Scene';

abstract class SceneTemplateResolver {
    private narration?: Narration;

    async fetchScene(
        narration: Narration,
        sceneTitle?: string
    ): Promise<Scene> {
        this.narration = narration;
        const markdownSceneTemplate = await this.fetchMarkdownSceneTemplate(
            this.narration.getTitle(),
            sceneTitle
        );
        const sceneTemplate = this.convertToSceneTemplate(
            markdownSceneTemplate
        );
        return this.buildScene(sceneTemplate);
    }

    protected abstract fetchMarkdownSceneTemplate(
        narrationTitle: string,
        sceneTitle?: string
    ): Promise<string>;

    private convertToSceneTemplate(
        markdownSceneTemplate: string
    ): SceneTemplate {
        const { metadata, content: setup } = parseMarkdown(
            markdownSceneTemplate
        );
        return { metadata, setup };
    }

    private buildScene(sceneTemplate: SceneTemplate): Scene {
        const currentScene = this.narration!.getCurrentScene();
        const player = currentScene ? currentScene.getPlayer() : undefined;
        const sceneBuilder = new SceneBuilder({
            sceneTemplateResolver: this,
            sceneTemplate,
            narration: this.narration!,
            player,
        });
        return sceneBuilder.build();
    }
}

export default SceneTemplateResolver;
