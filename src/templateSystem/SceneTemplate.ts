import MarkdownText from '../core/MarkdownText';
import { InventoryTemplate } from './InventoryTemplate';
import { SceneActionTemplate } from './SceneActionTemplate';

export interface SceneTemplate {
    metadata: SceneTemplateMetadata;
    setup: MarkdownText;
}

export interface SceneTemplateMetadata {
    id: string;
    title: MarkdownText;
    player?: ActorTemplate;
    actions?: { [key: string]: SceneActionTemplate };
    actors?: { [key: string]: ActorTemplate };
}

export interface ActorTemplate {
    name?: string;
    health: string;
    inventory: InventoryTemplate;
    skills: {
        [name: string]: number;
    };
    flags?: string[];
}
