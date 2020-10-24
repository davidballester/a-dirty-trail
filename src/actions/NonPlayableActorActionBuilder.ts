import ActionsMap from '../core/ActionsMap';
import ActionBuilder from './ActionBuilder';
import AttackAction from './AttackAction';

class NonPlayableActorActionBuilder extends ActionBuilder {
    buildActions(): ActionsMap {
        const attackActions = this.buildAttackActions();
        const reloadActions = this.buildReloadActions();
        const actions = [...attackActions, ...reloadActions];
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
}

export default NonPlayableActorActionBuilder;
