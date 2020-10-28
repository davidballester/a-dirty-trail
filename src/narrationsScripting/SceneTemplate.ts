import MarkdownText from '../core/MarkdownText';

interface SceneTemplate {
    modulePath?: string;
    title: MarkdownText;
    metadata: SceneTemplateMetadata;
    setup: MarkdownText;
}

export interface SceneTemplateMetadata {
    actions?: { [key: string]: ActionTemplate };
    actors?: { [key: string]: ActorTemplate };
}

export interface ActionTemplate {
    sideEffect?: SideEffectTemplate;
    goTo: string;
}

export interface SideEffectTemplate {
    loot?: InventoryTemplate;
    rename?: string;
}

export interface ActorTemplate {
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
