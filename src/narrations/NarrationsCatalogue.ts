import Narration from '../core/Narration';
import SceneTemplate from '../templateSystem/SceneTemplate';
import tutorial from './tutorial';

class NarrationsCatalogue {
    private narrationsByTitle: { [title: string]: () => Narration };

    constructor() {
        this.narrationsByTitle = {
            Tutorial: () => this.buildNarration('Tutorial', tutorial),
        };
    }

    getNarrationTitles(): string[] {
        return Object.keys(this.narrationsByTitle);
    }

    getNarration(title: string): Narration {
        const narrationBuilder = this.narrationsByTitle[title];
        if (!narrationBuilder) {
            throw new Error('Unknown narration');
        }
        return narrationBuilder();
    }

    private buildNarration(
        title: string,
        sceneTemplate: SceneTemplate
    ): Narration {
        const narration = new Narration({
            title,
        });
        narration.initialize(sceneTemplate);
        return narration;
    }
}

export default NarrationsCatalogue;
