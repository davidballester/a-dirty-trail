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
    sideEffect?: SceneTemplateSideEffect;
    goTo: string;
}

export interface SceneTemplateSideEffect {
    loot?: SceneTemplateInventory;
    rename?: string;
}

export interface SceneTemplateActor {
    health: string;
    inventory: SceneTemplateInventory;
    skills: {
        [name: string]: number;
    };
}

export interface SceneTemplateInventory {
    ammunitions?: {
        [type: string]: number;
    };
    weapons?: { [name: string]: SceneTemplateWeapon };
}

export interface SceneTemplateWeapon {
    type: string;
    damage: string;
    skill: string;
    ammunitionType?: string;
    ammunition?: string;
    canBeLooted?: boolean;
}

export default SceneTemplate;
