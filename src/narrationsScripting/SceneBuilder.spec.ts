import Actor from '../core/Actor';
import Narration from '../core/Narration';
import SceneBuilder from './SceneBuilder';
import SceneTemplate, { ActorTemplate } from './SceneTemplate';
import Scene from '../core/Scene';
import SceneActionBuilder from './SceneActionBuilder';
import AdvanceAction from '../actions/AdvanceAction';
import NonPlayableActorBuilder from './NonPlayableActorBuilder';
import ActorBuilder from './ActorBuilder';
import NonPlayableActor from '../core/NonPlayableActor';
jest.mock('../core/Scene');
jest.mock('./SceneActionBuilder');
jest.mock('./NonPlayableActorBuilder');
jest.mock('./ActorBuilder');

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
    });

    it('throws if neither a player nor an actor template is provided', () => {
        expect(
            () =>
                new SceneBuilder({
                    narration,
                    sceneTemplate,
                })
        ).toThrow();
    });

    describe('player building', () => {
        let actorBuilder: jest.Mock;
        let actorTemplate: ActorTemplate;
        beforeEach(() => {
            actorTemplate = ({
                id: 'player-template',
            } as unknown) as ActorTemplate;
            sceneTemplate = ({
                title: 'The misfortunes of {{playerName}}',
                setup: 'Setup for {{playerName}}',
                metadata: {
                    player: actorTemplate,
                    actors: [],
                    actions: [],
                },
            } as unknown) as SceneTemplate;
            actorBuilder = (ActorBuilder as unknown) as jest.Mock;
            actorBuilder.mockReturnValue({
                build: jest.fn().mockReturnValue(player),
            });
        });

        it('calls the actor builder with the player template', () => {
            new SceneBuilder({
                narration,
                sceneTemplate,
            });
            expect(actorBuilder).toHaveBeenCalledWith({ actorTemplate });
        });

        it('does not call it if a player is provided', () => {
            new SceneBuilder({
                narration,
                sceneTemplate,
                player,
            });
            expect(actorBuilder).not.toHaveBeenCalled();
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
            sceneTemplate = ({
                setup: 'Setup for {{playerName}}',
                metadata: {
                    title: 'The misfortunes of {{playerName}}',
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

        it('creates an actor builder', () => {
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

        it('creates a new scene if it has to build the player too', () => {
            const actorTemplate = ({
                id: 'player-template',
            } as unknown) as ActorTemplate;
            sceneTemplate = ({
                setup: 'Setup for {{playerName}}',
                metadata: {
                    title: 'The misfortunes of {{playerName}}',
                    player: actorTemplate,
                    actors: [],
                    actions: [],
                },
            } as unknown) as SceneTemplate;
            const actorBuilder = (ActorBuilder as unknown) as jest.Mock;
            actorBuilder.mockReturnValue({
                build: jest.fn().mockReturnValue(player),
            });
            sceneBuilder = new SceneBuilder({
                narration,
                sceneTemplate,
            });

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
