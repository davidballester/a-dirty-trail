import { when } from 'jest-when';
import Actor from '../core/Actor';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import SceneActionBuilder from './SceneActionBuilder';
import { SceneTemplate } from './SceneTemplate';
import { SideEffectTemplate } from './SideEffectTemplate';
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
    let hasFlag: jest.SpyInstance;
    let getFlag: jest.SpyInstance;
    let scene: Scene;
    let narration: Narration;
    let resolvePlaceholders: jest.SpyInstance;
    let sceneTemplateResolver: SceneTemplateResolver;
    let nextScene: Scene;
    let fetchScene: jest.SpyInstance;
    let hasTrinket: jest.SpyInstance;
    beforeEach(() => {
        sideEffectTemplate = ('a side effect' as unknown) as SideEffectTemplate;
        sceneTemplate = ({
            title: 'Foo',
            metadata: {
                actions: {
                    'Change name': {
                        nextSceneId: 'bar.md',
                        sideEffect: sideEffectTemplate,
                    },
                    'Drink water': {
                        nextSceneId: 'baz.md',
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
        hasTrinket = jest.fn();
        when(hasTrinket)
            .mockReturnValue(false)
            .calledWith('watch')
            .mockReturnValue(true);
        hasFlag = jest.fn();
        getFlag = jest.fn();
        actor = ({
            id: 'actor',
            getFlags: jest.fn().mockReturnValue({
                hasFlag,
                getFlag,
            }),
            getInventory: jest.fn().mockReturnValue({
                hasTrinket,
            }),
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
            let rollSkill: jest.SpyInstance;
            let nextSceneDeciderScene: Scene;
            beforeEach(() => {
                rollSkill = jest.fn().mockReturnValue(true);
                const player = ({
                    rollSkill,
                } as unknown) as Actor;
                nextSceneDeciderScene = ({
                    getPlayer: jest.fn().mockReturnValue(player),
                } as unknown) as Scene;
                when(fetchScene)
                    .calledWith(expect.anything(), 'qux.md')
                    .mockReturnValue('successScene')
                    .calledWith(expect.anything(), 'quux.md')
                    .mockReturnValue('failureScene');
                sceneTemplate = ({
                    title: 'Foo',
                    metadata: {
                        actions: {
                            'Try to find a well': {
                                check: {
                                    skill: 'perception',
                                    modifier: -0.1,
                                    success: {
                                        nextSceneId: 'qux.md',
                                    },
                                    failure: {
                                        nextSceneId: 'quux.md',
                                    },
                                },
                            },
                        },
                    },
                } as unknown) as SceneTemplate;
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

                it('rolls the skill with the template modifier', async () => {
                    await nextSceneDecider.call(
                        sceneActionBuilder,
                        nextSceneDeciderScene
                    );
                    expect(rollSkill).toHaveBeenCalledWith('perception', -0.1);
                });

                it('returns the successful scene if the check succeeds', async () => {
                    const nextScene = await nextSceneDecider.call(
                        sceneActionBuilder,
                        nextSceneDeciderScene
                    );
                    expect(nextScene).toEqual('successScene');
                });

                it('returns the failure scene if the check fails', async () => {
                    rollSkill.mockReturnValue(false);
                    const nextScene = await nextSceneDecider.call(
                        sceneActionBuilder,
                        nextSceneDeciderScene
                    );
                    expect(nextScene).toEqual('failureScene');
                });
            });
        });

        describe('condition', () => {
            describe('trinkets', () => {
                beforeEach(() => {
                    sceneTemplate = ({
                        title: 'Foo',
                        metadata: {
                            actions: {
                                'Try to find a well': {
                                    check: {
                                        skill: 'perception',
                                        modifier: -0.1,
                                        success: {
                                            nextSceneId: 'qux.md',
                                        },
                                        failure: {
                                            nextSceneId: 'quux.md',
                                        },
                                    },
                                },
                                'Give the watch': {
                                    condition: {
                                        hasTrinket: 'watch',
                                    },
                                    nextSceneId: 'corge.md',
                                },
                                'Give the matches': {
                                    condition: {
                                        hasTrinket: 'matches',
                                    },
                                    nextSceneId: 'graulpy.md',
                                },
                                '"Sorry, I have no watch"': {
                                    condition: {
                                        doesNotHaveTrinket: 'watch',
                                    },
                                    nextSceneId: 'grault.md',
                                },
                                '"Sorry, I have no matches"': {
                                    condition: {
                                        doesNotHaveTrinket: 'matches',
                                    },
                                    nextSceneId: 'grault.md',
                                },
                                'Work something out': {
                                    condition: {
                                        doesNotHaveTrinket: 'matches',
                                        hasTrinket: 'watch',
                                    },
                                    nextSceneId: 'grault.md',
                                },
                            },
                        },
                    } as unknown) as SceneTemplate;
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

                it('creates the action that requires of a trinket the player has', () => {
                    sceneActionBuilder.build();
                    expect(advanceActionMock).toHaveBeenCalledWith(
                        expect.objectContaining({
                            actor,
                            narration,
                            scene,
                            name: 'Give the watch',
                        })
                    );
                });

                it('creates the action that requires not having a trinket the player does not have', () => {
                    sceneActionBuilder.build();
                    expect(advanceActionMock).toHaveBeenCalledWith(
                        expect.objectContaining({
                            actor,
                            narration,
                            scene,
                            name: '"Sorry, I have no matches"',
                        })
                    );
                });

                it('does not create the action that requires of not having a trinket the player has', () => {
                    sceneActionBuilder.build();
                    expect(advanceActionMock).not.toHaveBeenCalledWith(
                        expect.objectContaining({
                            actor,
                            narration,
                            scene,
                            name: '"Sorry, I have no watch"',
                        })
                    );
                });

                it('does not create the action that requires of a trinket the player does not have', () => {
                    sceneActionBuilder.build();
                    expect(advanceActionMock).not.toHaveBeenCalledWith(
                        expect.objectContaining({
                            actor,
                            narration,
                            scene,
                            name: 'Give the matches',
                        })
                    );
                });

                it('creates an action that requires a trinket the player has and not having a trinket the player does not have', () => {
                    sceneActionBuilder.build();
                    expect(advanceActionMock).toHaveBeenCalledWith(
                        expect.objectContaining({
                            actor,
                            narration,
                            scene,
                            name: 'Work something out',
                        })
                    );
                });
            });

            describe('flags', () => {
                describe('boolean conditions', () => {
                    beforeEach(() => {
                        sceneTemplate = ({
                            title: 'Foo',
                            metadata: {
                                actions: {
                                    Lie: {
                                        condition: {
                                            hasFlag: 'liar',
                                        },
                                        nextSceneId: 'corge.md',
                                    },
                                    'Lie a lot': {
                                        condition: {
                                            hasFlags: ['liar', 'comedian'],
                                        },
                                        nextSceneId: 'graulpy.md',
                                    },
                                    'Tell the truth': {
                                        condition: {
                                            hasNotFlag: 'liar',
                                        },
                                        nextSceneId: 'corge.md',
                                    },
                                    'Tell the truth seriously': {
                                        condition: {
                                            hasNotFlags: ['liar', 'comedian'],
                                        },
                                        nextSceneId: 'corge.md',
                                    },
                                },
                            },
                        } as unknown) as SceneTemplate;
                        when(hasFlag)
                            .mockReturnValue(false)
                            .calledWith('liar')
                            .mockReturnValue(true);
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

                    it('creates the action that requires a flag the player has', () => {
                        sceneActionBuilder.build();
                        expect(advanceActionMock).toHaveBeenCalledWith(
                            expect.objectContaining({
                                actor,
                                narration,
                                scene,
                                name: 'Lie',
                            })
                        );
                    });

                    it('does not create the action that requires a flag the player does not have', () => {
                        sceneActionBuilder.build();
                        expect(advanceActionMock).not.toHaveBeenCalledWith(
                            expect.objectContaining({
                                actor,
                                narration,
                                scene,
                                name: 'Lie a lot',
                            })
                        );
                    });

                    it('creates the action that requires not having a flag the player does not have', () => {
                        when(hasFlag).calledWith('liar').mockReturnValue(false);
                        sceneActionBuilder.build();
                        expect(advanceActionMock).toHaveBeenCalledWith(
                            expect.objectContaining({
                                actor,
                                narration,
                                scene,
                                name: 'Tell the truth seriously',
                            })
                        );
                    });

                    it('does not create the action if the player has a flag that is required not to have', () => {
                        sceneActionBuilder.build();
                        expect(advanceActionMock).not.toHaveBeenCalledWith(
                            expect.objectContaining({
                                actor,
                                narration,
                                scene,
                                name: 'Tell the truth',
                            })
                        );
                    });
                });

                describe('numeric conditions', () => {
                    beforeEach(() => {
                        sceneTemplate = ({
                            title: 'Foo',
                            metadata: {
                                actions: {
                                    Foo: {
                                        condition: {
                                            flagIsGreaterThan: {
                                                name: 'strength',
                                                value: 5,
                                            },
                                            flagsAreGreaterThan: [
                                                {
                                                    name: 'charisma',
                                                    value: 5,
                                                },
                                            ],
                                            flagIsLowerThan: {
                                                name: 'dexterity',
                                                value: 5,
                                            },
                                            flagsAreLowerThan: [
                                                {
                                                    name: 'perception',
                                                    value: 5,
                                                },
                                            ],
                                            flagIsEqualTo: {
                                                name: 'wisdom',
                                                value: 5,
                                            },
                                            flagsAreEqualTo: [
                                                {
                                                    name: 'intelligence',
                                                    value: 5,
                                                },
                                            ],
                                            flagIsDifferentTo: {
                                                name: 'stealth',
                                                value: 5,
                                            },
                                            flagsAreDifferentTo: [
                                                {
                                                    name: 'prowess',
                                                    value: 5,
                                                },
                                            ],
                                        },
                                        nextSceneId: 'corge.md',
                                    },
                                },
                            },
                        } as unknown) as SceneTemplate;
                        when(getFlag)
                            .mockReturnValue(0)
                            .calledWith('strength')
                            .mockReturnValue(7)
                            .calledWith('charisma')
                            .mockReturnValue(7)
                            .calledWith('dexterity')
                            .mockReturnValue(3)
                            .calledWith('perception')
                            .mockReturnValue(3)
                            .calledWith('wisdom')
                            .mockReturnValue(5)
                            .calledWith('intelligence')
                            .mockReturnValue(5)
                            .calledWith('stealth')
                            .mockReturnValue(10)
                            .calledWith('prowess')
                            .mockReturnValue(10);
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

                    it('creates the action when all conditions are met', () => {
                        sceneActionBuilder.build();
                        expect(advanceActionMock).toHaveBeenCalledWith(
                            expect.objectContaining({
                                name: 'Foo',
                            })
                        );
                    });

                    it('does not create the action when an equal condition fails', () => {
                        when(getFlag).calledWith('wisdom').mockReturnValue(6);
                        sceneActionBuilder.build();
                        expect(advanceActionMock).not.toHaveBeenCalledWith(
                            expect.objectContaining({
                                name: 'Foo',
                            })
                        );
                    });

                    it('does not create the action when a greater than condition fails', () => {
                        when(getFlag).calledWith('charisma').mockReturnValue(4);
                        sceneActionBuilder.build();
                        expect(advanceActionMock).not.toHaveBeenCalledWith(
                            expect.objectContaining({
                                name: 'Foo',
                            })
                        );
                    });

                    it('does not create the action when a lower than condition fails', () => {
                        when(getFlag)
                            .calledWith('dexterity')
                            .mockReturnValue(4);
                        sceneActionBuilder.build();
                        expect(advanceActionMock).not.toHaveBeenCalledWith(
                            expect.objectContaining({
                                name: 'Foo',
                            })
                        );
                    });

                    it('does not create the action when a diferent to condition fails', () => {
                        when(getFlag).calledWith('prowess').mockReturnValue(5);
                        sceneActionBuilder.build();
                        expect(advanceActionMock).not.toHaveBeenCalledWith(
                            expect.objectContaining({
                                name: 'Foo',
                            })
                        );
                    });
                });
            });
        });
    });
});
