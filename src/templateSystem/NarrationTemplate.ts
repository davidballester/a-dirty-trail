import { ActorTemplate } from './ActorTemplate';

export interface NarrationTemplate {
    title: string;
    actor: ActorTemplate;
    currentSceneId: string;
}
