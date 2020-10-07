import { Graph } from 'graphlib';
import { Actor, Inventory, Scene } from '../models';
import { ActorGenerator } from './actors';
import { AmmunitionGenerator, WeaponGenerator } from './attack';
import { getRandomItem, getRandomItems } from './common';
import { SceneRule } from './rules';
import scenesRulesJson from './scenesRules.json';

const scenesRules = (scenesRulesJson as unknown) as SceneRule[];

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
    const isAGraph = buildIsAGraph(scenesRules);
    const containsGraph = buildContainsGraph(scenesRules);
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
        return new Scene(randomScene, scenary.join(', '), actors, containers);
    };
};
