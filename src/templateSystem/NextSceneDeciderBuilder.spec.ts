import Actor from '../core/Actor';
import Narration from '../core/Narration';
import NextSceneDeciderBuilder from './NextSceneDeciderBuilder';
import SceneBuilder from './SceneBuilder';
jest.mock('./SceneBuilder');

describe(NextSceneDeciderBuilder.name, () => {
    let baseSceneTemplatePath: string;
    let nextSceneRelativePath: string;
    let nextSceneDeciderBuilder: NextSceneDeciderBuilder;
    let sceneBuilderMock: jest.Mock;
    let sceneBuilderBuild: jest.SpyInstance;
    let narration: Narration;
    let player: Actor;
    beforeEach(() => {
        baseSceneTemplatePath = './__testsAssets__/firstAct/foo.ts';
        nextSceneRelativePath = './bar.ts';
        narration = ({
            id: 'narration',
        } as unknown) as Narration;
        player = ({
            id: 'player',
        } as unknown) as Actor;
        sceneBuilderMock = (SceneBuilder as unknown) as jest.Mock;
        sceneBuilderBuild = jest.fn();
        sceneBuilderMock.mockImplementation(() => ({
            build: sceneBuilderBuild,
        }));
        nextSceneDeciderBuilder = new NextSceneDeciderBuilder({
            narration,
            baseSceneTemplatePath,
            nextSceneRelativePath,
            player,
        });
    });

    describe('build', () => {
        it('instantiates a new scene builder with the template of the next scene', async () => {
            await nextSceneDeciderBuilder.build();
            expect(sceneBuilderMock).toHaveBeenCalledWith({
                narration,
                player,
                sceneTemplate: {
                    modulePath: './__testsAssets__/firstAct/./bar.ts',
                    setup: 'Bar!',
                },
            });
        });

        it('returns the result of the scene builder', async () => {
            const scene = { id: 'scene' };
            sceneBuilderBuild.mockReturnValue(scene);
            const returnedScene = await nextSceneDeciderBuilder.build();
            expect(returnedScene).toEqual(scene);
        });

        describe('complex paths', () => {
            beforeEach(() => {
                nextSceneRelativePath = '../secondAct/baz.ts';
                nextSceneDeciderBuilder = new NextSceneDeciderBuilder({
                    narration,
                    baseSceneTemplatePath,
                    nextSceneRelativePath,
                    player,
                });
            });

            it('instantiates a new scene builder with the template of the next scene', async () => {
                await nextSceneDeciderBuilder.build();
                expect(sceneBuilderMock).toHaveBeenCalledWith({
                    narration,
                    player,
                    sceneTemplate: {
                        modulePath:
                            './__testsAssets__/firstAct/../secondAct/baz.ts',
                        setup: 'Baz!',
                    },
                });
            });
        });
    });
});
