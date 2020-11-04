import { when } from 'jest-when';
import Actor from '../core/Actor';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import SceneActionBuilder from './SceneActionBuilder';
import SceneTemplate, { SideEffectTemplate } from './SceneTemplate';
import SideEffectBuilder from './SideEffectBuilder';
import AdvanceAction from '../actions/AdvanceAction';
import SceneTemplateResolver from './SceneTemplateResolver';
jest.mock('./SideEffectBuilder');
jest.mock('../actions/AdvanceAction');
jest.mock('./SceneTemplateResolver');

describe(SceneActionBuilder.name, () => {
    let sceneActionBuilder: SceneActionBuilder;
    let sceneTemplate: SceneTemplate;
    let sideEffectTemplate: SideEffectTemplate;
    let actor: Actor;
    let scene: Scene;
    let narration: Narration;
    let resolvePlaceholders: jest.SpyInstance;
    let sceneTemplateResolver: SceneTemplateResolver;
    let nextScene: Scene;
    let fetchScene: jest.SpyInstance;
    beforeEach(() => {
        sideEffectTemplate = ('a side effect' as unknown) as SideEffectTemplate;
        sceneTemplate = ({
            title: 'Foo',
            metadata: {
                actions: {
                    'Change name': {
                        nextSceneTitle: 'bar.md',
                        sideEffect: sideEffectTemplate,
                    },
                    'Drink water': {
                        nextSceneTitle: 'baz.md',
                    },
                    'Try to find a well': {
                        check: {
                            skill: 'perception',
                            modifier: -0.1,
                            success: {
                                nextSceneTitle: 'qux.md',
                            },
                            failure: {
                                nextSceneTitle: 'quux.md',
                            },
                        },
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
        nextScene = ({
            id: 'next scene',
        } as unknown) as Scene;
        fetchScene = jest.fn().mockReturnValue(nextScene);
        sceneTemplateResolver = ({
            fetchScene,
        } as unknown) as SceneTemplateResolver;
        sceneActionBuilder = new SceneActionBuilder({
            sceneTemplateResolver,
            sceneTemplate,
            narration,
            resolvePlaceholders: (resolvePlaceholders as unknown) as (
                string: string
            ) => string,
            scene,
        });
    });

    describe('build', () => {
        let advanceActionMock: jest.Mock;
        let advanceAction: AdvanceAction;
        beforeEach(() => {
            advanceActionMock = (AdvanceAction as unknown) as jest.Mock;
            advanceAction = ({
                id: 'advance action',
            } as unknown) as AdvanceAction;
            advanceActionMock.mockReturnValue(advanceAction);
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

        it('creates a next scene decider that returns the result of fetching the next scene', async () => {
            sceneActionBuilder.build();
            const nextSceneDecider =
                advanceActionMock.mock.calls[0][0].nextSceneDecider;
            const response = await nextSceneDecider.call(sceneActionBuilder);
            expect(response).toEqual(nextScene);
        });

        it('returns an empy array if the metadata does not contain actions', () => {
            sceneTemplate.metadata.actions = undefined;
            const actions = sceneActionBuilder.build();
            expect(actions).toEqual([]);
        });

        describe('side effect', () => {
            let sideEffectBuilderMock: jest.Mock;
            let sideEffectBuild: jest.SpyInstance;
            beforeEach(() => {
                sideEffectBuilderMock = (SideEffectBuilder as unknown) as jest.Mock;
                sideEffectBuild = jest.fn();
                sideEffectBuilderMock.mockReturnValue({
                    build: sideEffectBuild,
                });
            });

            it('creates an advance action with side effect', () => {
                sceneActionBuilder.build();
                expect(advanceActionMock).toHaveBeenCalledWith({
                    actor,
                    narration,
                    scene,
                    name: 'Change name',
                    nextSceneDecider: expect.anything(),
                    sideEffect: expect.anything(),
                });
            });

            it('creates a next scene decider for the side effect advance action that returns the result of fetching the next scene', async () => {
                sceneActionBuilder.build();
                const nextSceneDecider =
                    advanceActionMock.mock.calls[0][0].nextSceneDecider;
                const response = await nextSceneDecider.call(
                    sceneActionBuilder
                );
                expect(response).toEqual(nextScene);
            });

            it('creates a side effect builder with the provided scene and the side effect template', async () => {
                sceneActionBuilder.build();
                const sideEffect =
                    advanceActionMock.mock.calls[0][0].sideEffect;
                await sideEffect.call(sceneActionBuilder, scene);
                expect(sideEffectBuilderMock).toHaveBeenCalledWith({
                    scene,
                    sideEffectTemplate,
                });
            });

            it('invokes the build method of the side effect builder', async () => {
                sceneActionBuilder.build();
                const sideEffect =
                    advanceActionMock.mock.calls[0][0].sideEffect;
                await sideEffect.call(sceneActionBuilder);
                expect(sideEffectBuild).toHaveBeenCalled();
            });
        });

        describe('check', () => {
            let rollSuccessWithModifier: jest.SpyInstance;
            let getSkill: jest.SpyInstance;
            let nextSceneDeciderScene: Scene;
            beforeEach(() => {
                rollSuccessWithModifier = jest.fn().mockReturnValue(true);
                getSkill = jest.fn().mockReturnValue({
                    rollSuccessWithModifier,
                });
                const player = ({
                    getSkill,
                } as unknown) as Actor;
                nextSceneDeciderScene = ({
                    getPlayer: jest.fn().mockReturnValue(player),
                } as unknown) as Scene;
                when(fetchScene)
                    .calledWith(expect.anything(), 'qux.md')
                    .mockReturnValue('successScene')
                    .calledWith(expect.anything(), 'quux.md')
                    .mockReturnValue('failureScene');
            });

            it('creates an advance action', () => {
                sceneActionBuilder.build();
                expect(advanceActionMock).toHaveBeenCalledWith(
                    expect.objectContaining({
                        actor,
                        narration,
                        scene,
                        name: 'Try to find a well',
                    })
                );
            });

            describe('execute', () => {
                let nextSceneDecider: any;
                beforeEach(() => {
                    sceneActionBuilder.build();
                    nextSceneDecider = advanceActionMock.mock.calls.find(
                        (args) => args[0].name === 'Try to find a well'
                    )[0].nextSceneDecider;
                });

                it('gets the skill specified by the template from the player', async () => {
                    await nextSceneDecider.call(
                        sceneActionBuilder,
                        nextSceneDeciderScene
                    );
                    expect(getSkill).toHaveBeenCalledWith('perception');
                });

                it('rolls the skill with the template modifier', async () => {
                    await nextSceneDecider.call(
                        sceneActionBuilder,
                        nextSceneDeciderScene
                    );
                    expect(rollSuccessWithModifier).toHaveBeenCalledWith(-0.1);
                });

                it('returns the successful scene if the check succeeds', async () => {
                    const nextScene = await nextSceneDecider.call(
                        sceneActionBuilder,
                        nextSceneDeciderScene
                    );
                    expect(nextScene).toEqual('successScene');
                });

                it('returns the failure scene if the check fails', async () => {
                    rollSuccessWithModifier.mockReturnValue(false);
                    const nextScene = await nextSceneDecider.call(
                        sceneActionBuilder,
                        nextSceneDeciderScene
                    );
                    expect(nextScene).toEqual('failureScene');
                });
            });
        });
    });
});
