import { RulesGraphs } from '../model';
import { alg, Edge, Graph } from 'graphlib';
import { mergeGraphs } from '../rulesGraph';

export const buildScene = (rulesGraphs: RulesGraphs): void => {
    new Array(50).fill(null).forEach(() => {
        console.log(instantiate('scene', rulesGraphs).nodes());
    });
};

const instantiate = (node: string, rulesGraphs: RulesGraphs): Graph => {
    const instance = new Graph({ multigraph: true });
    const outEdges = rulesGraphs.global.outEdges(node) || [];
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
        const outEdges = outEdgesByVerb[verb];
        const edgesThatAreTrue = outEdges.filter(
            (outEdge) => !rulesGraphs.global.edge(outEdge).modal
        );
        const randomlySelectedOptionalEdges = outEdges
            .filter(
                (outEdge) => rulesGraphs.global.edge(outEdge).modal === 'can'
            )
            .filter(() => Math.random() < 0.5);
        const edgesToConsider = [
            ...edgesThatAreTrue,
            ...randomlySelectedOptionalEdges,
        ];
        edgesToConsider.forEach((outEdge) => {
            const allPossibleTargets = getAllPossibleInstances(
                outEdge.w,
                rulesGraphs['be']
            );
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

const getAllPossibleInstances = (node: string, beGraph: Graph): string[] => {
    if (!beGraph.hasNode(node)) {
        return [];
    }
    return alg.preorder(beGraph, [node]).filter((instanceCandidate) => {
        const successors = beGraph.successors(instanceCandidate);
        return !successors || !successors.length;
    });
};

const getRandomItem = (items: any[] = []) =>
    items[Math.floor(Math.random() * items.length)];
