import MarkdownText from '../core/MarkdownText';
import { ActorTemplate } from './ActorTemplate';
import { SceneActionTemplate } from './SceneActionTemplate';
import { SideEffectTemplate } from './SideEffectTemplate';

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
    sideEffect?: SideEffectTemplate;
}
