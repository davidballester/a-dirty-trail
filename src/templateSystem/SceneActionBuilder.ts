import Narration from '../core/Narration';
import { SceneTemplate } from './SceneTemplate';
import AdvanceAction, {
    NextSceneDecider,
    SideEffect,
} from '../actions/AdvanceAction';
import Scene from '../core/Scene';
import {
    CheckTemplate,
    ConditionTemplate,
    SceneActionTemplate,
    SideEffectTemplate,
} from './SceneActionTemplate';
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
        return Object.keys(sceneTemplateActions)
            .map((sceneTemplateActionText): AdvanceAction | undefined => {
                const sceneTemplateAction =
                    sceneTemplateActions[sceneTemplateActionText];
                if (this.meetsActionCondition(sceneTemplateAction.condition)) {
                    return this.buildAction(
                        sceneTemplateActionText,
                        sceneTemplateAction
                    );
                }
            })
            .filter(Boolean) as AdvanceAction[];
    }

    private meetsActionCondition(
        condition: ConditionTemplate | undefined
    ): boolean {
        if (!condition) {
            return true;
        }
        const mandatoryTrinket = condition.hasTrinket;
        const hasMandatoryTrinket =
            !!mandatoryTrinket && this.playerHasTrinket(mandatoryTrinket);
        const forbiddenTrinket = condition.doesNotHaveTrinket;
        const hasForbiddenTrinket =
            !!forbiddenTrinket && this.playerHasTrinket(forbiddenTrinket);
        const isFlagsCheckSuccessful = this.meetsFlagsConditions(
            condition.hasFlag,
            condition.hasFlags,
            condition.hasNotFlag,
            condition.hasNotFlags
        );
        return (
            (!mandatoryTrinket || hasMandatoryTrinket) &&
            (!hasForbiddenTrinket || !hasForbiddenTrinket) &&
            isFlagsCheckSuccessful
        );
    }

    private playerHasTrinket(trinketName: string): boolean {
        const player = this.scene.getPlayer();
        const inventory = player.getInventory();
        return inventory.hasTrinket(trinketName);
    }

    private buildAction(
        text: string,
        sceneTemplateAction: SceneActionTemplate
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
        sceneTemplateAction: SceneActionTemplate
    ): NextSceneDecider {
        if (sceneTemplateAction.nextSceneId) {
            return () => {
                return this.sceneTemplateResolver.fetchScene(
                    this.narration,
                    sceneTemplateAction.nextSceneId
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
        const success = player.rollSkill(skill, modifier);
        return this.sceneTemplateResolver.fetchScene(
            this.narration,
            success
                ? checkTemplate.success.nextSceneId
                : checkTemplate.failure.nextSceneId
        );
    }

    private meetsFlagsConditions(
        hasFlag?: string,
        hasFlags: string[] = [],
        hasNotFlag?: string,
        hasNotFlags: string[] = []
    ): boolean {
        if (hasFlag) {
            hasFlags.push(hasFlag);
        }
        if (hasNotFlag) {
            hasNotFlags.push(hasNotFlag);
        }
        const player = this.scene.getPlayer();
        const isHasFlagsSuccessful = hasFlags.every((flag) =>
            player.hasFlag(flag)
        );
        const isHasNotFlagsSuccessful = hasNotFlags.every(
            (flag) => !player.hasFlag(flag)
        );
        return isHasFlagsSuccessful && isHasNotFlagsSuccessful;
    }
}

export default SceneActionBuilder;
