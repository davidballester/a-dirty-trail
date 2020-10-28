import Actor from '../../../../core/Actor';
import Scene from '../../../../core/Scene';
import SceneTemplateProcessor from '../../../SceneTemplateProcessor';
import ActBuilder from '../../ActBuilder';
import theRoadSceneTemplate from './theRoad';

class TheRoadActBuilder extends ActBuilder {
    static readonly TITLE = 'The road';

    build(player: Actor): Scene {
        const sceneTextsReader = new SceneTemplateProcessor({
            sceneTemplate: theRoadSceneTemplate,
        });
        const { setup } = sceneTextsReader.getTexts();
        const scene = new Scene({
            title: TheRoadActBuilder.TITLE,
            actors: [],
            player,
            setup,
            actions: [],
        });
        return scene;
    }
}

export default TheRoadActBuilder;
