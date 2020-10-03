import { Graph } from 'graphlib';
import { Ammunition, Weapon } from '../mechanics/attack';
import { getSkillName } from '../mechanics/skill';
import { getRandomItem } from './common';
import attacksRulesJson from './attacksRules.json';
import { AttackRule, AttackRuleType, Damage } from './rules';

const attacksRules = (attacksRulesJson as unknown) as AttackRule[];

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
    const isAGraph = buildIsAGraph(attacksRules);
    const skillGraph = buildSkillGraph(attacksRules);
    const damageGraph = buildDamageGraph(attacksRules);
    const ammunitionGraph = buildAmmunitionGraph(attacksRules);
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
