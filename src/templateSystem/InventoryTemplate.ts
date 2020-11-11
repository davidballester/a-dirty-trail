import { SkillsModifiers } from '../core/Trinket';

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
    skillsModifiers?: SkillsModifiers;
}

export interface WeaponTemplate {
    type: string;
    damage: string;
    skill: string;
    ammunitionType?: string;
    ammunition?: string;
    canBeLooted?: boolean;
}
