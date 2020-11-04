/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AdvanceAction from '../actions/AdvanceAction';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import CombatSceneEngine from '../engines/CombatSceneEngine';
import NarrativeSceneEngine from '../engines/NarrativeSceneEngine';
import NarrationsCatalogue from '../narrations/NarrationsCatalogue';
import SceneTemplateResolver from '../templateSystem/SceneTemplateResolver';
import AI from './AI';
import instrumentScene from './instrument';

type ErrorMessages = string[];
type Log = (message: string) => void;

const testNarrations = ({
    narrationsCatalogue,
    getSceneTemplateResolverWithInstrumentedFetchScene,
    log,
}: {
    narrationsCatalogue: NarrationsCatalogue;
    getSceneTemplateResolverWithInstrumentedFetchScene: () => SceneTemplateResolver;
    log: Log;
}): void => {
    it('got no errors when simulating the narrations', async () => {
        const errors = [] as ErrorMessages;
        const narrations = await narrationsCatalogue.fetchNarrations();
        for (const narration of narrations) {
            const initializedNarration = await narrationsCatalogue.initializeNarration(
                narration
            );
            const narrationErrors = await testNarration(
                initializedNarration,
                log
            );
            errors.push(...narrationErrors);
        }
        expect(errors).toEqual([]);
    });

    const testNarration = (
        narration: Narration,
        log: Log
    ): Promise<ErrorMessages> => {
        log(narration.getTitle());
        const scene = narration.getCurrentScene()!;
        return testScene(scene, narration, log, 1);
    };

    const testScene = (
        scene: Scene,
        narration: Narration,
        log: Log,
        depth: number
    ): Promise<ErrorMessages> => {
        log(`${pad(depth)}${scene.getTitle()}`);
        if (scene.isCombat()) {
            return testCombatScene(scene, narration, log, depth);
        } else {
            return testNarrativeScene(scene, narration, log, depth);
        }
    };

    const pad = (depth: number): string => new Array(depth).fill(' ').join('');

    const testCombatScene = async (
        scene: Scene,
        narration: Narration,
        log: Log,
        depth: number
    ): Promise<ErrorMessages> => {
        const [
            survivability,
            victoriousScene,
            victoriousNarration,
        ] = await computeSurvivability(scene, narration);
        log(`${pad(depth)}·survivability: ${survivability * 100}%`);
        const errorMessages = [] as ErrorMessages;
        if (survivability < 0.3) {
            errorMessages.push(
                `Survivability of ${scene.getTitle()} is too low (${survivability})`
            );
        }
        return testNarrativeScene(
            victoriousScene,
            victoriousNarration,
            log,
            depth
        );
    };

    const computeSurvivability = async (
        scene: Scene,
        narration: Narration
    ): Promise<[number, Scene, Narration]> => {
        const victoriousScenesAndNarrations = [] as Array<[Scene, Narration]>;
        const simulations = 50;
        for (let i = 0; i < simulations; i++) {
            // eslint-disable-next-line prefer-const
            let [combatScene, combatNarration] = instrumentScene(
                scene,
                narration,
                getSceneTemplateResolverWithInstrumentedFetchScene()
            );
            combatScene = await simulateCombat(combatScene);
            if (isVictoriousCombat(combatScene)) {
                victoriousScenesAndNarrations.push([
                    combatScene,
                    combatNarration,
                ]);
            }
        }
        const survivability =
            victoriousScenesAndNarrations.length / simulations;
        const [
            victoriousScene,
            victoriousNarration,
        ] = victoriousScenesAndNarrations[
            Math.floor(Math.random() * victoriousScenesAndNarrations.length)
        ];
        return [survivability, victoriousScene, victoriousNarration];
    };

    const simulateCombat = async (scene: Scene): Promise<Scene> => {
        const ai = new AI(scene);
        const player = scene.getPlayer();
        const combatSceneEngine = new CombatSceneEngine({
            scene,
        });
        while (player.isAlive() && !combatSceneEngine.isCombatOver()) {
            await simulateTurn(combatSceneEngine, ai, scene);
        }
        return scene;
    };

    const simulateTurn = async (
        combatSceneEngine: CombatSceneEngine,
        ai: AI,
        scene: Scene
    ): Promise<void> => {
        if (combatSceneEngine.isPlayerTurn()) {
            await simulatePlayerTurn(combatSceneEngine, ai, scene);
        } else {
            await combatSceneEngine.executeNextOponentAction();
        }
    };

    const simulatePlayerTurn = async (
        combatSceneEngine: CombatSceneEngine,
        ai: AI,
        scene: Scene
    ): Promise<void> => {
        const nextAction = ai.getNextAction(scene);
        await combatSceneEngine.executePlayerAction(nextAction);
    };

    const isVictoriousCombat = (scene: Scene): boolean => {
        return scene.getPlayer().isAlive();
    };

    const testNarrativeScene = async (
        scene: Scene,
        narration: Narration,
        log: Log,
        depth: number
    ): Promise<ErrorMessages> => {
        const [instrumentedScene] = instrumentScene(
            scene,
            narration,
            getSceneTemplateResolverWithInstrumentedFetchScene()
        );
        const narrativeSceneEngine = new NarrativeSceneEngine({
            scene: instrumentedScene,
        });
        const advanceActions = narrativeSceneEngine
            .getPlayerActions()
            .getAdvanceActions();
        if (!advanceActions.length) {
            log(`${pad(depth)}X`);
            return Promise.resolve([]);
        }
        const errors = [] as ErrorMessages;
        for (const advanceAction of advanceActions) {
            const advanceActionErrors = await advance(
                advanceAction,
                instrumentedScene,
                narration,
                log,
                depth
            );
            errors.push(...advanceActionErrors);
        }
        return errors;
    };

    const advance = async (
        advanceAction: AdvanceAction,
        scene: Scene,
        narration: Narration,
        log: Log,
        depth: number
    ): Promise<ErrorMessages> => {
        const [
            highLuckNextScene,
            highLuckNarration,
        ] = await getNextSceneWithFixedLuck(
            0.01,
            advanceAction,
            scene,
            narration
        );
        const [
            lowLuckNextScene,
            lowLuckNarration,
        ] = await getNextSceneWithFixedLuck(
            0.99,
            advanceAction,
            scene,
            narration
        );
        if (lowLuckNextScene.equals(highLuckNextScene)) {
            return testScene(
                highLuckNextScene,
                highLuckNarration,
                log,
                depth + 1
            );
        } else {
            const highLuckErrorMessages = await testScene(
                highLuckNextScene,
                highLuckNarration,
                log,
                depth + 1
            );
            const lowLuckErrorMessages = await testScene(
                lowLuckNextScene,
                lowLuckNarration,
                log,
                depth + 1
            );
            return [...highLuckErrorMessages, ...lowLuckErrorMessages];
        }
    };

    const getNextSceneWithFixedLuck = async (
        luck: number,
        advanceAction: AdvanceAction,
        scene: Scene,
        narration: Narration
    ): Promise<[Scene, Narration]> => {
        const [instrumentedScene, instrumentedNarration] = instrumentScene(
            scene,
            narration,
            getSceneTemplateResolverWithInstrumentedFetchScene()
        );
        const narrativeSceneEngine = new NarrativeSceneEngine({
            scene: instrumentedScene,
        });
        const advanceActions = narrativeSceneEngine
            .getPlayerActions()
            .getAdvanceActions();
        const instrumentedAdvanceAction = advanceActions.find((action) =>
            action.equals(advanceAction)
        )!;
        const randomSpy = jest.spyOn(Math, 'random');
        randomSpy.mockReturnValue(luck);
        await narrativeSceneEngine.executePlayerAction(
            instrumentedAdvanceAction
        );
        randomSpy.mockRestore();
        const currentScene = instrumentedNarration.getCurrentScene()!;
        return instrumentScene(
            currentScene,
            instrumentedNarration,
            getSceneTemplateResolverWithInstrumentedFetchScene()
        );
    };
};

export default testNarrations;
