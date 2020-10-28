import Actor from '../core/Actor';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import SceneActionBuilder from './SceneActionBuilder';
import SceneTemplate from './SceneTemplate';
import SideEffectBuilder from './SideEffectBuilder';
import AdvanceAction from '../actions/AdvanceAction';
import AdvanceActionWithSideEffect from '../actions/AdvanceActionWithSideEffect';
import NextSceneDeciderBuilder from './NextSceneDeciderBuilder';
jest.mock('./SideEffectBuilder');
jest.mock('../actions/AdvanceAction');
jest.mock('../actions/AdvanceActionWithSideEffect');
jest.mock('./NextSceneDeciderBuilder');

describe(SceneActionBuilder.name, () => {
    let sceneActionBuilder: SceneActionBuilder;
    let sceneTemplate: SceneTemplate;
    let actor: Actor;
    let scene: Scene;
    let narration: Narration;
    let resolvePlaceholders: jest.SpyInstance;
    beforeEach(() => {
        sceneTemplate = ({
            modulePath: './foo.ts',
            metadata: {
                actions: {
                    'Change name': {
                        goTo: './bar.ts',
                        sideEffect: 'a side effect',
                    },
                    'Drink water': {
                        goTo: './baz.ts',
                    },
                },
            },
        } as unknown) as SceneTemplate;
        narration = ({
            id: 'narration',
        } as unknown) as Narration;
        resolvePlaceholders = jest
            .fn()
            .mockImplementation((source: string) => source);
        actor = ({
            id: 'actor',
        } as unknown) as Actor;
        const getPlayer = jest.fn().mockReturnValue(actor);
        scene = ({
            getPlayer,
        } as unknown) as Scene;
        sceneActionBuilder = new SceneActionBuilder({
            sceneTemplate,
            narration,
            resolvePlaceholders: (resolvePlaceholders as unknown) as (
                string: string
            ) => string,
            scene,
        });
    });

    it('throws if the scene template does not have a module path', () => {
        expect(
            () =>
                new SceneActionBuilder({
                    sceneTemplate: ({} as unknown) as SceneTemplate,
                    narration,
                    resolvePlaceholders: (resolvePlaceholders as unknown) as (
                        string: string
                    ) => string,
                    scene,
                })
        ).toThrow();
    });

    describe('build', () => {
        let sideEffectBuilderMock: jest.Mock;
        let advanceActionMock: jest.Mock;
        let advanceActionWithSideEffectMock: jest.Mock;
        let nextSceneDeciderBuilderMock: jest.Mock;
        let advanceAction: AdvanceAction;
        let advanceActionWithSideEffect: AdvanceActionWithSideEffect;
        beforeEach(() => {
            sideEffectBuilderMock = (SideEffectBuilder as unknown) as jest.Mock;
            advanceActionMock = (AdvanceAction as unknown) as jest.Mock;
            advanceActionWithSideEffectMock = (AdvanceActionWithSideEffect as unknown) as jest.Mock;
            nextSceneDeciderBuilderMock = (NextSceneDeciderBuilder as unknown) as jest.Mock;
            advanceAction = ({
                id: 'advance action',
            } as unknown) as AdvanceAction;
            advanceActionWithSideEffect = ({
                id: 'advance action with side effect',
            } as unknown) as AdvanceActionWithSideEffect;
            advanceActionMock.mockReturnValue(advanceAction);
            advanceActionWithSideEffectMock.mockReturnValue(
                advanceActionWithSideEffect
            );
            nextSceneDeciderBuilderMock.mockReturnValue({
                build: jest.fn(),
            });
            sideEffectBuilderMock.mockReturnValue({
                build: jest.fn(),
            });
        });

        it('creates an advance action', () => {
            sceneActionBuilder.build();
            expect(advanceActionMock).toHaveBeenCalledWith({
                actor,
                narration,
                scene,
                name: 'Drink water',
                nextSceneDecider: expect.anything(),
            });
        });

        it('returns the advance action', () => {
            const actions = sceneActionBuilder.build();
            expect(actions).toContain(advanceAction);
        });

        it('creates an advance action with side effect', () => {
            sceneActionBuilder.build();
            expect(advanceActionWithSideEffectMock).toHaveBeenCalledWith({
                actor,
                narration,
                scene,
                name: 'Change name',
                nextSceneDecider: expect.anything(),
                sideEffect: expect.anything(),
            });
        });

        it('returns the advance action with side effect', () => {
            const actions = sceneActionBuilder.build();
            expect(actions).toContain(advanceActionWithSideEffect);
        });
    });
});
