import Tutorial from './Tutorial';
import StageCoachActBuilder from './acts/1-stage-coach/StageCoachActBuilder';
import AlysBuilder from './AlysBuilder';
import Actor from '../../core/Actor';
import Scene from '../../core/Scene';
jest.mock('./acts/1-stage-coach/StageCoachActBuilder');
jest.mock('./AlysBuilder');

describe(Tutorial.name, () => {
    it('initializes without errors', () => {
        new Tutorial();
    });

    describe('initialize', () => {
        let alys: Actor;
        let scene: Scene;
        let stageCoachActBuilderBuild: jest.SpyInstance;
        let tutorial: Tutorial;
        beforeEach(() => {
            alys = ({
                id: 'alys',
            } as unknown) as Actor;
            const alysBuilder = (AlysBuilder as unknown) as jest.Mock;
            alysBuilder.mockImplementation(() => ({
                getAlys: jest.fn().mockReturnValue(alys),
            }));
            scene = ({
                id: 'scene',
            } as unknown) as Scene;
            stageCoachActBuilderBuild = jest.fn().mockReturnValue(scene);

            const stageCoachActBuilder = (StageCoachActBuilder as unknown) as jest.Mock;
            stageCoachActBuilder.mockImplementation(() => ({
                build: stageCoachActBuilderBuild,
            }));
            tutorial = new Tutorial();
        });

        it('invokes the act builder build method with the actor', async () => {
            await tutorial.initialize();
            expect(stageCoachActBuilderBuild).toHaveBeenCalledWith(alys);
        });

        it('returns the scene', async () => {
            const returnedScene = await tutorial.initialize();
            expect(scene).toEqual(returnedScene);
        });
    });
});
