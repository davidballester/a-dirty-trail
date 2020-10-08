import { Game } from './game';
import { Narrator } from './narrator';
import { AdvanceToSceneAction } from './models';
import { player } from './database/narrations/findTimmy';

const game = new Game('Find Timmy');
const narrator = new Narrator(game.player);
while (!game.finished && game.player.isAlive()) {
    console.log(narrator.describeSetup(game.currentScene));
    const playerActions = game.buildPlayerActions();
    const playerAction =
        playerActions[Math.floor(Math.random() * playerActions.length)];
    if (!playerAction) {
        break;
    }
    let outcome;
    if (game.canExecuteAction(playerAction)) {
        console.log();
        console.log(narrator.describeAction(playerAction));
        console.log();
        outcome = game.executeAction(playerAction);
        console.log(narrator.describeActionOutcome(playerAction, outcome));
    }
    if (!(playerAction instanceof AdvanceToSceneAction) || !outcome) {
        const oponentsActions = game.buildOponentsActions();
        for (let oponentId of Object.keys(oponentsActions)) {
            if (!game.player.isAlive()) {
                break;
            }
            const oponentAction =
                oponentsActions[oponentId][
                    Math.floor(
                        Math.random() * oponentsActions[oponentId].length
                    )
                ];
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
}
console.log();
if (!player.isAlive()) {
    console.log(narrator.tellSadEnding());
}

console.log();
