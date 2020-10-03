import { getSceneGenerator } from './world/scenes';
import { getWeaponAndAmmunitionGenerators } from './world/attack';
import { getActorGenerator } from './world/actors';
import { Game } from './game';
import { getRandomItem } from './world/common';
import { Narrator } from './narrator';

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

const game = new Game(sceneGenerator, actorGenerator);
const narrator = new Narrator(game.player);
console.log(narrator.tellIntroduction());
console.log();
while (game.player.isAlive()) {
    console.log(narrator.describeSetup(game.scene));
    const playerAction = getRandomItem(game.buildPlayerActions());
    if (!playerAction) {
        break;
    }
    if (game.canExecuteAction(playerAction)) {
        console.log(narrator.describeAction(playerAction));
        const outcome = game.executeAction(playerAction);
        console.log(narrator.describeActionOutcome(playerAction, outcome));
    }
    const oponentsActions = game.buildOponentsActions();
    for (let oponentId of Object.keys(oponentsActions)) {
        if (!game.player.isAlive()) {
            break;
        }
        const oponentAction = getRandomItem(oponentsActions[oponentId]);
        if (oponentAction && game.canExecuteAction(oponentAction)) {
            console.log(narrator.describeAction(oponentAction));
            const oponentActionOutcome = game.executeAction(oponentAction);
            console.log(
                narrator.describeActionOutcome(
                    oponentAction,
                    oponentActionOutcome
                )
            );
        }
    }
}
console.log();
console.log(narrator.tellEnding());
console.log();
