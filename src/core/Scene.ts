import ThingWithId from './ThingWithId';
import Action from '../actions/Action';
import NonPlayableActor from './NonPlayableActor';
import ActionsMap from './ActionsMap';
import Actor from './Actor';
import MarkdownText from './MarkdownText';

class Scene extends ThingWithId {
    private player?: Actor;
    private setup: MarkdownText[];
    private actors: NonPlayableActor[];
    private actions: Action<any>[];

    constructor({
        player,
        setup,
        actors,
        actions,
    }: {
        player?: Actor;
        setup: MarkdownText[];
        actors: NonPlayableActor[];
        actions: Action<any>[];
    }) {
        super();
        this.player = player;
        this.setup = setup;
        this.actors = actors;
        this.actions = actions;
    }

    getPlayer(): Actor | undefined {
        return this.player;
    }

    setPlayer(player?: Actor) {
        this.player = player;
    }

    getSetup(): MarkdownText[] {
        return this.setup;
    }

    getActors(): NonPlayableActor[] {
        return this.actors;
    }

    removeActor(actor: NonPlayableActor) {
        this.actors = this.actors.filter(
            (candidate) => !candidate.equals(actor)
        );
    }

    setActions(actions: Action<any>[]) {
        this.actions = actions;
    }

    getAliveActors(): NonPlayableActor[] {
        return this.getActors().filter((actor) => actor.isAlive());
    }

    getDeadActors(): NonPlayableActor[] {
        return this.getActors().filter((actor) => !actor.isAlive());
    }

    getActions(): Action<any>[] {
        return this.actions;
    }

    isCombat(): boolean {
        const aliveActors = this.getAliveActors();
        return aliveActors.length > 0;
    }

    containsActor(actor: Actor): boolean {
        const player = this.getPlayer();
        const isPlayer = player && actor.equals(player);
        if (isPlayer) {
            return true;
        }
        return !!this.getActors().find((candidate) => candidate.equals(actor));
    }
}

export default Scene;
