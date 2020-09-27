import { RulesGraphs } from '../model';
import { alg, Edge, Graph } from 'graphlib';
import { getLeaves, mergeGraphs } from '../rulesGraph';

export const instantiate = (node: string, rulesGraphs: RulesGraphs): Graph => {
    const instance = new Graph({ multigraph: true });
    const outEdges = filterEdgesForInstantiation(
        rulesGraphs.global.outEdges(node) || [],
        rulesGraphs.global
    );
    const outEdgesByVerb: {
        [verb: string]: Edge[];
    } = outEdges.reduce((map, outEdge) => {
        const verb = rulesGraphs.global.edge(outEdge).name;
        return {
            ...map,
            [verb]: [...(map[verb] || []), outEdge],
        };
    }, {});
    Object.keys(outEdgesByVerb).forEach((verb) => {
        const edges = pickEdgesForInstantiation(
            outEdgesByVerb[verb],
            rulesGraphs.global
        );
        edges.forEach((outEdge) => {
            const allPossibleTargets = getLeaves(outEdge.w, rulesGraphs['be']);
            if (allPossibleTargets.length) {
                const target = getRandomItem(allPossibleTargets);
                if (!instance.hasNode(target)) {
                    instance.setNode(target, rulesGraphs.global.node(target));
                }
                instance.setEdge(
                    node,
                    target,
                    rulesGraphs.global.edge(outEdge)
                );
                const targetInstance = instantiate(target, rulesGraphs);
                mergeGraphs(instance, targetInstance);
            }
        });
    });
    return instance;
};

/**
 * From all possible edges, selects those that are related to the instantiation process.
 *
 * @param edges all edges to consider.
 * @param globalGraph gloabl graph with edges information.
 * @returns edges related with instantiation.
 */
const filterEdgesForInstantiation = (
    edges: Edge[],
    globalGraph: Graph
): Edge[] =>
    edges.filter((edge) => {
        const verb = globalGraph.edge(edge);
        return ['contain', 'have', 'occur'].indexOf(verb.name) >= 0;
    });

/**
 * From all possible edges, selects those that need to be follow and select randomly from the ones that don't.
 *
 * @param edges all possible edges to consider.
 * @param gloablGraph global graph with edges information.
 * @returns edges to follow.
 */
const pickEdgesForInstantiation = (
    edges: Edge[],
    gloablGraph: Graph
): Edge[] => [
    ...edges.filter((outEdge) => !gloablGraph.edge(outEdge).modal),
    ...edges
        .filter((outEdge) => gloablGraph.edge(outEdge).modal === 'can')
        .filter(() => Math.random() < 0.5),
];

const getRandomItem = (items: any[] = []) =>
    items[Math.floor(Math.random() * items.length)];
