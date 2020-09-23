import {
    getRulesWithActor,
    getInstances,
    getContents,
} from '../rulesNavigator';
import { Rule } from '../model';

export const buildScene = (rules: Rule[]): void => {
    const sceneRules = getRulesWithActor({ name: 'scene' }, rules);
    sceneRules.forEach((sceneRule) => {
        (sceneRule.targets || []).forEach((target) => {
            const possibleInstances = getInstances(target, rules);
            const instance = getRandomItem(possibleInstances);
            const possibleContents = getContents(instance, rules);
            const contents = getRandomItems(
                possibleContents,
                Math.min(2, Math.round(Math.random() * possibleContents.length))
            );
            console.log(
                target,
                JSON.stringify(
                    { instance, possibleContents, contents },
                    null,
                    4
                )
            );
        });
    });
};

const getRandomItem = (items: any[] = []) =>
    items[Math.floor(Math.random() * items.length)];

const getRandomItems = (items: any[] = [], itemsNumber = 1) =>
    new Array(itemsNumber).fill(null).map(() => getRandomItem(items));
