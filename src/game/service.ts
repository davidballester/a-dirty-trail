import { Graph } from 'graphlib';
import { buildPlayer, buildScene, getPlayerActions } from '../builder';
import { RulesGraphs } from '../model';
import { mergeGraphs } from '../rulesGraph';
import { Game } from './model';

export const startNewGame = (rulesGraphs: RulesGraphs): Game => {
    const persistentWorld = new Graph({ multigraph: true });
    const player = buildPlayer(rulesGraphs);
    mergeGraphs(persistentWorld, player);
    const scene = buildScene(rulesGraphs);
    mergeGraphs(persistentWorld, scene);
    return {
        persistentWorld,
        rulesGraphs,
    };
};

export const getPossibleActions = (game: Game): Graph => getPlayerActions(game);
