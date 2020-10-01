import {
    Action,
    AttackAction,
    LeaveAction,
    LootAction,
    PacifyAction,
    ReloadAction,
} from './mechanics/actions';
import { Actor, ActorStatus } from './mechanics/actor';
import { Ammunition, Weapon } from './mechanics/attack';
import { Inventory } from './mechanics/inventory';
import { canChangeScene, Scene } from './mechanics/scene';
import { describeAction, describeScene } from './narrator';
import { ActorGenerator } from './world/actors';
import { SceneGenerator } from './world/scenes';

export interface Generators {
    sceneGenerator: SceneGenerator;
    actorGenerator: ActorGenerator;
}

export interface Game {
    player: Actor;
    scene: Scene;
    generators: Generators;
}

export const buildGame = (
    sceneGenerator: SceneGenerator,
    actorGenerator: ActorGenerator
): Game => {
    return {
        player: buildPlayer(actorGenerator),
        scene: sceneGenerator(),
        generators: {
            sceneGenerator,
            actorGenerator,
        },
    };
};

export const buildPlayerActions = (game: Game): Action<any>[] => {
    const actions = [] as Action<any>[];
    actions.push(...buildPacifyActions(game.player, game.scene.actors));
    actions.push(...buildAttackActions(game.player, game.scene.actors));
    actions.push(
        ...buildLootActions(
            game.player,
            game.scene.containers,
            game.scene.actors
        )
    );
    actions.push(...buildReloadActions(game.player));
    if (canChangeScene(game.scene)) {
        actions.push(
            buildLeaveAction(game.player, game.generators.sceneGenerator)
        );
    }
    return actions;
};

export const buildOponentsActions = (
    game: Game
): { [actorId: string]: Action<any>[] } => {
    return game.scene.actors
        .filter((actor) => actor.is(ActorStatus.hostile))
        .map((actor) => {
            const attackActions = buildOponentAttackActions(actor, game.player);
            const reloadActions = buildReloadActions(actor);
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
};

export const executeAction = (action: Action<any>, game: Game): void => {
    console.log(describeScene(game.player, game.scene));
    console.log(describeAction(action));
    const result = action.execute();
    if (action instanceof LeaveAction) {
        const newScene = result as Scene;
        game.scene = newScene;
    }
    console.log('Final state: ', JSON.stringify(game));
    console.log('--------------------------------------------');
    console.log();
};

const buildPacifyActions = (
    actor: Actor,
    oponents: Actor[]
): PacifyAction[] => {
    return oponents
        .filter(
            (actor) =>
                actor.is(ActorStatus.hostile) && !actor.is(ActorStatus.wild)
        )
        .map((pacifiableActor) => new PacifyAction(actor, pacifiableActor));
};

const buildAttackActions = (
    actor: Actor,
    oponents: Actor[]
): AttackAction[] => {
    return oponents
        .map((oponent) =>
            actor.inventory.items
                .filter((item) => item instanceof Weapon)
                .filter((item) => {
                    const weapon = item as Weapon;
                    return !weapon.ammunition || !weapon.ammunition.isSpent();
                })
                .map(
                    (weapon) =>
                        new AttackAction(actor, weapon as Weapon, oponent)
                )
        )
        .reduce(
            (allAttackActions, attackActionsAgainstHostile) => [
                ...allAttackActions,
                ...attackActionsAgainstHostile,
            ],
            []
        );
};

const buildLootActions = (
    actor: Actor,
    containers: Inventory[],
    oponents: Actor[]
): LootAction[] => {
    const containersLootActions = containers.map(
        (container) => new LootAction(actor, container)
    );
    const deadActorsLootActions = oponents
        .filter((oponent) => !oponent.isAlive())
        .map((oponent) => new LootAction(actor, oponent.inventory));
    return [...containersLootActions, ...deadActorsLootActions];
};

const buildReloadActions = (actor: Actor): ReloadAction[] => {
    return actor.inventory.items
        .filter((item) => item instanceof Ammunition)
        .map((ammunition) =>
            actor.inventory.items
                .filter((item) => item instanceof Weapon)
                .map((weapon) => weapon as Weapon)
                .filter((weapon) => !!weapon.ammunition)
                .filter((weapon) => weapon.ammunition!.name === ammunition.name)
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
};

const buildLeaveAction = (
    actor: Actor,
    sceneGenerator: SceneGenerator
): LeaveAction => {
    return new LeaveAction(actor, sceneGenerator);
};

const buildOponentAttackActions = (
    actor: Actor,
    oponent: Actor
): AttackAction[] => {
    return actor.inventory.items
        .filter((item) => item instanceof Weapon)
        .filter((item) => {
            const weapon = item as Weapon;
            return !weapon.ammunition || !weapon.ammunition.isSpent();
        })
        .map((weapon) => new AttackAction(actor, weapon as Weapon, oponent));
};

const buildPlayer = (actorGenerator: ActorGenerator) => {
    const actor = actorGenerator();
    actor.name = 'the player';
    actor.health.currentHitpoints = actor.health.maxHitpoints;
    actor.inventory.name = 'pouch';
    actor.status = [];
    return actor;
};
