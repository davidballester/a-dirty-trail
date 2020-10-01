import { Graph } from 'graphlib';
import path from 'path';
import { Ammunition, Weapon } from '../mechanics/attack';
import { getSkillName } from '../mechanics/skill';
import { getRandomItem } from './common';
import { parse } from './parser';

type AttackRuleType = 'isA' | 'skill' | 'damage' | 'ammunition';

interface Damage {
    min: number;
    max: number;
}

interface AttackRule {
    id: string;
    type: AttackRuleType;
    subjects: string[];
    target?: string;
    damage?: Damage;
    ammunition?: {
        max: number;
        type: string;
    };
}

const getAttackRules = (): AttackRule[] => {
    return parse<AttackRule>(
        path.resolve(__dirname, '../../assets/attack.txt'),
        path.resolve(__dirname, '../../assets/attack.grammar.pegjs')
    );
};

const buildGraph = (attackRules: AttackRule[], type: AttackRuleType): Graph => {
    const graph = new Graph();
    attackRules
        .filter((rule) => rule.type === type)
        .forEach((rule) => {
            rule.subjects.forEach((subject) => {
                if (!graph.hasNode(subject)) {
                    graph.setNode(subject);
                }
                if (!graph.hasNode(rule.target!)) {
                    graph.setNode(rule.target!);
                }
                graph.setEdge(subject, rule.target!);
            });
        });
    return graph;
};

const buildIsAGraph = (attackRules: AttackRule[]): Graph =>
    buildGraph(attackRules, 'isA');

const buildSkillGraph = (attackRules: AttackRule[]): Graph =>
    buildGraph(attackRules, 'skill');

const buildDamageGraph = (attackRules: AttackRule[]): Graph => {
    const graph = new Graph();
    attackRules
        .filter((rule) => rule.type === 'damage')
        .forEach((rule) => {
            rule.subjects.forEach((subject) => {
                if (!graph.hasNode(subject)) {
                    graph.setNode(subject, rule.damage);
                }
            });
        });
    return graph;
};

const buildAmmunitionGraph = (attackRules: AttackRule[]): Graph => {
    const graph = new Graph();
    attackRules
        .filter((rule) => rule.type === 'ammunition' && rule.ammunition)
        .forEach((rule) => {
            rule.subjects.forEach((subject) => {
                if (!graph.hasNode(subject)) {
                    graph.setNode(subject, rule.ammunition!.max);
                }
                if (!graph.hasNode(rule.ammunition!.type)) {
                    graph.setNode(rule.ammunition!.type);
                }
                graph.setEdge(subject, rule.ammunition!.type);
            });
        });
    return graph;
};

export type AmmunitionGenerator = () => Ammunition;

export type WeaponGenerator = () => Weapon;

export const getWeaponAndAmmunitionGenerators = (): {
    weaponGenerator: WeaponGenerator;
    ammunitionGenerator: AmmunitionGenerator;
} => {
    const attackRules = getAttackRules();
    const isAGraph = buildIsAGraph(attackRules);
    const skillGraph = buildSkillGraph(attackRules);
    const damageGraph = buildDamageGraph(attackRules);
    const ammunitionGraph = buildAmmunitionGraph(attackRules);
    return {
        weaponGenerator: () => {
            const possibleWeapons = isAGraph.predecessors('weapon') || [];
            const weapon = getRandomItem(possibleWeapons);
            const possibleSkills = skillGraph.successors(weapon) || [];
            const skill = getRandomItem(possibleSkills);
            const damage = damageGraph.node(weapon) as Damage;
            const possibleAmmunitions =
                ammunitionGraph.successors(weapon) || [];
            if (possibleAmmunitions.length) {
                const ammunition = getRandomItem(possibleAmmunitions);
                const maxCapacity = ammunitionGraph.node(weapon);
                const quantity = Math.ceil(Math.random() * maxCapacity);
                return new Weapon(
                    weapon,
                    damage.min,
                    damage.max,
                    getSkillName(skill),
                    new Ammunition(ammunition, quantity, maxCapacity)
                );
            }
            return new Weapon(
                weapon,
                damage.min,
                damage.max,
                getSkillName(skill)
            );
        },
        ammunitionGenerator: () => {
            const possibleAmmunitions =
                isAGraph.predecessors('ammunition') || [];
            const ammunition = getRandomItem(possibleAmmunitions);
            return new Ammunition(
                ammunition,
                Math.round(Math.random() * 3) + 2,
                50
            );
        },
    };
};
