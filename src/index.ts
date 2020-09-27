import { getRulesGraph } from './rules';
import { getPossibleActions, startNewGame } from './game';

const rulesGraphs = getRulesGraph();
new Array(50).fill(null).forEach(() => {
    const game = startNewGame(rulesGraphs);
    const possibleActions = getPossibleActions(game);
    console.log(
        JSON.stringify(
            {
                actors: game.persistentWorld.nodes(),
                possibleActions: possibleActions
                    .edges()
                    .map((edge) => edge.name),
            },
            null,
            4
        )
    );
    console.log();
});
