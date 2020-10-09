import { Game } from './game';
import { Narrator } from './narrator';
import { AdvanceToSceneAction } from './models';
import { player } from './database/narrations/findTimmy';

const game = new Game('Find Timmy');
const narrator = new Narrator(game.player);
while (!game.finished && game.player.isAlive()) {
    console.log(narrator.describeSetup(game.currentScene));
    const playerActions = game.getPlayerActions();
    const playerAction =
        playerActions[Math.floor(Math.random() * playerActions.length)];
    if (!playerAction) {
        player.health.currentHitpoints = 0;
        break;
    }
    let outcome;
    if (game.canExecuteAction(playerAction)) {
        console.log(narrator.describeAction(playerAction));
        outcome = game.executeAction(playerAction);
        console.log(narrator.describeActionOutcome(playerAction, outcome));
        console.log();
    }
    if (!(playerAction instanceof AdvanceToSceneAction) || !outcome) {
        const { action, outcome } = game.executeNextOponentAction() || {};
        if (action) {
            console.log(narrator.describeAction(action));
            console.log(narrator.describeActionOutcome(action, outcome));
            console.log();
        }
    }
}
console.log();
if (!player.isAlive()) {
    console.log(narrator.tellSadEnding());
}

console.log();
