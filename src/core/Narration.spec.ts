import Narration from './Narration';
import Scene from './Scene';

describe('Narration', () => {
    it('initializes without errors', () => {
        new Narration({ title: 'My narration' });
    });

    describe('getTitle', () => {
        it('returns the title', () => {
            const narration = new Narration({ title: 'My narration' });
            const title = narration.getTitle();
            expect(title).toEqual('My narration');
        });
    });

    describe('getCurrentScene | setCurrentScene', () => {
        let narration: Narration;
        beforeEach(() => {
            narration = new Narration({ title: 'My narration' });
        });

        it('returns undefined', () => {
            const currentScene = narration.getCurrentScene();
            expect(currentScene).toBeUndefined();
        });

        it('retunrs the scene just set', () => {
            const scene = ({ id: 'foo' } as unknown) as Scene;
            narration.setCurrentScene(scene);
            const returnedScene = narration.getCurrentScene();
            expect(returnedScene).toEqual(scene);
        });
    });

    describe('loadNextScene', () => {
        it('sets the current scene to the new one', () => {
            const scene = ({
                id: 'scene',
            } as unknown) as Scene;
            const narration = new Narration({ title: 'My narration' });
            narration.loadNextScene(scene);
            const returnedScene = narration.getCurrentScene();
            expect(returnedScene).toEqual(scene);
        });
    });
});
