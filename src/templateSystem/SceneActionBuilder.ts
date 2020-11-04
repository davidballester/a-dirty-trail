import Narration from '../core/Narration';
import SceneTemplate, {
    CheckTemplate,
    SideEffectTemplate,
} from './SceneTemplate';
import AdvanceAction, {
    NextSceneDecider,
    SideEffect,
} from '../actions/AdvanceAction';
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
        const markdownText = this.resolvePlaceholders(text);
        const sideEffectScript = sceneTemplateAction.sideEffect;
        let sideEffect: SideEffect | undefined = undefined;
        if (sideEffectScript) {
            sideEffect = (scene: Scene) => {
                this.sideEffect(scene, sideEffectScript);
            };
        }
        const nextSceneDecider = this.buildNextSceneDecider(
            sceneTemplateAction
        );
        return new AdvanceAction({
            actor: this.scene.getPlayer(),
            narration: this.narration,
            scene: this.scene,
            name: markdownText,
            nextSceneDecider,
            sideEffect,
        });
    }

    private sideEffect(scene: Scene, sideEffectTemplate: SideEffectTemplate) {
        const sideEffectBuilder = new SideEffectBuilder({
            scene,
            sideEffectTemplate,
        });
        sideEffectBuilder.build();
    }

    private buildNextSceneDecider(
        sceneTemplateAction: ActionTemplate
    ): NextSceneDecider {
        if (sceneTemplateAction.nextSceneTitle) {
            return () => {
                return this.sceneTemplateResolver.fetchScene(
                    this.narration,
                    sceneTemplateAction.nextSceneTitle
                );
            };
        }
        if (sceneTemplateAction.check) {
            const checkTemplate = sceneTemplateAction.check;
            return (scene: Scene) => {
                return this.resolveCheckNextSceneDecider(scene, checkTemplate);
            };
        }
        throw new Error('Next scene unknown!');
    }

    private resolveCheckNextSceneDecider(
        scene: Scene,
        checkTemplate: CheckTemplate
    ): Promise<Scene> {
        const skill = checkTemplate.skill;
        const modifier = checkTemplate.modifier || 0;
        const player = scene.getPlayer();
        const success = player
            .getSkill(skill)
            .rollSuccessWithModifier(modifier);
        return this.sceneTemplateResolver.fetchScene(
            this.narration,
            success
                ? checkTemplate.success.nextSceneTitle
                : checkTemplate.failure.nextSceneTitle
        );
    }
}

export default SceneActionBuilder;
