import { Graph } from 'graphlib';
import { RulesGraphs } from '../model';

export interface Game {
    persistentWorld: Graph;
    rulesGraphs: RulesGraphs;
}
