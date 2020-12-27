import Action from '../actions/Action';
import ActionBuilder from '../actions/ActionBuilder';
import AttackAction from '../actions/AttackAction';
import ScapeAction from '../actions/ScapeAction';
import ActionsMap from '../core/ActionsMap';
import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';

class CombatSceneEngine {
    private scene: Scene;
    private actorTurnIndex: number;
    private _isPlayerTurn: boolean;

    constructor({ scene }: { scene: Scene }) {
        this.scene = scene;
        this._isPlayerTurn = true;
        this.actorTurnIndex = 0;
    }

    getActorCurrentTurn(): Actor {
        if (this._isPlayerTurn || !this.scene.getAliveActors().length) {
            return this.scene.getPlayer();
        }
        return this.scene.getAliveActors()[this.actorTurnIndex];
    }

    getOponentsInActionOrder(): NonPlayableActor[] {
        return this.scene.getAliveActors();
    }

    async executePlayerAction<T>(action: Action<T>): Promise<T> {
        if (!this._isPlayerTurn) {
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
            return new ActionsMap({ actions: [] });
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
        const affectedActor = this.getAffectedActor(action);
        const affectedActorIndex = this.getAffectedActorIndex(affectedActor);
        const outcome = await action.execute();
        if (
            this._isPlayerTurn &&
            action instanceof AttackAction &&
            affectedActor &&
            !affectedActor.isAlive()
        ) {
            if (affectedActorIndex < this.actorTurnIndex) {
                this.actorTurnIndex--;
                this._isPlayerTurn = false;
                return outcome;
            } else if (affectedActorIndex === this.actorTurnIndex) {
                // Extra turn!
                this.updateTurn();
                this._isPlayerTurn = true;
                return outcome;
            }
        } else if (action instanceof ScapeAction && affectedActor) {
            if (affectedActorIndex < this.actorTurnIndex) {
                this.actorTurnIndex--;
            }
            this._isPlayerTurn = true;
            return outcome;
        }
        this.updateTurn();
        return outcome;
    }

    private getAffectedActor<T>(action: Action<T>): Actor | undefined {
        if (action instanceof AttackAction) {
            if (action.getOponent().equals(this.scene.getPlayer())) {
                return undefined;
            }
            return action.getOponent();
        } else if (action instanceof ScapeAction) {
            return action.getActor();
        }
        return undefined;
    }

    private getAffectedActorIndex(affectedActor?: Actor): number {
        if (!affectedActor) {
            return -1;
        }
        return this.scene
            .getAliveActors()
            .findIndex((actor) => actor.equals(affectedActor));
    }

    private updateTurn() {
        if (this.isCombatOver()) {
            return;
        }
        if (this._isPlayerTurn) {
            this._isPlayerTurn = false;
            this.actorTurnIndex =
                this.actorTurnIndex % this.scene.getAliveActors().length;
        } else {
            this.actorTurnIndex =
                (this.actorTurnIndex + 1) % this.scene.getAliveActors().length;
            this._isPlayerTurn = true;
        }
    }

    async executeNextOponentAction<T>(): Promise<[Action<T>, T] | undefined> {
        const player = this.scene.getPlayer();
        if (this.isActorTurn(player)) {
            throw new Error('Player turn!');
        }
        const currentOponent = this.getActorCurrentTurn() as NonPlayableActor;
        const nextOponentAction = currentOponent.getNextAction(this.scene);
        if (!nextOponentAction || !nextOponentAction.canExecute()) {
            this.updateTurn();
            return undefined;
        }
        const outcome = await this.executeAction(nextOponentAction);
        return [nextOponentAction, outcome];
    }

    isCombatOver(): boolean {
        return !this.scene.isCombat();
    }

    isPlayerTurn(): boolean {
        return this._isPlayerTurn;
    }

    getActorNextTurn(): Actor {
        if (!this._isPlayerTurn || !this.scene.getAliveActors().length) {
            return this.scene.getPlayer();
        }
        return this.scene.getAliveActors()[this.actorTurnIndex];
    }
}

export default CombatSceneEngine;
