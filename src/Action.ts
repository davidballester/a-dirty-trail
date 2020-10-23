import Actor from './Actor';
import ThingWithId from './ThingWithId';
import Scene from './Scene';

abstract class Action<T> extends ThingWithId {
    private type: string;
    private name?: string;
    private actor: Actor;

    constructor({
        type,
        name,
        actor,
    }: {
        type: string;
        name?: string;
        actor: Actor;
    }) {
        super();
        this.type = type;
        this.name = name;
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

    canExecute(scene: Scene): boolean {
        const actor = this.getActor();
        const isActorAlive = actor.isAlive();
        const isActorInScene = scene.containsActor(actor);
        return isActorAlive && isActorInScene;
    }

    abstract execute(scene: Scene): T;
}

export default Action;
