import NarrationsCatalogue from './NarrationsCatalogue';
import SceneTemplateResolver from '../templateSystem/SceneTemplateResolver';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import ActorBuilder from '../templateSystem/ActorBuilder';
import { NarrationTemplate } from '../templateSystem/NarrationTemplate';
jest.mock('../templateSystem/ActorBuilder');

describe('NarrationsCatalogue', () => {
    class MyNarrationsCatalogue extends NarrationsCatalogue {
        fetchNarrations(): Promise<Narration[]> {
            throw new Error('Method not implemented.');
        }
    }

    let scene: Scene;
    let narrationsCatalogue: NarrationsCatalogue;
    let setPlayer: jest.SpyInstance;
    beforeEach(() => {
        setPlayer = jest.fn();
        scene = ({
            id: 'scene',
            setPlayer,
        } as unknown) as Scene;
        const sceneTemplateResolver = ({
            fetchScene: jest.fn().mockReturnValue(scene),
        } as unknown) as SceneTemplateResolver;
        narrationsCatalogue = new MyNarrationsCatalogue({
            sceneTemplateResolver,
        });
    });

    describe('initializeNarration', () => {
        let narration: Narration;
        let setCurrentScene: jest.SpyInstance;
        beforeEach(() => {
            setCurrentScene = jest.fn();
            narration = ({
                setCurrentScene,
            } as unknown) as Narration;
        });

        it('sets the scene returned by the scene template resolver in the narration', async () => {
            await narrationsCatalogue.initializeNarration(narration);
            expect(setCurrentScene).toHaveBeenCalledWith(scene);
        });

        it('returns the narration', async () => {
            const returnedNarration = await narrationsCatalogue.initializeNarration(
                narration
            );
            expect(returnedNarration).toEqual(narration);
        });
    });

    describe('load', () => {
        let narration: Narration;
        beforeEach(async () => {
            const actorBuilderMock = (ActorBuilder as unknown) as jest.Mock;
            actorBuilderMock.mockReturnValue({
                build: jest.fn().mockReturnValue({ id: 'actor' }),
            });
            const narrationTemplate = ({
                title: 'The gunslinger',
                currentSceneTitle: 'The desert',
                actor: 'roland',
            } as unknown) as NarrationTemplate;
            narration = await narrationsCatalogue.loadNarration(
                narrationTemplate
            );
        });

        it('returns a narration with the template title', () => {
            expect(narration.getTitle()).toEqual('The gunslinger');
        });

        it('sets the current scene', () => {
            expect(narration.getCurrentScene()).toEqual(scene);
        });

        it('sets the actor in the scene to the result of the actor builder', () => {
            expect(setPlayer).toHaveBeenCalledWith({ id: 'actor' });
        });
    });
});
