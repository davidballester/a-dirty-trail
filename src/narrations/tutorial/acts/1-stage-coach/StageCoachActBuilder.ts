import AdvanceAction from '../../../../actions/AdvanceAction';
import AdvanceActionWithSideEffect from '../../../../actions/AdvanceActionWithSideEffect';
import Actor from '../../../../core/Actor';
import Narration from '../../../../core/Narration';
import Scene from '../../../../core/Scene';
import SceneTextsReader from '../../../SceneTextsReader';
import ActBuilder from '../../ActBuilder';

class StageCoachActBuilder extends ActBuilder {
    static readonly TITLE = 'The stage coach';

    private narration: Narration;

    constructor({ narration }: { narration: Narration }) {
        super();
        this.narration = narration;
    }

    build(): Promise<Scene> {
        throw new Error('Method not implemented.');
    }

    getNextScene(scene: Scene): Promise<Scene | undefined> {
        throw new Error('Method not implemented.');
    }

    private async buildWelcomeScene(player: Actor): Promise<Scene> {
        const sceneTextsReader = new SceneTextsReader({
            sceneSetupFilePath: './welcome.md',
        });
        const { setup, actionsText } = await sceneTextsReader.getTexts();
        const welcomeScene = new Scene({
            title: StageCoachActBuilder.TITLE,
            actors: [],
            player,
            setup,
            actions: [],
        });
        welcomeScene.setActions([
            new AdvanceActionWithSideEffect({
                actor: player,
                scene: welcomeScene,
                name: actionsText[0],
                narration: this.narration,
                sideEffect: () => {
                    player.changeName('Alys');
                },
                nextSceneDecider: (scene: Scene) =>
                    this.buildAlysScene(scene.getPlayer()!),
            }),
            new AdvanceActionWithSideEffect({
                actor: player,
                scene: welcomeScene,
                name: actionsText[1],
                narration: this.narration,
                sideEffect: () => {
                    player.changeName('Lady Cartwright');
                },
                nextSceneDecider: (scene: Scene) =>
                    this.buildLadyCartwrightScene(scene.getPlayer),
            }),
        ]);
        return welcomeScene;
    }

    private buildAlysScene(player: Actor): Scene {
        throw new Error('Method not implemented');
    }

    private buildLadyCartwrightScene(player: Actor): Scene {
        throw new Error('Method not implemented');
    }
}

export default StageCoachActBuilder;
