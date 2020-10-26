import Actor from '../core/Actor';
import ThingWithId from '../core/ThingWithId';
import Scene from '../core/Scene';
import MarkdownText from '../core/MarkdownText';

abstract class Action<T> extends ThingWithId {
    private type: string;
    private name?: MarkdownText;
    private actor: Actor;
    protected scene: Scene;

    constructor({
        type,
        name,
        scene,
        actor,
    }: {
        type: string;
        name?: MarkdownText;
        scene: Scene;
        actor: Actor;
    }) {
        super();
        this.type = type;
        this.name = name;
        this.scene = scene;
        this.actor = actor;
    }

    getType(): MarkdownText {
        return this.type;
    }

    getName(): string | undefined {
        return this.name;
    }

    getActor() {
        return this.actor;
    }

    canExecute(): boolean {
        const actor = this.getActor();
        const isActorAlive = actor.isAlive();
        const isActorInScene = this.scene.containsActor(actor);
        return isActorAlive && isActorInScene;
    }

    abstract execute(): T | Promise<T>;
}

export default Action;
