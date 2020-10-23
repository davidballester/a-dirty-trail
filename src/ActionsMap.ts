import Action from './Action';

class ActionsMap {
    private innerMap: InnerMap;

    constructor({ actions }: { actions: Action<any>[] }) {
        this.innerMap = {};
        this.buildInnerMap(actions);
    }

    getActionsOfType(type: string): Action<any>[] {
        return this.innerMap[type] || [];
    }

    addAction(action: Action<any>) {
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
