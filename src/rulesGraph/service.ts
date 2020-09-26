import { Graph } from 'graphlib';
import { Actor, Rule, RulesGraphs } from '../model';

const buildGraph = (rules: Rule[]): Graph => {
    const graph = new Graph();
    rules
        .filter(({ subject }) => !!subject.actor)
        .filter(({ targets }) => !!targets && !!targets.length)
        .forEach(({ subject: { actor }, verb, targets }) => {
            const actorLabel = getActorLabel(actor!);
            if (!graph.hasNode(actorLabel)) {
                graph.setNode(actorLabel, actor);
            }
            targets.forEach((target) => {
                const targetLabel = getActorLabel(target);
                if (!graph.hasNode(targetLabel)) {
                    graph.setNode(targetLabel, target);
                }
                if (verb.name === 'be') {
                    // Hierarchical relations must be considered reversed for proper inspection
                    graph.setEdge(targetLabel, actorLabel, verb);
                } else {
                    graph.setEdge(actorLabel, targetLabel, verb);
                }
            });
        });
    return graph;
};

export const buildGraphs = (rules: Rule[]): RulesGraphs => {
    const uniqueVerbs = new Set(rules.map(({ verb }) => verb.name));
    console.log(uniqueVerbs);
    const rulesGraphs = { global: new Graph({ multigraph: true }) };
    uniqueVerbs.forEach((verb) => {
        const verbRules = rules.filter(({ verb: { name } }) => name === verb);
        const graph = buildGraph(verbRules);
        mergeGraphs(rulesGraphs.global, graph);
        rulesGraphs[verb] = graph;
    });
    rulesGraphs['be-reverse'] = reverseGraph(rulesGraphs['be']);
    return rulesGraphs;
};

export const getActorLabel = ({ name, modifier }: Actor): string =>
    !modifier ? name : `${modifier}-${name}`;

export const mergeGraphs = (target: Graph, source: Graph): void => {
    mergeNodes(target, source);
    source.edges().forEach((edgeLabel) => {
        const edge = source.edge(edgeLabel.v, edgeLabel.w, edgeLabel.name);
        target.setEdge(
            edgeLabel.v,
            edgeLabel.w,
            edge,
            `${edgeLabel.v}-${edgeLabel.w}-${edge.name}`
        );
    });
};

const mergeNodes = (target: Graph, source: Graph): void => {
    source.nodes().forEach((nodeLabel) => {
        if (!target.node(nodeLabel)) {
            const node = source.node(nodeLabel);
            target.setNode(nodeLabel, node);
        }
    });
};

const reverseGraph = (graph: Graph): Graph => {
    const reversedGraph = new Graph();
    mergeNodes(reversedGraph, graph);
    graph.edges().forEach((edgeLabel) => {
        const edge = graph.edge(edgeLabel.v, edgeLabel.w);
        reversedGraph.setEdge(edgeLabel.w, edgeLabel.v, edge);
    });
    return reversedGraph;
};
