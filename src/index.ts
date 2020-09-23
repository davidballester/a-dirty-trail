import { getRules } from './rules';
import { buildScene } from './builder';

const rules = getRules();
buildScene(rules);
