import { Graph } from 'graphlib';
import path from 'path';
import { Actor } from '../mechanics/actor';
import { Inventory } from '../mechanics/inventory';
import { Scene } from '../mechanics/scene';
import { ActorGenerator } from './actors';
import { AmmunitionGenerator, WeaponGenerator } from './attack';
import { getRandomItem, getRandomItems } from './common';
import { parse } from './parser';

interface SceneRule {
    id: string;
    type: 'isA' | 'contains';
    subjects: string[];
    targets: string[];
}

const getSceneRules = (): SceneRule[] => {
    return parse<SceneRule>(
        path.resolve(__dirname, '../../assets/scenes.txt'),
        path.resolve(__dirname, '../../assets/scenes.grammar.pegjs')
    );
};

const buildIsAGraph = (sceneRules: SceneRule[]): Graph => {
    const graph = new Graph();
    sceneRules
        .filter(({ type }) => type === 'isA')
        .forEach((rule) => {
            rule.subjects.forEach((subject) => {
                if (!graph.hasNode(subject)) {
                    graph.setNode(subject);
                }
                rule.targets.forEach((target) => {
                    if (!graph.hasNode(target)) {
                        graph.setNode(target);
                    }
                    graph.setEdge(subject, target);
                });
            });
        });
    return graph;
};

const buildContainsGraph = (sceneRules: SceneRule[]): Graph => {
    const graph = new Graph();
    sceneRules
        .filter(({ type }) => type === 'contains')
        .forEach((rule) => {
            rule.subjects.forEach((subject) => {
                if (!graph.hasNode(subject)) {
                    graph.setNode(subject);
                }
                rule.targets.forEach((target) => {
                    if (!graph.hasNode(target)) {
                        graph.setNode(target);
                    }
                    graph.setEdge(subject, target);
                });
            });
        });
    return graph;
};

export type SceneGenerator = () => Scene;

export const getSceneGenerator = (
    weaponGenerator: WeaponGenerator,
    ammunitionGenerator: AmmunitionGenerator,
    actorGenerator: ActorGenerator
): SceneGenerator => {
    const sceneRules = getSceneRules();
    const isAGraph = buildIsAGraph(sceneRules);
    const containsGraph = buildContainsGraph(sceneRules);
    return () => {
        const possibleScenes = isAGraph.predecessors('scene') || [];
        const randomScene = getRandomItem(possibleScenes);
        const possibleContents = containsGraph.successors(randomScene) || [];
        const contents = getRandomItems(possibleContents, 1, 3);
        const containers = contents
            .filter(
                (content) =>
                    (isAGraph.predecessors('container') || []).indexOf(
                        content
                    ) >= 0
            )
            .map((containerName) => {
                const container = new Inventory(containerName);
                const numberOfItems = Math.floor(Math.random() * 3);
                for (let i = 0; i < numberOfItems; i++) {
                    const item =
                        Math.random() < 0.2
                            ? weaponGenerator()
                            : ammunitionGenerator();
                    container.items.push(item);
                }
                return container;
            });
        const allScenary = isAGraph.predecessors('scenary') || [];
        const scenary = possibleContents.filter(
            (content) => allScenary.indexOf(content) >= 0
        );
        const numberOfActors = Math.round(Math.random() * 3);
        const actors = [] as Actor[];
        for (let i = 0; i < numberOfActors; i++) {
            actors.push(actorGenerator());
        }
        return new Scene(randomScene, actors, containers, scenary);
    };
};
