import { Game } from './game';
import { getRandomItem } from './world/common';
import { Narrator } from './narrator';
import { LeaveAction, LootAction } from './models';

const game = new Game();
const narrator = new Narrator(game.player);
console.log(narrator.tellIntroduction());
console.log();
while (game.player.isAlive()) {
    console.log(narrator.describeSetup(game.scene));
    const playerActions = game.buildPlayerActions();
    const playerAction =
        playerActions.find((action) => action instanceof LootAction) ||
        getRandomItem(playerActions);
    if (!playerAction) {
        break;
    }
    let outcome;
    if (game.canExecuteAction(playerAction)) {
        console.log(narrator.describeAction(playerAction));
        outcome = game.executeAction(playerAction);
        console.log(narrator.describeActionOutcome(playerAction, outcome));
    }
    if (!(playerAction instanceof LeaveAction) || !outcome) {
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
}
console.log();
console.log(narrator.tellEnding());
console.log();
