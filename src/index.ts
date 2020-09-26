import { getRulesGraph } from './rules';
import { buildScene } from './builder';

const rulesGraphs = getRulesGraph();
buildScene(rulesGraphs);
