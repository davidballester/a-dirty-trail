import ActionsMap from '../core/ActionsMap';
import NonPlayableActor from '../core/NonPlayableActor';
import ActionBuilder from './ActionBuilder';
import AttackAction from './AttackAction';
import ScapeAction from './ScapeAction';

class NonPlayableActorActionBuilder extends ActionBuilder {
    buildActions(): ActionsMap {
        const attackActions = this.buildAttackActions();
        const reloadActions = this.buildReloadActions();
        const scapeAction = this.buildScapeAction();
        const actions = [...attackActions, ...reloadActions, scapeAction];
        const executableActions = actions.filter((action) =>
            action.canExecute()
        );
        return new ActionsMap({
            actions: executableActions,
        });
    }

    protected buildAttackActions(): AttackAction[] {
        const player = this.scene.getPlayer();
        return this.buildOponentAttackActions(player!);
    }

    private buildScapeAction(): ScapeAction {
        return new ScapeAction({
            actor: this.actor as NonPlayableActor,
            scene: this.scene,
        });
    }
}

export default NonPlayableActorActionBuilder;
