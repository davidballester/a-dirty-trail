import Action from '../actions/Action';
import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';

class CombatEngine {
    private scene: Scene;
    private actorsTurns: Actor[];
    private currentTurn: number;

    constructor({ scene }: { scene: Scene }) {
        this.scene = scene;
        this.actorsTurns = [];
        this.currentTurn = 0;
        this.buildTurns();
    }

    private buildTurns() {
        this.actorsTurns = [];
        const aliveActors = this.scene.getAliveActors();
        const player = this.scene.getPlayer();
        aliveActors.forEach((oponent) => {
            this.actorsTurns.push(player);
            this.actorsTurns.push(oponent);
        });
    }

    getActorCurrentTurn(): Actor {
        return this.actorsTurns[this.currentTurn];
    }

    getOponentsInActionOrder(): NonPlayableActor[] {
        return this.scene.getAliveActors();
    }

    async executePlayerAction<T>(action: Action<T>): Promise<T> {
        const player = this.scene.getPlayer();
        if (!this.isActorTurn(player)) {
            throw new Error('Not the turn of the player!');
        }
        if (!action.canExecute()) {
            throw new Error('The action cannot be executed!');
        }
        return this.executeAction(action);
    }

    getPlayerActions(): ActionsMap {
        const player = this.scene.getPlayer();
        if (!this.isActorTurn(player)) {
            throw new Error('Not the turn of the player!');
        }
        const actionsBuilder = new ActionBuilder({
            scene: this.scene,
            actor: player,
        });
        return actionsBuilder.buildActions();
    }

    private isActorTurn(actor: Actor): boolean {
        const actorCurrentTurn = this.getActorCurrentTurn();
        return actor.equals(actorCurrentTurn);
    }

    private async executeAction<T>(action: Action<T>): Promise<T> {
        const outcome = await action.execute();
        this.updateTurn();
        if (this.isActorsCountChanged()) {
            this.rebuildTurns();
        }
        return outcome;
    }

    private updateTurn() {
        this.currentTurn = (this.currentTurn + 1) % this.actorsTurns.length;
    }

    private isActorsCountChanged(): boolean {
        const aliveActors = this.scene.getAliveActors();
        const player = this.scene.getPlayer();
        const actorsInTurns = this.actorsTurns.filter(
            (actor) => !actor.equals(player)
        );
        const isActorsCountChanged =
            aliveActors.length !== actorsInTurns.length;
        return isActorsCountChanged;
    }

    private rebuildTurns() {
        const nextActor = this.getActorCurrentTurn();
        const nextActorIsPlayer = nextActor.equals(this.scene.getPlayer());
        const nextOponentCanAct =
            nextActor.isAlive() && this.scene.containsActor(nextActor);
        this.buildTurns();
        if (nextOponentCanAct && !nextActorIsPlayer) {
            this.currentTurn = 1;
        } else {
            this.currentTurn = 0;
        }
    }

    async executeNextOponentAction<T>(): Promise<[Action<T>, T] | undefined> {
        const player = this.scene.getPlayer();
        if (this.isActorTurn(player)) {
            throw new Error('Player turn!');
        }
        const currentOponent = this.getActorCurrentTurn() as NonPlayableActor;
        const nextOponentAction = currentOponent.getNextAction(this.scene);
        if (!nextOponentAction.canExecute()) {
            return undefined;
        }
        const outcome = await this.executeAction(nextOponentAction);
        return [nextOponentAction, outcome];
    }
}

export default CombatEngine;
