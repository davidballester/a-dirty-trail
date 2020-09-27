import { Graph, Edge, alg } from 'graphlib';
import { RulesGraphs, Verb } from '../model';
import { Game } from '../game';
import { getEdgeLabel, getLeaves, mergeGraphs } from '../rulesGraph';

export const buildScene = (rulesGraphs: RulesGraphs): Graph =>
    instantiate('scene', rulesGraphs);

export const buildPlayer = (rulesGraphs: RulesGraphs): Graph => {
    const player = instantiate('player', rulesGraphs);
    const playerFacts = getFacts(
        'player',
        rulesGraphs.global,
        rulesGraphs.beReverse
    );
    console.log(playerFacts);
    return player;
};

export const getPlayerActions = (game: Game) => getAppliedFacts('player', game);

const getAppliedFacts = (node: string, game: Game): Graph => {
    const world = game.persistentWorld;
    const rules = game.rulesGraphs.global;
    const beReverseGraph = game.rulesGraphs.beReverse;
    const ancestryOfNodes = getAncestryOfNodes(world, beReverseGraph);
    const facts = getFacts(
        node,
        game.rulesGraphs.global,
        beReverseGraph
    ).filter(
        (edge) => ['be', 'have', 'occur'].indexOf(rules.edge(edge).name) === -1
    );
    const appliedFacts = new Graph({ multigraph: true });
    facts.forEach((edge) => {
        const edgeData = rules.edge(edge);
        const target = edge.w;
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
    });
    return appliedFacts;
};

const getFacts = (
    node: string,
    rules: Graph,
    beReverseGraph: Graph
): Edge[] => {
    const nodeAncestry = alg.preorder(beReverseGraph, [node]);
    const ancestryFacts = nodeAncestry.map(
        (ancestor) => rules.outEdges(ancestor) || []
    );
    console.log('getFacts', ancestryFacts);
    return ancestryFacts.reduce(
        (allFacts, facts) => [...allFacts, ...facts],
        []
    );
};

const resolveFact = (fact: Edge, verb: Verb, game: Game): Graph | null => {
    switch (verb.name) {
        case 'have': {
            const factTarget = fact.w;
            const allPossibleTargets = getLeaves(
                factTarget,
                game.rulesGraphs.be
            );
            const target = getRandomItem(allPossibleTargets);
            // I need to add the full target data to the graph. Right now, the "between X and Y" info is lost.
            return null;
        }
        default: {
            return null;
        }
    }
};

const getAncestryOfNodes = (
    graph: Graph,
    beReverseGraph: Graph
): { [node: string]: string[] } =>
    graph.nodes().reduce((ancestryOfNodes, node) => {
        const ancestry = beReverseGraph.hasNode(node)
            ? alg.preorder(beReverseGraph, [node])
            : [node];
        return {
            ...ancestryOfNodes,
            [node]: ancestry,
        };
    }, {});

const instantiate = (node: string, rulesGraphs: RulesGraphs): Graph => {
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
            const allPossibleTargets = getLeaves(outEdge.w, rulesGraphs.be);
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
