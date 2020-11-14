import { InventoryTemplate } from './InventoryTemplate';

export interface SideEffectTemplate {
    loot?: InventoryTemplate;
    rename?: string;
    modifyHealth?: number;
    addFlag?: string;
    addFlags?: string[];
    removeFlag?: string;
    removeFlags?: string[];
    modifyFlag?: ModifyFlag;
    modifyFlags?: ModifyFlag[];
}

export interface ModifyFlag {
    name: string;
    value: number;
}
