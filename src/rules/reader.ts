import peg from 'pegjs';
import fs from 'fs';
import path from 'path';
import pos from 'pos';
import tagDictionary from '../utils/tagDictionary';
import { getRulesStructure } from '../rulesStructure';
import { NLTaggedRule } from './model';
import { Rule } from '../model';

let customTaggerInstance: any = undefined;
const getCustomTagger = (): any => {
    if (customTaggerInstance) {
        return customTaggerInstance;
    }
    const extendedLexicon = {
        attacks: ['VBZ'],
        attack: ['VB'],
        animal: ['NN'],
        living: ['JJ'],
        change: ['VB'],
    };
    customTaggerInstance = new pos.Tagger();
    Object.keys(extendedLexicon).forEach(
        (word) => delete customTaggerInstance.lexicon[word]
    );
    customTaggerInstance.extendLexicon(extendedLexicon);
    return customTaggerInstance;
};

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
    const tagger = getCustomTagger();
    return rules.map(
        (rule): NLTaggedRule => {
            const words = new pos.Lexer().lex(rule);
            const taggedWords = tagger.tag(words);
            return {
                id: rule,
                taggedWords: taggedWords.map((taggedWord) => [
                    ...taggedWord,
                    tagDictionary[taggedWord[1]],
                ]),
            };
        }
    );
};

export const getRules = (): Rule[] => {
    const rawRules = readRawRules();
    const rules = getRulesStructure(rawRules);
    return rules;
};
