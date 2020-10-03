import {
    Action,
    AttackAction,
    LeaveAction,
    LootAction,
    PacifyAction,
    ReloadAction,
} from './mechanics/actions';
import { Actor, ActorStatus } from './mechanics/actor';
import {
    Ammunition,
    AttackOutcome,
    AttackOutcomeStatus,
    Weapon,
} from './mechanics/attack';
import { canChangeScene, Scene } from './mechanics/scene';
import { ActorGenerator } from './world/actors';
import { SceneGenerator } from './world/scenes';

export class Game {
    player: Actor;
    scene: Scene;
    generators: {
        sceneGenerator: SceneGenerator;
        actorGenerator: ActorGenerator;
    };
    lastScene?: Scene;

    constructor(
        sceneGenerator: SceneGenerator,
        actorGenerator: ActorGenerator
    ) {
        this.generators = {
            sceneGenerator,
            actorGenerator,
        };
        this.lastScene = undefined;
        this.player = this.buildPlayer();
        this.scene = sceneGenerator();
    }

    buildPlayerActions(): Action<any>[] {
        const actions = [] as Action<any>[];
        actions.push(...this.buildPacifyActions());
        actions.push(...this.buildAttackActions());
        actions.push(...this.buildLootActions());
        actions.push(...this.buildReloadActions(this.player));
        if (canChangeScene(this.scene)) {
            actions.push(this.buildLeaveAction());
        }
        return actions;
    }

    buildOponentsActions(): { [actorId: string]: Action<any>[] } {
        return this.scene.actors
            .filter((actor) => actor.is(ActorStatus.hostile))
            .map((actor) => {
                const attackActions = this.buildOponentAttackActions(actor);
                const reloadActions = this.buildReloadActions(actor);
                return {
                    actorId: actor.id,
                    actions: [...attackActions, ...reloadActions],
                };
            })
            .reduce(
                (actorsActions, actorActions) => ({
                    ...actorsActions,
                    [actorActions.actorId]: actorActions.actions,
                }),
                {}
            );
    }

    canExecuteAction(action: Action<any>): boolean {
        const isActorInScene =
            this.player.id === action.player.id ||
            !!this.scene.actors.find(({ id }) => id === action.player.id);
        const isOponentInScene =
            !(action as any).oponent ||
            this.player.id === (action as any).oponent.id ||
            !!this.scene.actors.find(
                ({ id }) => id === (action as any).oponent.id
            );
        return isActorInScene && isOponentInScene;
    }

    executeAction(action: Action<any>): any {
        const result = action.execute();
        if (action instanceof LeaveAction) {
            const newScene = result as Scene;
            this.lastScene = this.scene;
            this.scene = newScene;
        } else if (action instanceof LootAction) {
            this.scene.containers = this.scene.containers.filter(
                (container) => container.id !== action.inventory.id
            );
        } else if (action instanceof AttackAction) {
            if (
                (result as AttackOutcome).status ===
                AttackOutcomeStatus.oponentDead
            ) {
                this.scene.actors = this.scene.actors.filter(
                    (actor) => actor.id !== action.oponent.id
                );
                this.scene.containers.push(action.oponent.inventory);
            }
        } else if (action instanceof PacifyAction) {
            if (!!result) {
                this.scene.actors = this.scene.actors.filter(
                    (actor) => actor.id !== action.oponent.id
                );
            }
        }
        return result;
    }

    private buildPacifyActions(): PacifyAction[] {
        return this.scene.actors
            .filter(
                (actor) =>
                    actor.is(ActorStatus.hostile) && !actor.is(ActorStatus.wild)
            )
            .map(
                (pacifiableActor) =>
                    new PacifyAction(this.player, pacifiableActor)
            );
    }

    private buildAttackActions(): AttackAction[] {
        return this.scene.actors
            .map((oponent) =>
                this.player.inventory.items
                    .filter((item) => item instanceof Weapon)
                    .filter((item) => {
                        const weapon = item as Weapon;
                        return (
                            !weapon.ammunition || !weapon.ammunition.isSpent()
                        );
                    })
                    .map(
                        (weapon) =>
                            new AttackAction(
                                this.player,
                                weapon as Weapon,
                                oponent
                            )
                    )
            )
            .reduce(
                (allAttackActions, attackActionsAgainstHostile) => [
                    ...allAttackActions,
                    ...attackActionsAgainstHostile,
                ],
                []
            );
    }

    private buildLootActions(): LootAction[] {
        return this.scene.containers.map(
            (container) => new LootAction(this.player, container)
        );
    }

    private buildReloadActions(actor: Actor): ReloadAction[] {
        return actor.inventory.items
            .filter((item) => item instanceof Ammunition)
            .map((ammunition) =>
                actor.inventory.items
                    .filter((item) => item instanceof Weapon)
                    .map((weapon) => weapon as Weapon)
                    .filter((weapon) => !!weapon.ammunition)
                    .filter(
                        (weapon) => weapon.ammunition!.name === ammunition.name
                    )
                    .filter(
                        (weapon) =>
                            weapon.ammunition!.quantity <
                            weapon.ammunition!.maxAmmunition
                    )
                    .map(
                        (weapon) =>
                            new ReloadAction(
                                actor,
                                weapon as Weapon,
                                ammunition as Ammunition,
                                actor.inventory
                            )
                    )
            )
            .reduce(
                (allReloadActions, ammunitionReloadActions) => [
                    ...allReloadActions,
                    ...ammunitionReloadActions,
                ],
                []
            );
    }

    private buildLeaveAction(): LeaveAction {
        return new LeaveAction(this.player, this.generators.sceneGenerator);
    }

    private buildOponentAttackActions(actor: Actor): AttackAction[] {
        return actor.inventory.items
            .filter((item) => item instanceof Weapon)
            .filter((item) => {
                const weapon = item as Weapon;
                return !weapon.ammunition || !weapon.ammunition.isSpent();
            })
            .map(
                (weapon) =>
                    new AttackAction(actor, weapon as Weapon, this.player)
            );
    }

    private buildPlayer(): Actor {
        const actor = this.generators.actorGenerator();
        actor.name = 'the player';
        actor.health.currentHitpoints = actor.health.maxHitpoints;
        actor.inventory.name = 'pouch';
        actor.status = [];
        return actor;
    }
}
