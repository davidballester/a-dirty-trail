import Narration from './Narration';
import Scene from './Scene';

describe('Narration', () => {
    class CustomNarration extends Narration {
        loadNextScene(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        initialize(): Promise<Scene> {
            throw new Error('Method not implemented.');
        }
    }

    it('initializes without errors', () => {
        new CustomNarration({ title: 'My narration' });
    });

    describe('getTitle', () => {
        it('returns the title', () => {
            const narration = new CustomNarration({ title: 'My narration' });
            const title = narration.getTitle();
            expect(title).toEqual('My narration');
        });
    });

    describe('getCurrentScene | setCurrentScene', () => {
        let narration: Narration;
        beforeEach(() => {
            narration = new CustomNarration({ title: 'My narration' });
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
});
