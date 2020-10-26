import Narration from '../../../../core/Narration';
import StageCoachActBuilder from './StageCoachActBuilder';

describe(StageCoachActBuilder.name, () => {
    let narration: Narration;
    let loadNextScene: jest.SpyInstance;
    beforeEach(() => {
        loadNextScene = jest.fn();
        narration = ({
            loadNextScene,
        } as unknown) as Narration;
    });

    it('initializes without failing', () => {
        new StageCoachActBuilder({ narration });
    });
});
