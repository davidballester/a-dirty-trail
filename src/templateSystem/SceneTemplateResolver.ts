/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SceneTemplate } from './SceneTemplate';
import parseMarkdown from 'markdown-yaml-metadata-parser';
import SceneBuilder from './SceneBuilder';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
import SceneTemplateEvaluator from './SceneTemplateEvaluator';

abstract class SceneTemplateResolver {
    private narration?: Narration;

    async fetchScene(
        narration: Narration,
        sceneId?: string,
        player?: Actor
    ): Promise<Scene> {
        this.narration = narration;
        let markdownSceneTemplate = await this.fetchMarkdownSceneTemplate(
            this.narration.getTitle(),
            sceneId
        );
        markdownSceneTemplate = this.evaluateAsTemplate(markdownSceneTemplate);
        const sceneTemplate = this.convertToSceneTemplate(
            markdownSceneTemplate
        );
        return this.buildScene(sceneTemplate, player);
    }

    protected abstract fetchMarkdownSceneTemplate(
        narrationTitle: string,
        sceneId?: string
    ): Promise<string>;

    private evaluateAsTemplate(markdownSceneTemplate: string): string {
        const currentScene = this.narration!.getCurrentScene();
        const player = currentScene ? currentScene.getPlayer() : undefined;
        const sceneTemplateEvaluator = new SceneTemplateEvaluator({
            template: markdownSceneTemplate,
            player,
        });
        return sceneTemplateEvaluator.evaluate();
    }

    private convertToSceneTemplate(
        markdownSceneTemplate: string
    ): SceneTemplate {
        const { metadata, content: setup } = parseMarkdown(
            markdownSceneTemplate
        );
        return { metadata, setup };
    }

    private buildScene(sceneTemplate: SceneTemplate, player?: Actor): Scene {
        const currentScene = this.narration!.getCurrentScene();
        if (!player && currentScene) {
            player = currentScene.getPlayer();
        }
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
