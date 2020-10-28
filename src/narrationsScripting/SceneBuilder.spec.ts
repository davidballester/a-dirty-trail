import Actor from '../core/Actor';
import Narration from '../core/Narration';
import SceneBuilder from './SceneBuilder';
import SceneTemplate from './SceneTemplate';
import Scene from '../core/Scene';
import SceneActionBuilder from './SceneActionBuilder';
import AdvanceAction from '../actions/AdvanceAction';
import NonPlayableActorBuilder from './NonPlayableActorBuilder';
import NonPlayableActor from '../core/NonPlayableActor';
jest.mock('../core/Scene');
jest.mock('./SceneActionBuilder');
jest.mock('./NonPlayableActorBuilder');

describe(SceneBuilder.name, () => {
    let sceneBuilder: SceneBuilder;
    let narration: Narration;
    let player: Actor;
    let sceneTemplate: SceneTemplate;
    beforeEach(() => {
        narration = ({
            id: 'narration',
        } as unknown) as Narration;
        player = ({
            id: 'player',
            getName: jest.fn().mockReturnValue('Jane Doe'),
        } as unknown) as Actor;
        sceneTemplate = ({
            title: 'The misfortunes of {{playerName}}',
            setup: 'Setup for {{playerName}}',
            metadata: {
                actors: [],
                actions: [],
            },
        } as unknown) as SceneTemplate;
        sceneBuilder = new SceneBuilder({
            narration,
            player,
            sceneTemplate,
        });
    });

    describe('build', () => {
        let sceneMock: jest.Mock;
        let scene: Scene;
        let setActions: jest.SpyInstance;
        let sceneActionBuilderMock: jest.Mock;
        let actions: AdvanceAction[];
        let actors: NonPlayableActor[];
        let nonPlayableActorBuilderMock: jest.Mock;
        beforeEach(() => {
            setActions = jest.fn();
            scene = ({
                id: 'scene',
                setActions,
            } as unknown) as Scene;
            sceneMock = (Scene as unknown) as jest.Mock;
            sceneMock.mockReturnValue(scene);
            sceneActionBuilderMock = (SceneActionBuilder as unknown) as jest.Mock;
            actions = [({ id: 'action!' } as unknown) as AdvanceAction];
            sceneActionBuilderMock.mockReturnValue({
                build: jest.fn().mockReturnValue(actions),
            });
            actors = [
                ({
                    id: 'actor',
                } as unknown) as NonPlayableActor,
            ];
            nonPlayableActorBuilderMock = (NonPlayableActorBuilder as unknown) as jest.Mock;
            nonPlayableActorBuilderMock.mockReturnValue({
                build: jest.fn().mockReturnValue(actors),
            });
        });

        it('creates a actors builder', () => {
            sceneBuilder.build();
            expect(nonPlayableActorBuilderMock).toHaveBeenCalledWith({
                sceneTemplate,
            });
        });

        it('creates a new scene', () => {
            sceneBuilder.build();
            expect(sceneMock).toHaveBeenCalledWith({
                title: 'The misfortunes of Jane Doe',
                setup: 'Setup for Jane Doe',
                actors,
                player,
                actions: [],
            });
        });

        it('returns the scene', () => {
            const returnedScene = sceneBuilder.build();
            expect(returnedScene).toEqual(scene);
        });

        it('creates a scene action builder', () => {
            sceneBuilder.build();
            expect(sceneActionBuilderMock).toHaveBeenCalledWith({
                narration,
                scene,
                resolvePlaceholders: expect.anything(),
                sceneTemplate,
            });
        });

        it('sets the actions with the response of the scene action builder', () => {
            sceneBuilder.build();
            expect(setActions).toHaveBeenCalledWith(actions);
        });
    });
});
