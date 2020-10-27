import Action from '../actions/Action';
import AdvanceAction from '../actions/AdvanceAction';
import AttackAction from '../actions/AttackAction';
import LootAction from '../actions/LootAction';
import ReloadAction from '../actions/ReloadAction';
import ScapeAction from '../actions/ScapeAction';

class ActionsMap {
    private innerMap: InnerMap;

    constructor({ actions }: { actions: Action<any>[] }) {
        this.innerMap = {};
        this.buildInnerMap(actions);
    }

    getActionsOfType(type: string): Action<any>[] {
        return this.innerMap[type] || [];
    }

    getAttackActions(): AttackAction[] {
        const attackActions = this.innerMap[AttackAction.TYPE] || [];
        return attackActions.map((action) => action as AttackAction);
    }

    getReloadActions(): ReloadAction[] {
        const reloadActions = this.innerMap[ReloadAction.TYPE] || [];
        return reloadActions.map((action) => action as ReloadAction);
    }

    getLootActions(): LootAction[] {
        const lootActions = this.innerMap[LootAction.TYPE] || [];
        return lootActions.map((action) => action as LootAction);
    }

    getAdvanceActions(): AdvanceAction[] {
        const advanceActions = this.innerMap[AdvanceAction.TYPE] || [];
        return advanceActions.map((action) => action as AdvanceAction);
    }

    getScapeAction(): ScapeAction | undefined {
        const scapeActions = this.innerMap[ScapeAction.TYPE] || [];
        return scapeActions[0];
    }

    addAction(action: Action<any>): void {
        const type = action.getType();
        let existingActionsOfType = this.innerMap[type];
        if (!existingActionsOfType) {
            existingActionsOfType = [];
            this.innerMap[type] = existingActionsOfType;
        }
        existingActionsOfType.push(action);
    }

    private buildInnerMap(actions: Action<any>[]) {
        actions.forEach((action) => {
            this.addAction(action);
        });
    }
}

interface InnerMap {
    [type: string]: Action<any>[];
}

export default ActionsMap;
