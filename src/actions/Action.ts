import Actor from '../core/Actor';
import ThingWithId from '../core/ThingWithId';
import Scene from '../core/Scene';

abstract class Action<T> extends ThingWithId {
    private type: string;
    private name?: string;
    private actor: Actor;
    protected scene: Scene;

    constructor({
        type,
        name,
        scene,
        actor,
    }: {
        type: string;
        name?: string;
        scene: Scene;
        actor: Actor;
    }) {
        super();
        this.type = type;
        this.name = name;
        this.scene = scene;
        this.actor = actor;
    }

    getType(): string {
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

    abstract execute(): T;
}

export default Action;
