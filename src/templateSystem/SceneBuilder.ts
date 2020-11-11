import Actor from '../core/Actor';
import Scene from '../core/Scene';
import { SceneTemplate, ActorTemplate } from './SceneTemplate';
import Narration from '../core/Narration';
import AdvanceAction from '../actions/AdvanceAction';
import SceneActionBuilder from './SceneActionBuilder';
import NonPlayableActor from '../core/NonPlayableActor';
import NonPlayableActorBuilder from './NonPlayableActorBuilder';
import ActorBuilder from './ActorBuilder';
import SceneTemplateResolver from './SceneTemplateResolver';

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
        const setup = this.resolvePlaceholders(this.sceneTemplate.setup);
        const title = this.resolvePlaceholders(
            this.sceneTemplate.metadata.title
        );
        const actors = this.buildActors();
        return new Scene({
            id: this.sceneTemplate.metadata.id,
            title,
            actors,
            player: this.player,
            setup: setup,
            actions: [],
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
            resolvePlaceholders: (string: string) =>
                this.resolvePlaceholders(string),
            sceneTemplate: this.sceneTemplate,
        });
        return sceneActionBuilder.build();
    }

    private resolvePlaceholders(string = ''): string {
        return this.replacePlaceholderByInputs(string, {
            playerName: this.player.getName(),
        });
    }

    private replacePlaceholderByInputs(
        string: string,
        input: { [key: string]: string }
    ): string {
        return Object.keys(input).reduce((newContent, inputKey) => {
            const inputValue = input[inputKey];
            return newContent.replace(
                new RegExp(`\{\{${inputKey}\}\}`, 'g'),
                inputValue
            );
        }, string.trim());
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
}

export default SceneBuilder;
