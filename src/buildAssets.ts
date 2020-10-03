import path from 'path';
import fs from 'fs';
import { ActorRule, AttackRule, SceneRule } from './world/rules';
import { parse } from './assetsParser';

const getAttackRules = (): AttackRule[] => {
    return parse<AttackRule>(
        path.resolve(__dirname, '../assets/attack.txt'),
        path.resolve(__dirname, '../assets/attack.grammar.pegjs')
    );
};

const getActorsRules = (): ActorRule[] => {
    return parse<ActorRule>(
        path.resolve(__dirname, '../assets/actors.txt'),
        path.resolve(__dirname, '../assets/actors.grammar.pegjs')
    );
};

const getScenesRules = (): SceneRule[] => {
    return parse<SceneRule>(
        path.resolve(__dirname, '../assets/scenes.txt'),
        path.resolve(__dirname, '../assets/scenes.grammar.pegjs')
    );
};

const writeRules = (rules: any[], filePath: string): void => {
    fs.unlinkSync(filePath);
    fs.writeFileSync(filePath, JSON.stringify(rules, null, 4), {
        encoding: 'utf-8',
    });
};

const buildAssets = (): void => {
    const attackRules = getAttackRules();
    const attackRulesFile = path.resolve(
        __dirname,
        '../src/world/attacksRules.json'
    );
    writeRules(attackRules, attackRulesFile);

    const actorsRules = getActorsRules();
    const actorsRulesFile = path.resolve(
        __dirname,
        '../src/world/actorsRules.json'
    );
    writeRules(actorsRules, actorsRulesFile);

    const scenesRules = getScenesRules();
    const scenesRulesFile = path.resolve(
        __dirname,
        '../src/world/scenesRules.json'
    );
    writeRules(scenesRules, scenesRulesFile);
};

buildAssets();
