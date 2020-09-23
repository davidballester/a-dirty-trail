import fs from 'fs';
import path from 'path';
import peg from 'pegjs';
import { NLTaggedRule } from '../rules/model';
import { Rule } from '../model';

export const getRulesStructure = (rules: NLTaggedRule[]): Rule[] => {
    const grammar = fs.readFileSync(
        path.resolve(__dirname, '../../assets/rulesStructure.grammar.pegjs'),
        {
            encoding: 'utf-8',
        }
    );
    const parser = peg.generate(grammar, {
        dependencies: {
            lemmatize: 'wink-lemmatizer',
        },
        format: 'commonjs',
    });
    return rules.map(
        (rule): Rule => {
            const rawRuleStructure = rule.taggedWords
                .map((taggedWord) => `${taggedWord[1]}/${taggedWord[0]}`)
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
                throw err;
            }
        }
    );
};
