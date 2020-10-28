import Narration from '../../core/Narration';
import Scene from '../../core/Scene';
import StageCoachActBuilder from './acts/1-stage-coach/StageCoachActBuilder';
import AlysBuilder from './AlysBuilder';

class Tutorial extends Narration {
    static readonly NAME = 'Tutorial';

    constructor() {
        super({ title: Tutorial.NAME });
    }

    initialize(): Promise<Scene> {
        const stageCoachActBuilder = new StageCoachActBuilder({
            narration: this,
        });
        const alysBuilder = new AlysBuilder();
        const alys = alysBuilder.getAlys();
        return Promise.resolve(stageCoachActBuilder.build(alys));
    }
}

export default Tutorial;
