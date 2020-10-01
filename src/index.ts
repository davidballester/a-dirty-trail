import { getSceneGenerator } from './world/scenes';
import { getWeaponAndAmmunitionGenerators } from './world/attack';
import { getActorGenerator } from './world/actors';
import {
    buildGame,
    buildOponentsActions,
    buildPlayerActions,
    executeAction,
} from './game';
import { getRandomItem } from './world/common';

const {
    ammunitionGenerator,
    weaponGenerator,
} = getWeaponAndAmmunitionGenerators();
const actorGenerator = getActorGenerator(weaponGenerator, ammunitionGenerator);
const sceneGenerator = getSceneGenerator(
    weaponGenerator,
    ammunitionGenerator,
    actorGenerator
);

let game = buildGame(sceneGenerator, actorGenerator);
while (game.player.isAlive()) {
    const playerAction = getRandomItem(buildPlayerActions(game));
    if (!playerAction) {
        break;
    }
    executeAction(playerAction, game);
    const oponentsActions = buildOponentsActions(game);
    Object.keys(oponentsActions).forEach((oponentId) => {
        const action = getRandomItem(oponentsActions[oponentId]);
        if (action) {
            executeAction(action, game);
        }
    });
}
