import {
    Action,
    Actor,
    AttackAction,
    AttackOutcome,
    AttackOutcomeStatus,
    Item,
    AdvanceToSceneAction,
    LootAction,
    PacifyAction,
    ReloadAction,
    Scene,
    SkillName,
} from './models';

export class Narrator {
    player: Actor;
    capitalizedPlayerName: string;
    lastSceneDescribedId: string | undefined;
    constructor(player: Actor) {
        this.player = player;
        this.capitalizedPlayerName = this.capitalize(this.player.name);
        this.lastSceneDescribedId = undefined;
    }

    describeSetup(scene: Scene): string {
        if (this.lastSceneDescribedId !== scene.id) {
            this.lastSceneDescribedId = scene.id;
            return scene.setup.join('\n');
        }
        return '';
    }

    describeAction(action: Action): string {
        return `> ${action.getName()}`;
    }

    describeActionOutcome(action: Action, actionOutcome: any): string {
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
            return this.describeLootActionOutcome(actionOutcome as Item[]);
        }
        return '';
    }

    tellSadEnding(): string {
        return `That is the sad tale of ${this.capitalizedPlayerName}. But bear with me, for I know many others.`;
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
                return `${description} hit ${action.oponent.name}, who dropped to the ground, never to rise again.`;
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

    private describeLootActionOutcome(items: Item[]): string {
        if (!items.length) {
            return 'There was nothing of value.';
        }
        let itemsDescription = '';
        if (items.length === 1) {
            itemsDescription = items[0].name;
        } else {
            itemsDescription = `${items
                .slice(0, -1)
                .map((item) => item.name)
                .join(', ')} and ${items[items.length - 1].name}`;
        }
        return `They found ${itemsDescription}.`;
    }

    private capitalize(string: string): string {
        return string.substring(0, 1).toUpperCase() + string.substring(1);
    }
}
