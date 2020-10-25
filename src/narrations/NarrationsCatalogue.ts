import Narration from '../core/Narration';
import Tutorial from './tutorial';

class NarrationsCatalogue {
    private narrationsByTitle: { [title: string]: () => Narration };

    constructor() {
        this.narrationsByTitle = {
            [Tutorial.NAME]: () => new Tutorial(),
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
}

export default NarrationsCatalogue;
