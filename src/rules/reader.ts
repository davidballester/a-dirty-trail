import peg from 'pegjs';
import fs from 'fs';
import path from 'path';
import createPosTagger from 'wink-pos-tagger';
import { getRulesStructure } from '../rulesStructure';
import { NLTaggedRule } from './model';
import { Rule } from '../model';

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
            console.log(rule);
            console.log(new Array(rule.length).fill('-').join(''));
            console.log(JSON.stringify({ taggedWords }, null, 4));
            console.log();
            return {
                id: rule,
                taggedWords,
            };
        }
    );
};

export const getRules = (): Rule[] => {
    const rawRules = readRawRules();
    const rules = getRulesStructure(rawRules);
    return rules;
};
