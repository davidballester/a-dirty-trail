import Narration from '../../core/Narration';
import Scene from '../../core/Scene';

class Tutorial extends Narration {
    static readonly NAME = 'Tutorial';

    constructor() {
        super({ title: Tutorial.NAME });
    }

    initialize(): Promise<Scene> {
        throw new Error('Method not implemented.');
    }

    loadNextScene(scene: Scene): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default Tutorial;
