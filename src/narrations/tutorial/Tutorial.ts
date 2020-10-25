import Narration from '../../core/Narration';
import Scene from '../../core/Scene';

class Tutorial extends Narration {
    static readonly NAME = 'Tutorial';

    constructor() {
        super({ title: Tutorial.NAME });
    }

    loadNextScene(scene: Scene): void {
        throw new Error('Method not implemented.');
    }
}

export default Tutorial;
