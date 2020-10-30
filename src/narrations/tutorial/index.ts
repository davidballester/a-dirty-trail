import SceneTemplate from '../../templateSystem/SceneTemplate';
import welcome from './acts/1-stage-coach/welcome';

const firstSceneTemplate = welcome as SceneTemplate;
firstSceneTemplate.modulePath =
    '../narrations/tutorial/acts/1-stage-coach/welcome';

export default firstSceneTemplate;
