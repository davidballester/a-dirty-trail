import MarkdownText from '../core/MarkdownText';

interface SceneTemplate {
    metadata: SceneTemplateMetadata;
    setup: MarkdownText;
}

export interface SceneTemplateMetadata {
    title: MarkdownText;
    player?: ActorTemplate;
    actions?: { [key: string]: ActionTemplate };
    actors?: { [key: string]: ActorTemplate };
}

export interface ActionTemplate {
    sideEffect?: SideEffectTemplate;
    nextSceneTitle: string;
}

export interface SideEffectTemplate {
    loot?: InventoryTemplate;
    rename?: string;
    modifyHealth?: number;
}

export interface ActorTemplate {
    name?: string;
    health: string;
    inventory: InventoryTemplate;
    skills: {
        [name: string]: number;
    };
}

export interface InventoryTemplate {
    ammunitions?: {
        [type: string]: number;
    };
    weapons?: { [name: string]: WeaponTemplate };
    trinkets?: TrinketTemplate[];
}

export interface TrinketTemplate {
    name: string;
    description?: string;
}

export interface WeaponTemplate {
    type: string;
    damage: string;
    skill: string;
    ammunitionType?: string;
    ammunition?: string;
    canBeLooted?: boolean;
}

export default SceneTemplate;
