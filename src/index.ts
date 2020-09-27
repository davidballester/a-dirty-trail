import { getRulesGraph } from './rules';
import { getPossibleActions, startNewGame } from './game';

const rulesGraphs = getRulesGraph();
// new Array(50).fill(null).forEach(() => {
const game = startNewGame(rulesGraphs);
const possibleActions = getPossibleActions(game);
// console.log(game.persistentWorld.nodes(), possibleActions.edges());
// });
