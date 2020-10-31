import NarrationsCatalogue from './NarrationsCatalogue';
import SceneTemplateResolver from '../templateSystem/SceneTemplateResolver';
import Narration from '../core/Narration';
import Scene from '../core/Scene';

describe('NarrationsCatalogue', () => {
    class MyNarrationsCatalogue extends NarrationsCatalogue {
        fetchNarrations(): Promise<Narration[]> {
            throw new Error('Method not implemented.');
        }
    }

    let scene: Scene;
    let narrationsCatalogue: NarrationsCatalogue;
    beforeEach(() => {
        scene = ({
            id: 'scene',
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
});
