import ThingWithId from './ThingWithId';
import Action from '../actions/Action';
import NonPlayableActor from './NonPlayableActor';
import Actor from './Actor';
import MarkdownText from './MarkdownText';
import { SideEffect } from '../actions/AdvanceAction';

class Scene extends ThingWithId {
    private player: Actor;
    private title: MarkdownText;
    private setup?: MarkdownText;
    private actors: NonPlayableActor[];
    private actions: Action<any>[];
    private sideEffect?: SideEffect;

    constructor({
        id,
        player,
        title,
        setup,
        actors,
        actions,
        sideEffect,
    }: {
        id: string;
        player: Actor;
        title: MarkdownText;
        setup?: MarkdownText;
        actors: NonPlayableActor[];
        actions: Action<any>[];
        sideEffect?: SideEffect;
    }) {
        super(id);
        this.title = title;
        this.player = player;
        this.setup = setup;
        this.actors = actors;
        this.actions = actions;
        this.sideEffect = sideEffect;
    }

    getPlayer(): Actor {
        return this.player;
    }

    getTitle(): MarkdownText {
        return this.title;
    }

    getSetup(): MarkdownText | undefined {
        return this.setup;
    }

    getActors(): NonPlayableActor[] {
        return this.actors;
    }

    removeActor(actor: NonPlayableActor): void {
        this.actors = this.actors.filter(
            (candidate) => !candidate.equals(actor)
        );
    }

    setActions(actions: Action<any>[]): void {
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
        const isPlayer = actor.equals(player);
        if (isPlayer) {
            return true;
        }
        return !!this.getActors().find((candidate) => candidate.equals(actor));
    }

    executeSideEffect(): void {
        if (this.sideEffect) {
            this.sideEffect(this);
        }
    }
}

export default Scene;
