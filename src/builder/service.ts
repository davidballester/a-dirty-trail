import { Graph } from 'graphlib';
import { RulesGraphs } from '../model';
import { instantiate } from './aboxService';

export const buildScene = (rulesGraphs: RulesGraphs): Graph =>
    instantiate('scene', rulesGraphs);

export const buildPlayer = (rulesGraphs: RulesGraphs): Graph =>
    instantiate('player', rulesGraphs);
