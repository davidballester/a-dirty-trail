import ActionsMap from '../core/ActionsMap';
import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import AttackAction from './AttackAction';
import LootAction from './LootAction';
import ReloadAction from './ReloadAction';

class ActionBuilder {
    private scene: Scene;
    private actor: Actor;

    constructor({ scene, actor }: { scene: Scene; actor: Actor }) {
        if (!scene.containsActor(actor) || !actor.isAlive()) {
            throw new Error('invalid actor');
        }
        this.scene = scene;
        this.actor = actor;
    }

    buildActions(): ActionsMap {
        const attackActions = this.buildAttackActions();
        const reloadActions = this.buildReloadActions();
        const lootActions = this.buildLootActions();
        const sceneActions = this.scene.getActions();
        const actions = [
            ...attackActions,
            ...reloadActions,
            ...lootActions,
            ...sceneActions,
        ];
        const executableActions = actions.filter((action) =>
            action.canExecute()
        );
        return new ActionsMap({
            actions: executableActions,
        });
    }

    private buildAttackActions(): AttackAction[] {
        const aliveOponents = this.scene.getAliveActors();
        const attackActionsPerOponent = aliveOponents.map((oponent) =>
            this.buildOponentAttackActions(oponent)
        );
        const attackActions = attackActionsPerOponent.reduce(
            (allAttackActions, oponentAttackActions) => [
                ...allAttackActions,
                ...oponentAttackActions,
            ],
            []
        );
        return attackActions;
    }

    private buildOponentAttackActions(
        oponent: NonPlayableActor
    ): AttackAction[] {
        const weapons = this.actor.getInventory().getWeapons();
        const attackActions = weapons.map((weapon) =>
            this.buildAttackAction(oponent, weapon)
        );
        return attackActions;
    }

    private buildAttackAction(
        oponent: NonPlayableActor,
        weapon: Weapon
    ): AttackAction {
        return new AttackAction({
            scene: this.scene,
            actor: this.actor,
            oponent,
            weapon,
        });
    }

    private buildReloadActions(): ReloadAction[] {
        const weapons = this.actor.getInventory().getWeapons();
        const weaponsThatRequireAmmunition = weapons.filter(
            (weapon) => !!weapon.getAmmunition()
        );
        const reloadActions = weaponsThatRequireAmmunition.map((weapon) =>
            this.buildReloadAction(weapon)
        );
        return reloadActions;
    }

    private buildReloadAction(weapon: Weapon): ReloadAction {
        return new ReloadAction({
            scene: this.scene,
            actor: this.actor,
            weapon,
        });
    }

    private buildLootActions(): LootAction[] {
        const deadActors = this.scene.getDeadActors();
        const lootActions = deadActors.map((deadActor) =>
            this.buildLootAction(deadActor)
        );
        return lootActions;
    }

    private buildLootAction(actor: NonPlayableActor): LootAction {
        return new LootAction({
            scene: this.scene,
            actor: this.actor,
            oponent: actor,
        });
    }
}

export default ActionBuilder;
