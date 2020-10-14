import { generateNarration } from './database/narrations';
import { attack, reloadWeapon } from './mechanics/attack';
import { buildOponentsActions } from './mechanics/combatStrategy';
import { takeItems } from './mechanics/inventory';
import { pacify } from './mechanics/pacify';
import {
    Action,
    Actor,
    ActorStatus,
    AdvanceToActAction,
    AdvanceToSceneAction,
    Ammunition,
    AttackAction,
    AttackOutcomeStatus,
    CustomAction,
    LootAction,
    Narration,
    PacifyAction,
    ReloadAction,
    ScapeAction,
    Scene,
    SkillName,
    Weapon,
} from './models';

export class Game {
    narration: Narration;
    player: Actor;
    currentScene: Scene;
    finished: boolean;
    oponentsActions: Action[] = [];

    constructor(narrationTitle: string) {
        const { player, narration } = generateNarration(narrationTitle);
        this.player = player;
        this.narration = narration;
        this.currentScene = narration.getNextAct(player)!;
        this.finished = false;
        this.buildOponentsActions();
    }

    getPlayerActions(): Action[] {
        if (!this.player.isAlive()) {
            return [];
        }
        const actions = [] as Action[];
        actions.push(...this.buildAttackActions());
        actions.push(...this.buildLootActions());
        actions.push(...this.buildReloadActions(this.player));
        actions.push(...this.currentScene.actions);
        return actions.filter((action) => this.canExecuteAction(action));
    }

    canExecuteAction(action: Action) {
        if (!action.player.isAlive() || !this.isActorInScene(action.player)) {
            return false;
        }
        if (
            action instanceof AdvanceToSceneAction ||
            action instanceof AdvanceToActAction
        ) {
            return this.currentScene.getHostileActors().length === 0;
        }
        if (action instanceof AttackAction) {
            return (
                this.isActorInScene(action.oponent) &&
                action.oponent.isAlive() &&
                (!action.weapon.ammunition ||
                    !action.weapon.ammunition.isSpent())
            );
        }
        if (action instanceof ReloadAction) {
            return (
                !!action.weapon.ammunition &&
                action.weapon.ammunition.name === action.ammunition.name &&
                action.weapon.ammunition.quantity <
                    action.weapon.ammunition.maxAmmunition &&
                !action.ammunition.isSpent()
            );
        }
        if (action instanceof PacifyAction) {
            return (
                !action.oponent.is(ActorStatus.wild) &&
                action.oponent.getSkill(SkillName.charisma).level <
                    action.player.getSkill(SkillName.charisma).level
            );
        }
        if (action instanceof CustomAction) {
            return action.canExecute(this.currentScene);
        }
        return true;
    }

    executeAction(action: Action) {
        if (action instanceof AttackAction) {
            const attackOutcome = attack(
                action.player,
                action.weapon,
                action.oponent
            );
            if (attackOutcome.status === AttackOutcomeStatus.oponentDead) {
                this.currentScene.actors = this.currentScene.actors.filter(
                    (actor) => actor.id !== action.oponent.id
                );
                action.oponent.inventory.removeUntransferableItems();
                this.currentScene.containers.push(action.oponent.inventory);
                this.oponentsActions = this.oponentsActions.filter(
                    ({ player }) => player.id === action.oponent.id
                );
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
                this.currentScene.actors = this.currentScene.actors.filter(
                    (actor) => actor.id !== action.oponent.id
                );
            }
            return isSuccess;
        }
        if (action instanceof LootAction) {
            const inventoryItems = action.inventory.items;
            takeItems(action.player.inventory, action.inventory);
            this.currentScene.containers = this.currentScene.containers.filter(
                (container) => container.id !== action.inventory.id
            );
            return inventoryItems;
        }
        if (action instanceof AdvanceToSceneAction) {
            this.currentScene = action.nextScene;
            this.buildOponentsActions();
            return this.currentScene;
        }
        if (action instanceof AdvanceToActAction) {
            const nextScene = this.narration.getNextAct(this.player);
            if (nextScene) {
                this.currentScene = nextScene;
                this.buildOponentsActions();
            } else {
                this.finished = true;
            }
            return this.currentScene;
        }
        if (action instanceof CustomAction) {
            const nextAction = action.execute(this.currentScene);
            return this.executeAction(nextAction);
        }
        if (action instanceof ScapeAction) {
            this.currentScene.actors = this.currentScene.actors.filter(
                (actor) => actor.id !== action.player.id
            );
            return true;
        }
    }

    executeNextOponentAction() {
        if (this.oponentsActions.length) {
            const [nextAction] = this.oponentsActions.splice(0, 1);
            let outcome;
            if (this.canExecuteAction(nextAction)) {
                outcome = this.executeAction(nextAction);
            }
            if (!this.oponentsActions.length) {
                this.buildOponentsActions();
            }
            if (outcome !== undefined) {
                return {
                    action: nextAction,
                    outcome,
                };
            }
        }
    }

    private buildOponentsActions() {
        this.oponentsActions = buildOponentsActions(
            this.currentScene.getHostileActors(),
            this.player
        );
    }

    private buildAttackActions(): AttackAction[] {
        return this.currentScene.actors
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
        return this.currentScene.containers.map(
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

    private isActorInScene(actor: Actor) {
        return (
            this.player.id === actor.id ||
            !!this.currentScene.actors.find(({ id }) => id === actor.id)
        );
    }
}
