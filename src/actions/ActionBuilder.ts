import ActionsMap from '../core/ActionsMap';
import Actor from '../core/Actor';
import Firearm from '../core/Firearm';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import AttackAction from './AttackAction';
import LootAction from './LootAction';
import ReloadAction from './ReloadAction';

class ActionBuilder {
    protected scene: Scene;
    protected actor: Actor;

    constructor({ scene, actor }: { scene: Scene; actor: Actor }) {
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

    protected buildAttackActions(): AttackAction[] {
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

    protected buildOponentAttackActions(oponent: Actor): AttackAction[] {
        const weapons = this.actor.getInventory().getWeapons();
        const attackActions = weapons.map((weapon) =>
            this.buildAttackAction(oponent, weapon)
        );
        return attackActions;
    }

    protected buildAttackAction(oponent: Actor, weapon: Weapon): AttackAction {
        return new AttackAction({
            scene: this.scene,
            actor: this.actor,
            oponent,
            weapon,
        });
    }

    protected buildReloadActions(): ReloadAction[] {
        const weapons = this.actor.getInventory().getWeapons();
        const firearms = weapons
            .filter((weapon) => !!weapon.getAmmunition())
            .map((weapon) => weapon as Firearm);
        const reloadActions = firearms.map((weapon) =>
            this.buildReloadAction(weapon)
        );
        return reloadActions;
    }

    protected buildReloadAction(firearm: Firearm): ReloadAction {
        return new ReloadAction({
            scene: this.scene,
            actor: this.actor,
            weapon: firearm,
        });
    }

    protected buildLootActions(): LootAction[] {
        const deadActors = this.scene.getDeadActors();
        const lootActions = deadActors.map((deadActor) =>
            this.buildLootAction(deadActor)
        );
        return lootActions;
    }

    protected buildLootAction(actor: NonPlayableActor): LootAction {
        return new LootAction({
            scene: this.scene,
            actor: this.actor,
            oponent: actor,
        });
    }
}

export default ActionBuilder;
