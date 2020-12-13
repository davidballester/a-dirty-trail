import Actor from '../core/Actor';
import Scene from '../core/Scene';
import { SceneTemplate } from './SceneTemplate';
import { ActorTemplate } from './ActorTemplate';
import Narration from '../core/Narration';
import AdvanceAction, { SideEffect } from '../actions/AdvanceAction';
import SceneActionBuilder from './SceneActionBuilder';
import NonPlayableActor from '../core/NonPlayableActor';
import NonPlayableActorBuilder from './NonPlayableActorBuilder';
import ActorBuilder from './ActorBuilder';
import SceneTemplateResolver from './SceneTemplateResolver';
import SideEffectBuilder from './SideEffectBuilder';

class SceneBuilder {
    private sceneTemplateResolver: SceneTemplateResolver;
    private sceneTemplate: SceneTemplate;
    private narration: Narration;
    private player: Actor;
    private scene?: Scene;

    constructor({
        sceneTemplateResolver,
        sceneTemplate,
        narration,
        player,
    }: {
        sceneTemplateResolver: SceneTemplateResolver;
        sceneTemplate: SceneTemplate;
        narration: Narration;
        player?: Actor;
    }) {
        this.sceneTemplateResolver = sceneTemplateResolver;
        this.sceneTemplate = sceneTemplate;
        this.narration = narration;
        if (!player && !this.sceneTemplate.metadata.player) {
            throw new Error('no player!');
        }
        if (!player) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.player = this.buildPlayer(this.sceneTemplate.metadata.player!);
        } else {
            this.player = player;
        }
    }

    private buildPlayer(actorTemplate: ActorTemplate): Actor {
        const actorBuilder = new ActorBuilder({ actorTemplate });
        return actorBuilder.build();
    }

    build(): Scene {
        this.scene = this.buildSceneBase();
        const actions = this.buildActions(this.scene);
        this.scene.setActions(actions);
        return this.scene;
    }

    private buildSceneBase(): Scene {
        const actors = this.buildActors();
        const sideEffect = this.buildSideEffect();
        return new Scene({
            id: this.sceneTemplate.metadata.id,
            title: this.sceneTemplate.metadata.title,
            actors,
            player: this.player,
            setup: this.sceneTemplate.setup,
            actions: [],
            sideEffect,
        });
    }

    private buildActions(scene: Scene): AdvanceAction[] {
        if (!this.sceneTemplate.metadata.actions) {
            return [];
        }
        const sceneActionBuilder = new SceneActionBuilder({
            sceneTemplateResolver: this.sceneTemplateResolver,
            narration: this.narration,
            scene: scene,
            sceneTemplate: this.sceneTemplate,
        });
        return sceneActionBuilder.build();
    }

    private buildActors(): NonPlayableActor[] {
        if (!this.sceneTemplate.metadata.actors) {
            return [];
        }
        const actorBuilder = new NonPlayableActorBuilder({
            sceneTemplate: this.sceneTemplate,
        });
        return actorBuilder.build();
    }

    private buildSideEffect(): SideEffect | undefined {
        const sideEffectTemplate = this.sceneTemplate.metadata.sideEffect;
        if (!sideEffectTemplate) {
            return undefined;
        }
        return (scene: Scene): void => {
            const sideEffectBuilder = new SideEffectBuilder({
                scene,
                sideEffectTemplate,
            });
            sideEffectBuilder.build();
        };
    }
}

export default SceneBuilder;
