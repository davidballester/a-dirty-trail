import Actor from '../core/Actor';
import Scene from '../core/Scene';
import SceneTemplate from './SceneTemplate';
import Narration from '../core/Narration';
import AdvanceAction from '../actions/AdvanceAction';
import SceneActionBuilder from './SceneActionBuilder';

class SceneBuilder {
    private sceneTemplate: SceneTemplate;
    private narration: Narration;
    private player: Actor;
    private scene?: Scene;

    constructor({
        sceneTemplate,
        narration,
        player,
    }: {
        sceneTemplate: SceneTemplate;
        narration: Narration;
        player: Actor;
    }) {
        this.sceneTemplate = sceneTemplate;
        this.narration = narration;
        this.player = player;
    }

    build(): Scene {
        this.scene = this.buildSceneBase();
        const actions = this.buildActions(this.scene);
        this.scene.setActions(actions);
        return this.scene;
    }

    private buildSceneBase(): Scene {
        const setup = this.resolvePlaceholders(this.sceneTemplate.setup);
        const title = this.resolvePlaceholders(this.sceneTemplate.title);
        return new Scene({
            title,
            actors: [],
            player: this.player,
            setup: setup,
            actions: [],
        });
    }

    private buildActions(scene: Scene): AdvanceAction[] {
        const sceneActionBuilder = new SceneActionBuilder({
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
}

export default SceneBuilder;
