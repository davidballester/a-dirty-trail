import {
    Action,
    AttackAction,
    LeaveAction,
    LootAction,
    PacifyAction,
    ReloadAction,
} from './mechanics/actions';
import { Actor, ActorStatus } from './mechanics/actor';
import { Scene } from './mechanics/scene';
import { SkillName } from './mechanics/skill';

export const describeScene = (player: Actor, scene: Scene): string => {
    const friendlyActors = scene.actors.filter(
        (actor) => !actor.is(ActorStatus.hostile)
    );
    const hostileActors = scene.actors.filter((actor) =>
        actor.is(ActorStatus.hostile)
    );
    return [
        `${capitalize(player.name)} found themself in a ${scene.name}.`,
        scene.scenary.length
            ? `They could see ${scene.scenary.join(', ')} around them.`
            : undefined,
        friendlyActors.length
            ? `The friendly faces of ${friendlyActors
                  .map((actor) => `an ${actor.name}`)
                  .join(', ')} welcomed them.`
            : undefined,
        hostileActors.length
            ? `But they could also feel the aggresion of ${hostileActors
                  .map((actor) => `an ${actor.name}`)
                  .join(', ')}.`
            : undefined,
    ]
        .filter(Boolean)
        .join(' ');
};

export const describeAction = (action: Action<any>): string => {
    if (action instanceof AttackAction) {
        return describeAttackAction(action as AttackAction);
    }
    if (action instanceof ReloadAction) {
        return describeReloadAction(action as ReloadAction);
    }
    if (action instanceof PacifyAction) {
        return describePacifyAction(action as PacifyAction);
    }
    if (action instanceof LootAction) {
        return describeLootAction(action as LootAction);
    }
    if (action instanceof LeaveAction) {
        return describeLeaveAction(action as LeaveAction);
    }
    return '';
};

const describeAttackAction = (attackAction: AttackAction): string => {
    return `${capitalize(attackAction.player.name)} ${
        attackAction.weapon.skillName === SkillName.closeCombat
            ? ' charge forward with their '
            : ' shot their '
    } ${attackAction.weapon.name} at ${attackAction.oponent.name}.`;
};

const describeReloadAction = (reloadAction: ReloadAction): string => {
    return `${capitalize(reloadAction.player.name)} put ${
        reloadAction.ammunition.quantity
    } ${reloadAction.ammunition.name} in their ${reloadAction.weapon.name}.`;
};

const describePacifyAction = (pacifyAction: PacifyAction): string => {
    return `${capitalize(pacifyAction.player.name)} tried to calm ${
        pacifyAction.oponent.name
    } down.`;
};

const describeLootAction = (lootAction: LootAction): string => {
    return `${capitalize(
        lootAction.player.name
    )} went through the contents of ${lootAction.inventory.name}.`;
};

const describeLeaveAction = (leaveAction: LeaveAction): string => {
    return `With nothing else to do, ${capitalize(
        leaveAction.player.name
    )} continued their journey.`;
};

const capitalize = (string: string): string =>
    string.substring(0, 1).toUpperCase() + string.substring(1);
