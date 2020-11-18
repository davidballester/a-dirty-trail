import SceneTemplateResolver from './SceneTemplateResolver';
import { SceneTemplate } from './SceneTemplate';
import parseMarkdown from 'markdown-yaml-metadata-parser';
import SceneBuilder from './SceneBuilder';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
import SceneTemplateEvaluator from './SceneTemplateEvaluator';
jest.mock('markdown-yaml-metadata-parser');
jest.mock('./SceneBuilder');
jest.mock('./SceneTemplateEvaluator');

describe(SceneTemplateResolver.name, () => {
    class CustomSceneTemplateResolver extends SceneTemplateResolver {
        protected fetchMarkdownSceneTemplate(): Promise<string> {
            return Promise.resolve('# Hello, world!');
        }
    }

    let narration: Narration;
    let sceneId: string;
    let parseMarkdownMock: jest.SpyInstance;
    let sceneTemplate: SceneTemplate;
    let player: Actor;
    let sceneBuilderMock: jest.Mock;
    let buildScene: jest.SpyInstance;
    let scene: Scene;
    let sceneTemplateResolver: SceneTemplateResolver;
    beforeEach(() => {
        const sceneTemplateEvaluatorMock = (SceneTemplateEvaluator as unknown) as jest.Mock;
        sceneTemplateEvaluatorMock.mockImplementation(({ template }) => ({
            evaluate: jest.fn().mockReturnValue(template),
        }));

        player = ({
            id: 'player',
        } as unknown) as Actor;
        narration = ({
            getTitle: jest.fn().mockReturnValue('narration'),
            getCurrentScene: jest.fn().mockReturnValue({
                getPlayer: jest.fn().mockReturnValue(player),
            }),
        } as unknown) as Narration;
        parseMarkdownMock = (parseMarkdown as unknown) as jest.Mock;
        sceneTemplate = ({
            setup: 'scene template content',
            metadata: 'scene template metadata',
        } as unknown) as SceneTemplate;
        parseMarkdownMock.mockReturnValue({
            content: sceneTemplate.setup,
            metadata: sceneTemplate.metadata,
        });
        sceneBuilderMock = (SceneBuilder as unknown) as jest.Mock;
        scene = ({
            id: 'scene',
        } as unknown) as Scene;
        buildScene = jest.fn().mockReturnValue(scene);
        sceneBuilderMock.mockReturnValue({
            build: buildScene,
        });

        sceneTemplateResolver = new CustomSceneTemplateResolver();
    });

    describe('fetchScene', () => {
        it('returns the scene', async () => {
            const returnedScene = await sceneTemplateResolver.fetchScene(
                narration,
                sceneId
            );
            expect(returnedScene).toEqual(scene);
        });

        it('parses the markdown returned by the fetch operation', async () => {
            await sceneTemplateResolver.fetchScene(narration, sceneId);
            expect(parseMarkdownMock).toHaveBeenCalledWith('# Hello, world!');
        });

        it('instantiates a scene builder', async () => {
            await sceneTemplateResolver.fetchScene(narration, sceneId);
            expect(sceneBuilderMock).toHaveBeenCalledWith({
                sceneTemplateResolver: sceneTemplateResolver,
                sceneTemplate,
                narration,
                player,
            });
        });
    });
});
