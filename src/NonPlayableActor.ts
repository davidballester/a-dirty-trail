import Actor from './Actor';
import Action from './Action';

class NonPlayableActor extends Actor {
    private nextAction?: Action<any>;

    getNextAction(): Action<any> | undefined {
        return this.nextAction;
    }
}

export default NonPlayableActor;
