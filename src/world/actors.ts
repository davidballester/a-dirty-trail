import { Graph } from 'graphlib';
import path from 'path';
import { Actor, getActorStatus } from '../mechanics/actor';
import { Health } from '../mechanics/health';
import { Inventory, Item } from '../mechanics/inventory';
import { allSkills, Skill, SkillLevel } from '../mechanics/skill';
import { AmmunitionGenerator, WeaponGenerator } from './attack';
import { getRandomItem } from './common';
import { parse } from './parser';

interface ActorRule {
    id: string;
    type: 'isA' | 'healthPoints';
    subjects?: string[];
    target?: {
        type: string;
        status: string;
    };
    actorType?: string;
    range?: {
        min: number;
        max: number;
    };
}

const getActorsRules = (): ActorRule[] => {
    return parse<ActorRule>(
        path.resolve(__dirname, '../../assets/actors.txt'),
        path.resolve(__dirname, '../../assets/actors.grammar.pegjs')
    );
};

const buildIsAGraph = (actorRules: ActorRule[]): Graph => {
    const graph = new Graph();
    actorRules
        .filter(({ type }) => type === 'isA')
        .forEach((rule) => {
            rule.subjects!.forEach((subject) => {
                if (!graph.hasNode(subject)) {
                    graph.setNode(subject);
                }
                if (!graph.hasNode(rule.target!.type)) {
                    graph.setNode(rule.target!.type);
                }
                graph.setEdge(subject, rule.target!.type, rule.target!.status);
            });
        });
    return graph;
};

const buildHealthPointsGraph = (
    actorRules: ActorRule[],
    isAGraph: Graph
): Graph => {
    const graph = new Graph();
    actorRules
        .filter(({ type }) => type === 'healthPoints')
        .forEach(({ actorType, range }) => {
            const actorsTypes = isAGraph.predecessors(actorType!) || [];
            actorsTypes.forEach((type) => {
                if (!graph.hasNode(type)) {
                    graph.setNode(type, range);
                }
            });
        });
    return graph;
};

const skillsGenerator = (): Skill[] => {
    return allSkills.map((skill) => {
        const die = Math.random();
        let skillLevel: SkillLevel;
        if (die < 0.2) {
            skillLevel = SkillLevel.master;
        } else if (die < 0.4) {
            skillLevel = SkillLevel.good;
        } else if (die < 0.6) {
            skillLevel = SkillLevel.mediocre;
        } else {
            skillLevel = SkillLevel.poor;
        }
        return new Skill(skill, skillLevel);
    });
};

const inventoryGenerator = (
    actorName: string,
    weaponGenerator: WeaponGenerator,
    ammunitionGenerator: AmmunitionGenerator
): Inventory => {
    return new Inventory(
        actorName,
        [
            weaponGenerator(),
            Math.random() < 0.5 ? ammunitionGenerator() : null,
        ].filter(Boolean) as Item[]
    );
};

export type ActorGenerator = () => Actor;

export const getActorGenerator = (
    weaponGenerator: WeaponGenerator,
    ammunitionGenerator: AmmunitionGenerator
): ActorGenerator => {
    const actorRules = getActorsRules();
    const isAGraph = buildIsAGraph(actorRules);
    const healthPointsGraph = buildHealthPointsGraph(actorRules, isAGraph);
    return () => {
        const possibleActors = isAGraph.predecessors('people') || [];
        const actorName = getRandomItem(possibleActors);
        const status = isAGraph.edge('people', actorName);
        const healthPointsRange = healthPointsGraph.node(actorName) as {
            min: number;
            max: number;
        };
        const healthPoints =
            Math.round(
                Math.random() * (healthPointsRange.max - healthPointsRange.min)
            ) + healthPointsRange.min;
        const inventory = inventoryGenerator(
            actorName,
            weaponGenerator,
            ammunitionGenerator
        );
        const skills = skillsGenerator();
        return new Actor(
            actorName,
            new Health(healthPoints, healthPointsRange.max),
            inventory,
            [getActorStatus(status)],
            skills
        );
    };
};