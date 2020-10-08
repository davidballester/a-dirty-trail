import {
    Actor,
    AdvanceToActAction,
    AdvanceToSceneAction,
    Narration,
    Scene,
} from '../../models';
import { Act, ActScene } from './models';
import narrationsByName from './narrationsByName';

export const generateNarration = (
    title: string
): { narration: Narration; player: Actor } => {
    const { player, acts } = narrationsByName[title];
    const narration = new Narration(title, acts.map(buildActGenerator));
    return {
        narration,
        player,
    };
};

const buildActGenerator = ({ actScenes }: Act) => {
    return (player: Actor) => {
        const scenes = buildScenes(player, actScenes);
        const sceneByName = getSceneByName(scenes);
        fillAdvanceToSceneActions(actScenes, player, sceneByName);
        fillAdvanceToActActions(actScenes, player, sceneByName);
        return scenes[0];
    };
};

const buildScenes = (player: Actor, actScenes: ActScene[]) =>
    actScenes.map(
        ({ name, setup, actors, containers, customActions }) =>
            new Scene({
                name,
                setup,
                actors: actors ? actors(player) : [],
                containers: containers ? containers(player) : [],
                actions: customActions ? customActions(player) : [],
            })
    );

const getSceneByName = (scenes: Scene[]) =>
    scenes.reduce(
        (partialSceneByName, scene) => ({
            ...partialSceneByName,
            [scene.name]: scene,
        }),
        {} as { [sceneName: string]: Scene }
    );

const fillAdvanceToSceneActions = (
    actScenes: ActScene[],
    player: Actor,
    sceneByName: { [sceneName: string]: Scene }
) =>
    actScenes.forEach(({ name, linksToActScenes = [] }) => {
        const scene = sceneByName[name];
        linksToActScenes.forEach(({ name, actSceneName }) => {
            const advanceToSceneAction = new AdvanceToSceneAction(
                player,
                name,
                sceneByName[actSceneName]
            );
            scene.actions.push(advanceToSceneAction);
        });
    });

const fillAdvanceToActActions = (
    actScenes: ActScene[],
    player: Actor,
    sceneByName: { [sceneName: string]: Scene }
) =>
    actScenes
        .filter(({ linkToNextAct }) => !!linkToNextAct)
        .forEach(({ name, linkToNextAct }) => {
            const scene = sceneByName[name];
            const advanceToActAction = new AdvanceToActAction(
                player,
                linkToNextAct!
            );
            scene.actions.push(advanceToActAction);
        });
