import Action from '../actions/Action';
import AttackAction from '../actions/AttackAction';
import NonPlayableActorActionBuilder from '../actions/NonPlayableActorActionBuilder';
import ReloadAction from '../actions/ReloadAction';
import ActionsMap from './ActionsMap';
import Actor from './Actor';
import ChallengeRate from './ChallengeRate';
import Scene from './Scene';
import Weapon from './Weapon';

class NonPlayableActor extends Actor {
    private deadliestWeapon?: Weapon;

    getNextAction(scene: Scene): Action<any> | undefined {
        const actionBuilder = new NonPlayableActorActionBuilder({
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

export default NonPlayableActor;
