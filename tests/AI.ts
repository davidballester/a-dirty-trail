import Action from '../src/actions/Action';
import ActionBuilder from '../src/actions/ActionBuilder';
import AttackAction from '../src/actions/AttackAction';
import ReloadAction from '../src/actions/ReloadAction';
import ActionsMap from '../src/core/ActionsMap';
import Actor from '../src/core/Actor';
import ChallengeRate from '../src/core/ChallengeRate';
import Scene from '../src/core/Scene';
import Weapon from '../src/core/Weapon';

class AI extends Actor {
    private deadliestWeapon?: Weapon;

    getNextAction(scene: Scene): Action<any> | undefined {
        const actionBuilder = new ActionBuilder({
            scene,
            actor: this,
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
        nextAction = this.getOtherAttack(actions);
        if (!!nextAction) {
            return nextAction;
        }
        return actions.getScapeAction();
    }

    private getDeadliestWeapon(): Weapon {
        const weapons = this.getInventory().getWeapons();
        return weapons.reduce((weaponWithHighestChallengeRate, weapon) => {
            const deadliestWeaponSoFarChallengeRate = ChallengeRate.getWeaponChallengeRate(
                weaponWithHighestChallengeRate
            );
            const candidateWeaponChallengeRate = ChallengeRate.getWeaponChallengeRate(
                weapon
            );
            if (
                candidateWeaponChallengeRate > deadliestWeaponSoFarChallengeRate
            ) {
                return weapon;
            } else {
                return weaponWithHighestChallengeRate;
            }
        }, weapons[0]);
    }

    private getAttackWithDeadliestWeapon(
        actions: ActionsMap
    ): AttackAction | undefined {
        if (!this.deadliestWeapon) {
            return;
        }
        const deadliestWeapon = this.deadliestWeapon;
        return actions
            .getAttackActions()
            .find((action) => action.getWeapon().equals(deadliestWeapon));
    }

    private getReloadDeadliestWeapon(
        actions: ActionsMap
    ): ReloadAction | undefined {
        if (!this.deadliestWeapon) {
            return;
        }
        const deadliestWeapon = this.deadliestWeapon;
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
