import ThingWithId from './ThingWithId';
import Action from './Action';
import NonPlayableActor from './NonPlayableActor';
import ActionsMap from './ActionsMap';
import Actor from './Actor';

class Scene extends ThingWithId {
    private player?: Actor;
    private setup: string[];
    private actors: NonPlayableActor[];
    private actionsMap: ActionsMap;

    constructor({
        player,
        setup,
        actors,
        actions,
    }: {
        player?: Actor;
        setup: string[];
        actors: NonPlayableActor[];
        actions: Action<any>[];
    }) {
        super();
        this.player = player;
        this.setup = setup;
        this.actors = actors;
        this.actionsMap = new ActionsMap({ actions });
    }

    getPlayer(): Actor | undefined {
        return this.player;
    }

    setPlayer(player?: Actor) {
        this.player = player;
    }

    getSetup(): string[] {
        return this.setup;
    }

    getActors(): NonPlayableActor[] {
        return this.actors;
    }

    getActionsMap(): ActionsMap {
        return this.actionsMap;
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
