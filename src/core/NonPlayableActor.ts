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
    private nextAction?: Action<any>;
    private deadliestWeapon?: Weapon;

    getNextAction(scene: Scene): Action<any> {
        if (!this.nextAction) {
            this.buildNextAction(scene);
        }
        return this.nextAction!;
    }

    private buildNextAction(scene: Scene) {
        const actionBuilder = new NonPlayableActorActionBuilder({
            scene,
            actor: this,
        });
        const actions = actionBuilder.buildActions();
        if (!this.deadliestWeapon) {
            this.deadliestWeapon = this.getDeadliestWeapon();
        }
        this.nextAction = this.getAttackWithDeadliestWeapon(actions);
        if (!!this.nextAction) {
            return;
        }
        this.nextAction = this.getReloadDeadliestWeapon(actions);
        if (!!this.nextAction) {
            return;
        }
        this.nextAction = this.getOtherAttack(actions);
        if (!!this.nextAction) {
            return;
        }
        this.nextAction = actions.getScapeAction();
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
        return actions
            .getAttackActions()
            .find((action) => action.getWeapon().equals(this.deadliestWeapon!));
    }

    private getReloadDeadliestWeapon(
        actions: ActionsMap
    ): ReloadAction | undefined {
        if (!this.deadliestWeapon) {
            return;
        }
        return actions
            .getReloadActions()
            .find((action) => action.getWeapon().equals(this.deadliestWeapon!));
    }

    private getOtherAttack(actions: ActionsMap): AttackAction | undefined {
        const attackActions = actions.getAttackActions();
        return attackActions[0];
    }
}

export default NonPlayableActor;
