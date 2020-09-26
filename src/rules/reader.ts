import peg from 'pegjs';
import fs from 'fs';
import path from 'path';
import createPosTagger from 'wink-pos-tagger';
import { getRulesStructure } from '../rulesStructure';
import { NLTaggedRule } from './model';
import { Rule, RulesGraphs } from '../model';
import { buildGraphs } from '../rulesGraph';

const posTagger = createPosTagger();
posTagger.updateLexicon({
    living: ['JJ'],
    attack: ['VB'],
    attacks: ['VB'],
});

const readRawRules = (): NLTaggedRule[] => {
    const grammar = fs.readFileSync(
        path.resolve(__dirname, '../../assets/rules.grammar.pegjs'),
        {
            encoding: 'utf-8',
        }
    );
    const parser = peg.generate(grammar);

    const input = fs.readFileSync(
        path.resolve(__dirname, '../../assets/rules.txt'),
        {
            encoding: 'utf-8',
        }
    );
    const rules = parser.parse(input) as string[];
    return rules.map(
        (rule): NLTaggedRule => {
            const taggedWords = posTagger.tagSentence(rule);
            return {
                id: rule,
                taggedWords,
            };
        }
    );
};

const getRules = (rawRules: NLTaggedRule[]): Rule[] => {
    const rules = getRulesStructure(rawRules);
    return rules;
};

export const getRulesGraph = (): RulesGraphs => {
    const rawRules = readRawRules();
    const rules = getRules(rawRules);
    return buildGraphs(rules);
};
