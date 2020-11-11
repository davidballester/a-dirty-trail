import { ActorTemplate } from './SceneTemplate';

export interface NarrationTemplate {
    title: string;
    actor: ActorTemplate;
    currentSceneId: string;
}
