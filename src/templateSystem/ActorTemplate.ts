import { InventoryTemplate } from './InventoryTemplate';

export interface ActorTemplate {
    name?: string;
    health: string;
    inventory: InventoryTemplate;
    skills: SkillSetTemplate;
    flags?: FlagsTemplate;
}

export interface FlagsTemplate {
    [name: string]: number;
}

export interface SkillSetTemplate {
    [name: string]: SkillTemplate;
}

export interface SkillTemplate {
    probabilityOfSuccess: number;
    levelUpDelta?: number;
}
