import { InventoryTemplate } from './InventoryTemplate';

export interface SceneActionTemplate {
    sideEffect?: SideEffectTemplate;
    check?: CheckTemplate;
    nextSceneId?: string;
    condition?: ConditionTemplate;
}

export interface SideEffectTemplate {
    loot?: InventoryTemplate;
    rename?: string;
    modifyHealth?: number;
    addFlag?: string;
    addFlags?: string[];
    removeFlag?: string;
    removeFlags?: string[];
}

export interface CheckTemplate {
    skill: string;
    modifier?: number;
    success: CheckTemplateResolution;
    failure: CheckTemplateResolution;
}

export interface CheckTemplateResolution {
    nextSceneId: string;
}

export interface ConditionTemplate {
    hasTrinket?: string;
    doesNotHaveTrinket?: string;
    hasFlag?: string;
    hasFlags?: string[];
    hasNotFlag?: string;
    hasNotFlags?: string[];
}
