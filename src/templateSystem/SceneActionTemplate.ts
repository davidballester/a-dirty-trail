import { InventoryTemplate } from './InventoryTemplate';

export interface SceneActionTemplate {
    sideEffect?: SideEffectTemplate;
    check?: CheckTemplate;
    nextSceneTitle?: string;
}

export interface SideEffectTemplate {
    loot?: InventoryTemplate;
    rename?: string;
    modifyHealth?: number;
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
