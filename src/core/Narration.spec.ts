import Narration from './Narration';
import Scene from './Scene';
import NarrationTemplateBuilder from '../templateSystem/NarrationTemplateBuilder';
jest.mock('../templateSystem/NarrationTemplateBuilder');

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
        let scene: Scene;
        let executeSideEffect: jest.SpyInstance;
        beforeEach(() => {
            narration = new Narration({ title: 'My narration' });
            executeSideEffect = jest.fn();
            scene = ({
                id: 'foo',
                executeSideEffect,
            } as unknown) as Scene;
        });

        it('returns undefined', () => {
            const currentScene = narration.getCurrentScene();
            expect(currentScene).toBeUndefined();
        });

        it('returns the scene just set', () => {
            narration.setCurrentScene(scene);
            const returnedScene = narration.getCurrentScene();
            expect(returnedScene).toEqual(scene);
        });

        it('executes the side effect of the scene', () => {
            narration.setCurrentScene(scene);
            expect(executeSideEffect).toHaveBeenCalled();
        });

        it('executes the side effect just once', () => {
            narration.setCurrentScene(scene);
            narration.setCurrentScene(scene);
            expect(executeSideEffect).toHaveBeenCalledTimes(1);
        });
    });

    describe('loadNextScene', () => {
        let narration: Narration;
        let scene: Scene;
        let executeSideEffect: jest.SpyInstance;
        beforeEach(() => {
            narration = new Narration({ title: 'My narration' });
            executeSideEffect = jest.fn();
            scene = ({
                id: 'foo',
                executeSideEffect,
            } as unknown) as Scene;
        });

        it('sets the current scene to the new one', () => {
            narration.loadNextScene(scene);
            const returnedScene = narration.getCurrentScene();
            expect(returnedScene).toEqual(scene);
        });

        it('executes the side effect of the scene', () => {
            narration.loadNextScene(scene);
            expect(executeSideEffect).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        let narrationTemplateBuilderMock: jest.Mock;
        let build: jest.SpyInstance;
        let isCombat: jest.SpyInstance;
        let narration: Narration;

        beforeEach(() => {
            narrationTemplateBuilderMock = (NarrationTemplateBuilder as unknown) as jest.Mock;
            build = jest.fn().mockReturnValue({ id: 'narration-template' });
            narrationTemplateBuilderMock.mockReturnValue({
                build,
            });
            isCombat = jest.fn().mockReturnValue(false);
            const scene = ({
                isCombat,
                executeSideEffect: jest.fn(),
            } as unknown) as Scene;
            narration = new Narration({ title: 'My narration' });
            narration.setCurrentScene(scene);
        });

        it('returns undefined if there is no current scene', () => {
            const narration = new Narration({ title: 'My narration' });
            const narrationTemplate = narration.save();
            expect(narrationTemplate).toBeUndefined();
        });

        it('returns undefined if the current scene is a combat', () => {
            isCombat.mockReturnValue(true);
            const narrationTemplate = narration.save();
            expect(narrationTemplate).toBeUndefined();
        });

        it('creates a narration template builder mock with the narration', () => {
            narration.save();
            expect(narrationTemplateBuilderMock).toHaveBeenCalledWith({
                narration,
            });
        });

        it('returns the result of the build method', () => {
            const response = narration.save();
            expect(response).toEqual({ id: 'narration-template' });
        });
    });
});
