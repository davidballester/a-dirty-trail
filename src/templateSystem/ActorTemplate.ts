import { InventoryTemplate } from './InventoryTemplate';

export interface ActorTemplate {
    name?: string;
    health: string;
    inventory: InventoryTemplate;
    skills: {
        [name: string]: number;
    };
    flags?: FlagsTemplate;
}

export interface FlagsTemplate {
    [name: string]: number;
}
