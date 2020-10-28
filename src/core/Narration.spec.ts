import Narration from './Narration';
import Scene from './Scene';
import SceneBuilder from '../narrationsScripting/SceneBuilder';
import SceneTemplate from '../narrationsScripting/SceneTemplate';
jest.mock('../narrationsScripting/SceneBuilder');

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

    describe('initialize', () => {
        let sceneTemplate: SceneTemplate;
        let scene: Scene;
        let sceneBuilderMock: jest.Mock;
        let narration: Narration;
        beforeEach(() => {
            sceneTemplate = ({
                id: 'scene-template',
            } as unknown) as SceneTemplate;
            scene = ({
                id: 'scene',
            } as unknown) as Scene;
            sceneBuilderMock = (SceneBuilder as unknown) as jest.Mock;
            sceneBuilderMock.mockReturnValue({
                build: jest.fn().mockReturnValue(scene),
            });
            narration = new Narration({ title: 'My narration' });
        });

        it('initializes a new scene builder', () => {
            narration.initialize(sceneTemplate);
            expect(sceneBuilderMock).toHaveBeenCalledWith({
                sceneTemplate,
                narration,
            });
        });

        it('returns the scene returned by the scene builder', () => {
            const returnedScene = narration.initialize(sceneTemplate);
            expect(returnedScene).toEqual(scene);
        });

        it('loads the scene returned by the scene builder', () => {
            narration.initialize(sceneTemplate);
            const loadedScene = narration.getCurrentScene();
            expect(loadedScene).toEqual(scene);
        });
    });
});
