import AdvanceActionWithSideEffect from '../actions/AdvanceActionWithSideEffect';
import Narration from '../core/Narration';
import SceneTemplate from './SceneTemplate';
import AdvanceAction from '../actions/AdvanceAction';
import Scene from '../core/Scene';
import NextSceneDeciderBuilder from './NextSceneDeciderBuilder';
import { SceneTemplateAction } from './SceneTemplate';
import SideEffectBuilder from './SideEffectBuilder';

class SceneActionBuilder {
    private sceneTemplate: SceneTemplate;
    private sceneTemplatePath: string;
    private scene: Scene;
    private narration: Narration;
    private resolvePlaceholders: (string: string) => string;

    constructor({
        sceneTemplate,
        scene,
        narration,
        resolvePlaceholders,
    }: {
        sceneTemplate: SceneTemplate;
        scene: Scene;
        narration: Narration;
        resolvePlaceholders: (string: string) => string;
    }) {
        if (!sceneTemplate.modulePath) {
            throw new Error('module path is required');
        }
        this.sceneTemplate = sceneTemplate;
        this.sceneTemplatePath = sceneTemplate.modulePath;
        this.scene = scene;
        this.narration = narration;
        this.resolvePlaceholders = resolvePlaceholders;
    }

    build(): AdvanceAction[] {
        const sceneTemplateActions = this.sceneTemplate.metadata.actions;
        if (!sceneTemplateActions) {
            return [];
        }
        return Object.keys(sceneTemplateActions).map(
            (sceneTemplateActionText) => {
                const sceneTemplateAction =
                    sceneTemplateActions[sceneTemplateActionText];
                return this.buildAction(
                    sceneTemplateActionText,
                    sceneTemplateAction
                );
            }
        );
    }

    private buildAction(
        text: string,
        sceneTemplateAction: SceneTemplateAction
    ): AdvanceAction {
        if (sceneTemplateAction.sideEffect) {
            return this.buildAdvanceActionWithSideEffect(
                text,
                sceneTemplateAction.sideEffect,
                sceneTemplateAction
            );
        } else {
            return this.buildAdvanceAction(text, sceneTemplateAction);
        }
    }

    private buildAdvanceActionWithSideEffect(
        text: string,
        sideEffectScript: string,
        sceneTemplateAction: SceneTemplateAction
    ): AdvanceActionWithSideEffect {
        const markdownText = this.resolvePlaceholders(text);
        return new AdvanceActionWithSideEffect({
            actor: this.scene.getPlayer(),
            narration: this.narration,
            scene: this.scene,
            name: markdownText,
            nextSceneDecider: (scene: Scene) => {
                return this.nextSceneDecider(scene, sceneTemplateAction);
            },
            sideEffect: (scene: Scene) => {
                this.sideEffect(scene, sideEffectScript);
            },
        });
    }

    private nextSceneDecider(
        scene: Scene,
        sceneTemplateAction: SceneTemplateAction
    ): Promise<Scene> {
        const nextSceneDecider = new NextSceneDeciderBuilder({
            narration: this.narration,
            baseSceneTemplatePath: this.sceneTemplatePath,
            nextSceneRelativePath: sceneTemplateAction.goTo,
            player: scene.getPlayer(),
        });
        return nextSceneDecider.build();
    }

    private buildAdvanceAction(
        text: string,
        sceneTemplateAction: SceneTemplateAction
    ): AdvanceAction {
        const markdownText = this.resolvePlaceholders(text);
        return new AdvanceAction({
            actor: this.scene.getPlayer(),
            narration: this.narration,
            scene: this.scene,
            name: markdownText,
            nextSceneDecider: (scene: Scene) => {
                return this.nextSceneDecider(scene, sceneTemplateAction);
            },
        });
    }

    private sideEffect(scene: Scene, sideEffectScript: string) {
        const sideEffectBuilder = new SideEffectBuilder({
            scene,
            sideEffectScript: sideEffectScript,
        });
        sideEffectBuilder.build();
    }
}

export default SceneActionBuilder;
