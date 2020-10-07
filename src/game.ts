import { attack, reloadWeapon } from './mechanics/attack';
import { takeItems } from './mechanics/inventory';
import { pacify } from './mechanics/pacify';
import { canChangeScene } from './mechanics/scene';
import {
    Action,
    Actor,
    ActorStatus,
    AdvanceToSceneAction,
    Ammunition,
    AttackAction,
    AttackOutcomeStatus,
    LeaveAction,
    LootAction,
    PacifyAction,
    ReloadAction,
    Scene,
    Weapon,
} from './models';
import { ActorGenerator, getActorGenerator } from './generators/actors';
import { getWeaponAndAmmunitionGenerators } from './generators/attack';
import { getSceneGenerator, SceneGenerator } from './generators/scenes';

export class Game {
    player: Actor;
    scene: Scene;
    generators: {
        sceneGenerator: SceneGenerator;
        actorGenerator: ActorGenerator;
    };
    lastScene?: Scene;

    constructor() {
        const {
            ammunitionGenerator,
            weaponGenerator,
        } = getWeaponAndAmmunitionGenerators();
        const actorGenerator = getActorGenerator(
            weaponGenerator,
            ammunitionGenerator
        );
        const sceneGenerator = getSceneGenerator(
            weaponGenerator,
            ammunitionGenerator,
            actorGenerator
        );
        this.generators = {
            sceneGenerator,
            actorGenerator,
        };
        this.lastScene = undefined;
        this.player = this.buildPlayer();
        this.scene = sceneGenerator();
    }

    buildPlayerActions(): Action[] {
        const actions = [] as Action[];
        actions.push(...this.buildPacifyActions());
        actions.push(...this.buildAttackActions());
        actions.push(...this.buildLootActions());
        actions.push(...this.buildReloadActions(this.player));
        if (canChangeScene(this.scene)) {
            actions.push(this.buildLeaveAction());
        }
        return actions;
    }

    buildOponentsActions(): { [actorId: string]: Action[] } {
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

    canExecuteAction(action: Action): boolean {
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

    executeAction(action: Action) {
        if (action instanceof AttackAction) {
            const attackOutcome = attack(
                action.player,
                action.weapon,
                action.oponent
            );
            if (attackOutcome.status === AttackOutcomeStatus.oponentDead) {
                this.scene.actors = this.scene.actors.filter(
                    (actor) => actor.id !== action.oponent.id
                );
                action.oponent.inventory.removeUntransferableItems();
                this.scene.containers.push(action.oponent.inventory);
            }
            return attackOutcome;
        }
        if (action instanceof ReloadAction) {
            const isSuccess = reloadWeapon(action.weapon, action.ammunition);
            if (isSuccess && action.ammunition.isSpent()) {
                action.player.inventory.removeItem(action.ammunition.id);
            }
            return isSuccess;
        }
        if (action instanceof PacifyAction) {
            const isSuccess = pacify(action.player, action.oponent);
            if (!!isSuccess) {
                this.scene.actors = this.scene.actors.filter(
                    (actor) => actor.id !== action.oponent.id
                );
            }
            return isSuccess;
        }
        if (action instanceof LootAction) {
            const inventoryItems = action.inventory.items;
            takeItems(action.inventory, action.player.inventory);
            this.scene.containers = this.scene.containers.filter(
                (container) => container.id !== action.inventory.id
            );
            return inventoryItems;
        }
        if (action instanceof AdvanceToSceneAction) {
            const nextScene = action.nextScene;
            this.lastScene = this.scene;
            this.scene = nextScene;
            return nextScene;
        }
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
                this.player.inventory
                    .getWeapons()
                    .filter(
                        (weapon) =>
                            !weapon.ammunition || !weapon.ammunition.isSpent()
                    )
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
                actor.inventory
                    .getWeapons()
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
                                ammunition as Ammunition
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
        return actor.inventory
            .getWeapons()
            .filter(
                (weapon) => !weapon.ammunition || !weapon.ammunition.isSpent()
            )
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
