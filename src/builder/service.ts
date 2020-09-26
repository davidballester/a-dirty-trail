import { RulesGraphs } from '../model';
import { instantiate } from './aboxService';

export const buildScene = (rulesGraphs: RulesGraphs): void => {
    new Array(50).fill(null).forEach(() => {
        console.log(instantiate('scene', rulesGraphs).nodes());
    });
};
