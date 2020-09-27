import peg from 'pegjs';
import fs from 'fs';
import path from 'path';
import createPosTagger from 'wink-pos-tagger';
import { NLTaggedRule } from './model';
import { Rule, RulesGraphs } from '../model';
import { buildGraphs } from '../rulesGraph';

const posTagger = createPosTagger();
posTagger.updateLexicon({
    living: ['JJ'],
    attack: ['VB'],
    attacks: ['VBZ'],
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
    const grammar = fs.readFileSync(
        path.resolve(__dirname, '../../assets/rulesStructure.grammar.pegjs'),
        {
            encoding: 'utf-8',
        }
    );
    const parser = peg.generate(grammar);
    return rawRules.map(
        (rule): Rule => {
            const rawRuleStructure = rule.taggedWords
                .map(
                    (taggedWord) =>
                        `${taggedWord.pos}/${
                            taggedWord.lemma || taggedWord.normal
                        }`
                )
                .join(' ');
            try {
                const ruleStructure = parser.parse(rawRuleStructure);
                return {
                    id: rule.id,
                    ...ruleStructure,
                };
            } catch (err) {
                console.log(rule.id);
                console.log(new Array(rule.id.length).fill('-').join(''));
                console.log(rawRuleStructure);
                console.log(err);
                process.exit(-1);
            }
        }
    );
};

export const getRulesGraph = (): RulesGraphs => {
    const rawRules = readRawRules();
    const rules = getRules(rawRules);
    return buildGraphs(rules);
};
