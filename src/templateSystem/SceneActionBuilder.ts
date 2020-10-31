import AdvanceActionWithSideEffect from '../actions/AdvanceActionWithSideEffect';
import Narration from '../core/Narration';
import SceneTemplate, { SideEffectTemplate } from './SceneTemplate';
import AdvanceAction from '../actions/AdvanceAction';
import Scene from '../core/Scene';
import { ActionTemplate } from './SceneTemplate';
import SideEffectBuilder from './SideEffectBuilder';
import SceneTemplateResolver from './SceneTemplateResolver';

class SceneActionBuilder {
    private sceneTemplateResolver: SceneTemplateResolver;
    private sceneTemplate: SceneTemplate;
    private scene: Scene;
    private narration: Narration;
    private resolvePlaceholders: (string: string) => string;

    constructor({
        sceneTemplateResolver,
        sceneTemplate,
        scene,
        narration,
        resolvePlaceholders,
    }: {
        sceneTemplateResolver: SceneTemplateResolver;
        sceneTemplate: SceneTemplate;
        scene: Scene;
        narration: Narration;
        resolvePlaceholders: (string: string) => string;
    }) {
        this.sceneTemplateResolver = sceneTemplateResolver;
        this.sceneTemplate = sceneTemplate;
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
        sceneTemplateAction: ActionTemplate
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
        sideEffectScript: SideEffectTemplate,
        sceneTemplateAction: ActionTemplate
    ): AdvanceActionWithSideEffect {
        const markdownText = this.resolvePlaceholders(text);
        return new AdvanceActionWithSideEffect({
            actor: this.scene.getPlayer(),
            narration: this.narration,
            scene: this.scene,
            name: markdownText,
            nextSceneDecider: () => {
                return this.sceneTemplateResolver.fetchScene(
                    this.narration,
                    sceneTemplateAction.nextSceneTitle
                );
            },
            sideEffect: (scene: Scene) => {
                this.sideEffect(scene, sideEffectScript);
            },
        });
    }

    private buildAdvanceAction(
        text: string,
        sceneTemplateAction: ActionTemplate
    ): AdvanceAction {
        const markdownText = this.resolvePlaceholders(text);
        return new AdvanceAction({
            actor: this.scene.getPlayer(),
            narration: this.narration,
            scene: this.scene,
            name: markdownText,
            nextSceneDecider: () => {
                return this.sceneTemplateResolver.fetchScene(
                    this.narration,
                    sceneTemplateAction.nextSceneTitle
                );
            },
        });
    }

    private sideEffect(scene: Scene, sideEffectTemplate: SideEffectTemplate) {
        const sideEffectBuilder = new SideEffectBuilder({
            scene,
            sideEffectTemplate,
        });
        sideEffectBuilder.build();
    }
}

export default SceneActionBuilder;
