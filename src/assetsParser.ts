import peg from 'pegjs';
import fs from 'fs';
import path from 'path';
import createPosTagger from 'wink-pos-tagger';

const posTagger = createPosTagger();
posTagger.updateLexicon({
    tracks: ['NNS'],
    plain: ['NN'],
    deals: ['VBZ'],
    close: ['JJ'],
});

interface TaggedWord {
    normal: string;
    pos: string;
    lemma?: string;
}

export interface NLTaggedRule {
    id: string;
    taggedWords: TaggedWord[];
}

const parseNLTaggedRules = (rulesFilePath: string): NLTaggedRule[] => {
    const grammar = fs.readFileSync(
        path.resolve(__dirname, '../assets/rules.grammar.pegjs'),
        {
            encoding: 'utf-8',
        }
    );
    const parser = peg.generate(grammar);
    const rulesFileContents = fs.readFileSync(rulesFilePath, {
        encoding: 'utf-8',
    });
    const rules = parser.parse(rulesFileContents) as string[];
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

export const parse = <T>(
    rulesFilePath: string,
    rulesGrammarPath: string
): T[] => {
    const nlTaggedRules = parseNLTaggedRules(rulesFilePath);
    const posGrammarContents = fs.readFileSync(
        path.resolve(__dirname, '../assets/pos.grammar.pegjs'),
        {
            encoding: 'utf-8',
        }
    );
    const commonMechanicsGrammarContents = fs.readFileSync(
        path.resolve(__dirname, '../assets/common-mechanics.grammar.pegjs'),
        {
            encoding: 'utf-8',
        }
    );
    const rulesGrammarContents = fs.readFileSync(rulesGrammarPath, {
        encoding: 'utf-8',
    });
    const parser = peg.generate(
        rulesGrammarContents +
            posGrammarContents +
            commonMechanicsGrammarContents
    );
    return nlTaggedRules.map(
        (rule): T => {
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
