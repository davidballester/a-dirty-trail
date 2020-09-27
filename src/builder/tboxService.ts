import { Edge, Graph, alg } from 'graphlib';
import { Game } from '../game';
import { getEdgeLabel } from '../rulesGraph';

export const getAppliedFacts = (node: string, game: Game): Graph => {
    const world = game.persistentWorld;
    const rules = game.rulesGraphs.global;
    const beReverseGraph = game.rulesGraphs['be-reverse'];
    const ancestryOfNodes = getAncestryOfNodes(world, beReverseGraph);
    const facts = getFacts(node, game.rulesGraphs.global);
    const appliedFacts = new Graph({ multigraph: true });
    facts.forEach((edge) => {
        const edgeData = rules.edge(edge);
        const target = edge.w;
        if (beReverseGraph.hasNode(target)) {
            world
                .nodes()
                .filter((node) => ancestryOfNodes[node])
                .filter(
                    (candidate) =>
                        !!ancestryOfNodes[candidate].find(
                            (ancestor) => ancestor === target
                        )
                )
                .forEach((nodeAffectedByFact) => {
                    appliedFacts.setEdge(
                        node,
                        nodeAffectedByFact,
                        edgeData,
                        getEdgeLabel(node, nodeAffectedByFact, edgeData)
                    );
                });
        }
    });
    return appliedFacts;
};

const getFacts = (node: string, rules: Graph): Edge[] => {
    const outEdges = rules.outEdges(node) || [];
    return filterEdgesForFacts(outEdges, rules);
};

/**
 * From all possible edges, selects those that are related to the facts.
 *
 * @param edges all edges to consider.
 * @param globalGraph gloabl graph with edges information.
 * @returns edges related with facts.
 */
const filterEdgesForFacts = (edges: Edge[], globalGraph: Graph): Edge[] =>
    edges.filter((edge) => {
        const verb = globalGraph.edge(edge);
        return ['contain', 'have', 'occur'].indexOf(verb.name) === -1;
    });

const getAncestryOfNodes = (
    graph: Graph,
    beReverseGraph: Graph
): { [node: string]: string[] } =>
    graph
        .nodes()
        .filter((node) => beReverseGraph.hasNode(node))
        .reduce((ancestryOfNodes, node) => {
            const ancestry = alg.preorder(beReverseGraph, [node]);
            return {
                ...ancestryOfNodes,
                [node]: ancestry,
            };
        }, {});
