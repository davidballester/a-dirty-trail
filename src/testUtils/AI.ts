import Scene from '../core/Scene';
import Action from '../actions/Action';
import ActionBuilder from '../actions/ActionBuilder';
import AttackAction from '../actions/AttackAction';
import ReloadAction from '../actions/ReloadAction';
import ActionsMap from '../core/ActionsMap';
import Actor from '../core/Actor';
import ChallengeRate from '../core/ChallengeRate';
import Weapon from '../core/Weapon';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
class AI {
    private player: Actor;
    private deadliestWeapon?: Weapon;

    constructor(scene: Scene) {
        this.player = scene.getPlayer();
    }

    getNextAction(scene: Scene): Action<any> {
        const actionBuilder = new ActionBuilder({
            scene,
            actor: this.player,
        });
        const actions = actionBuilder.buildActions();
        if (!this.deadliestWeapon) {
            this.deadliestWeapon = this.getDeadliestWeapon();
        }
        let nextAction:
            | Action<any>
            | undefined = this.getAttackWithDeadliestWeapon(actions);
        if (!!nextAction) {
            return nextAction;
        }
        nextAction = this.getReloadDeadliestWeapon(actions);
        if (!!nextAction) {
            return nextAction;
        }
        return this.getOtherAttack(actions)!;
    }

    private getAttackWithDeadliestWeapon(
        actions: ActionsMap
    ): AttackAction | undefined {
        const deadliestWeapon = this.getDeadliestWeapon();
        return actions
            .getAttackActions()
            .find((action) => action.getWeapon().equals(deadliestWeapon));
    }

    private getDeadliestWeapon(): Weapon {
        if (!this.deadliestWeapon) {
            const weapons = this.player.getInventory().getWeapons();
            this.deadliestWeapon = weapons.reduce(
                (weaponWithHighestChallengeRate, weapon) => {
                    const deadliestWeaponSoFarChallengeRate = ChallengeRate.getWeaponChallengeRate(
                        weaponWithHighestChallengeRate
                    );
                    const candidateWeaponChallengeRate = ChallengeRate.getWeaponChallengeRate(
                        weapon
                    );
                    if (
                        candidateWeaponChallengeRate >
                        deadliestWeaponSoFarChallengeRate
                    ) {
                        return weapon;
                    } else {
                        return weaponWithHighestChallengeRate;
                    }
                },
                weapons[0]
            );
        }
        return this.deadliestWeapon;
    }

    private getReloadDeadliestWeapon(
        actions: ActionsMap
    ): ReloadAction | undefined {
        const deadliestWeapon = this.getDeadliestWeapon();
        return actions
            .getReloadActions()
            .find((action) => action.getWeapon().equals(deadliestWeapon));
    }

    private getOtherAttack(actions: ActionsMap): AttackAction | undefined {
        const attackActions = actions.getAttackActions();
        return attackActions[0];
    }
}

export default AI;
