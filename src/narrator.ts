import { Game } from './game';
import {
    Action,
    AttackAction,
    LeaveAction,
    LootAction,
    PacifyAction,
    ReloadAction,
} from './mechanics/actions';
import { Actor, ActorStatus } from './mechanics/actor';
import { AttackOutcome, AttackOutcomeStatus } from './mechanics/attack';
import { Scene } from './mechanics/scene';
import { SkillName } from './mechanics/skill';

export class Narrator {
    player: Actor;
    capitalizedPlayerName: string;
    lastSceneDescribedId: string | undefined;
    constructor(player: Actor) {
        this.player = player;
        this.capitalizedPlayerName = this.capitalize(this.player.name);
        this.lastSceneDescribedId = undefined;
    }

    tellIntroduction(): string {
        return `On a day like any other, ${this.capitalizedPlayerName} began their journey.`;
    }

    describeSetup(scene: Scene): string {
        if (this.lastSceneDescribedId !== scene.id) {
            this.lastSceneDescribedId = scene.id;
            let description = `${this.capitalizedPlayerName} found themself in a ${scene.name}. `;
            if (scene.scenary.length) {
                if (scene.scenary.length === 1) {
                    description += `They could see a ${scene.scenary[0]} there. `;
                } else {
                    description += `They could see ${scene.scenary
                        .slice(0, -1)
                        .map((thing) => `a ${thing}`)
                        .join(', ')} and a ${
                        scene.scenary[scene.scenary.length - 1]
                    } there. `;
                }
            }
            if (scene.actors.length) {
                description += `${this.capitalizedPlayerName} was not alone. `;
                scene.actors.forEach((actor) => {
                    let status = 'peaceful and kind hearted';
                    if (actor.is(ActorStatus.hostile)) {
                        status = `${
                            actor.is(ActorStatus.wild) ? 'wild eyed, ' : ''
                        }eager to get ${this.capitalizedPlayerName} belongings`;
                    }
                    description += `${this.capitalize(
                        actor.name
                    )}, was there, ${status}. `;
                });
            }
            if (scene.containers.length) {
                if (scene.containers.length === 1) {
                    description += `${this.capitalizedPlayerName} could see a ${scene.containers[0].name} not far away. `;
                } else {
                    description += `${
                        this.capitalizedPlayerName
                    } could see ${scene.containers
                        .slice(0, -1)
                        .map((container) => `a ${container.name}`)
                        .join(', ')} and a ${
                        scene.containers[scene.containers.length - 1].name
                    } not far away. `;
                }
            }
            return description.trim();
        }
        return '';
    }

    describeAction(action: Action<any>): string {
        if (action instanceof AttackAction) {
            return this.describeAttackAction(action as AttackAction);
        }
        if (action instanceof ReloadAction) {
            return this.describeReloadAction(action as ReloadAction);
        }
        if (action instanceof PacifyAction) {
            return this.describePacifyAction(action as PacifyAction);
        }
        if (action instanceof LootAction) {
            return this.describeLootAction(action as LootAction);
        }
        if (action instanceof LeaveAction) {
            return this.describeLeaveAction(action as LeaveAction);
        }
        return '';
    }

    describeActionOutcome(action: Action<any>, actionOutcome: any): string {
        if (action instanceof AttackAction) {
            return this.describeAttackActionOutcome(
                action as AttackAction,
                actionOutcome as AttackOutcome
            );
        }
        if (action instanceof ReloadAction) {
            return this.describeReloadActionOutcome(
                action as ReloadAction,
                actionOutcome as boolean
            );
        }
        if (action instanceof PacifyAction) {
            return this.describePacifyActionOutcome(
                action as PacifyAction,
                actionOutcome as boolean
            );
        }
        if (action instanceof LootAction) {
            return this.describeLootActionOutcome(action as LootAction);
        }
        if (action instanceof LeaveAction) {
            return this.describeLeaveActionOutcome();
        }
        return '';
    }

    tellEnding(): string {
        return `That is the sad tale of ${this.capitalizedPlayerName}. But bear with me, for I know many others.`;
    }

    private describeAttackAction(attackAction: AttackAction): string {
        return `${this.capitalize(attackAction.player.name)} ${
            attackAction.weapon.skillName === SkillName.closeCombat
                ? 'charged forward with their'
                : 'shot their'
        } ${attackAction.weapon.name} at ${attackAction.oponent.name}.`;
    }

    private describeReloadAction(reloadAction: ReloadAction): string {
        return `${this.capitalize(reloadAction.player.name)} put ${
            reloadAction.ammunition.quantity
        } ${reloadAction.ammunition.name} in their ${
            reloadAction.weapon.name
        }.`;
    }

    private describePacifyAction(pacifyAction: PacifyAction): string {
        return `${this.capitalize(pacifyAction.player.name)} tried to calm ${
            pacifyAction.oponent.name
        } down.`;
    }

    private describeLootAction(lootAction: LootAction): string {
        return `${this.capitalize(
            lootAction.player.name
        )} went through the contents of ${lootAction.inventory.name}.`;
    }

    private describeLeaveAction(leaveAction: LeaveAction): string {
        return `With nothing else to do, ${this.capitalize(
            leaveAction.player.name
        )} continued their journey.`;
    }

    private describeAttackActionOutcome(
        action: AttackAction,
        outcome: AttackOutcome
    ): string {
        let description = '';
        if (action.weapon.ammunition) {
            description = `The ${action.weapon.ammunition.name}`;
        } else {
            description = `The ${action.weapon.name}`;
        }
        switch (outcome.status) {
            case AttackOutcomeStatus.hit: {
                return `${description} wounded ${action.oponent.name} for ${outcome.damage} hit points`;
            }
            case AttackOutcomeStatus.missed: {
                return `${description} missed.`;
            }
            case AttackOutcomeStatus.oponentDead: {
                return `${description} hit ${action.oponent.name}, who dropped to the ground, never to raise again.`;
            }
            case AttackOutcomeStatus.outOfAmmo: {
                return 'Out of ammo!';
            }
        }
    }

    private describeReloadActionOutcome(
        action: ReloadAction,
        success: boolean
    ): string {
        if (success) {
            return `${this.capitalize(action.weapon.name)} now had ${
                action.weapon.ammunition!.quantity
            } ${action.weapon.ammunition!.name} in its chamber.`;
        }
        return 'Wrong ammunition!';
    }

    private describePacifyActionOutcome(
        action: PacifyAction,
        success: boolean
    ): string {
        if (success) {
            return `Soothed, the ${action.oponent.name} retreated.`;
        }
        return `${this.capitalize(
            action.oponent.name
        )} wouldn't be convinced that easily.`;
    }

    private describeLootActionOutcome(action: LootAction): string {
        const items = action.inventory.items;
        if (!items.length) {
            return 'There was nothing of value.';
        }
        let itemsDescription = '';
        if (items.length === 1) {
            itemsDescription = items[0].name;
        } else {
            itemsDescription = `${items.slice(0, -2).join(', ')} and ${
                items[items.length - 1]
            }`;
        }
        return `They found ${itemsDescription}.`;
    }

    private describeLeaveActionOutcome(): string {
        return '';
    }

    private capitalize(string: string): string {
        return string.substring(0, 1).toUpperCase() + string.substring(1);
    }
}
