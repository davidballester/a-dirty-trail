import MarkdownText from '../core/MarkdownText';

interface SceneTemplate {
    modulePath?: string;
    title: MarkdownText;
    metadata: SceneTemplateMetadata;
    setup: MarkdownText;
}

export interface SceneTemplateMetadata {
    actions?: { [key: string]: SceneTemplateAction };
    actors?: { [key: string]: SceneTemplateActor };
}

export interface SceneTemplateAction {
    sideEffect?: Rule;
    goTo: string;
}

export interface SceneTemplateActor {
    health: Rule;
    inventory: SceneTemplateActorInventory;
    skills: {
        [name: string]: number;
    };
}

export interface SceneTemplateActorInventory {
    ammunitions: {
        [type: string]: number;
    };
    weapons: { [name: string]: SceneTemplateWeapon };
}

export interface SceneTemplateWeapon {
    type: string;
    damage: string;
    skill: string;
    ammunitionType?: string;
    ammunition?: string;
}

type Rule = string;

export default SceneTemplate;
