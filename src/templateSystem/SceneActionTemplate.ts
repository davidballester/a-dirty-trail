import { InventoryTemplate } from './InventoryTemplate';

export interface SceneActionTemplate {
    sideEffect?: SideEffectTemplate;
    check?: CheckTemplate;
    nextSceneTitle?: string;
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
    nextSceneTitle: string;
}

export interface ConditionTemplate {
    hasTrinket?: string;
    doesNotHaveTrinket?: string;
}
