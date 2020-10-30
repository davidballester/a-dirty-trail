import Narration from '../src/core/Narration';
import Scene from '../src/core/Scene';
import NarrationsCatalogue from '../src/narrations/NarrationsCatalogue';
import NarrationEngine from '../src/engines/NarrationEngine';
import CombatEngine from '../src/engines/CombatEngine';
import AdvanceAction from '../src/actions/AdvanceAction';
import Actor from '../src/core/Actor';
import { cloneScene } from './clone';
import util from 'util';
import AI from './AI';

describe('Integration tests', () => {
    let originalConsoleLog;
    beforeEach(() => {
        const logger = util.debuglog('adt');
        originalConsoleLog = console.log;
        console.log = logger;
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    it('tests all narrations!', async () => {
        const narrationsCatalogue = new NarrationsCatalogue();
        for (const narrationTitle of narrationsCatalogue.getNarrationTitles()) {
            const narration = narrationsCatalogue.getNarration(narrationTitle);
            await testNarration(narration);
        }
    });

    const testNarration = async (narration: Narration) => {
        console.log(`Testing ${narration.getTitle()}`);
        const scene = narration.getCurrentScene();
        await testScene(scene, narration);
    };

    const testScene = async (scene: Scene, narration: Narration) => {
        console.log(`${narration.getTitle()}: ${scene.getTitle()}`);
        if (scene.isCombat()) {
            await testCombatScene(scene, narration);
        } else {
            await testNarrativeScene(scene, narration);
        }
    };

    const testNarrativeScene = async (scene: Scene, narration: Narration) => {
        const narrationEngine = new NarrationEngine({ scene });
        if (narrationEngine.isNarrationFinished()) {
            console.log('Narration finished!');
            return;
        }
        const advanceActions = narrationEngine
            .getPlayerActions()
            .getAdvanceActions();
        await advance(advanceActions, narration);
    };

    const advance = async (
        advanceActions: AdvanceAction[],
        narration: Narration
    ) => {
        for (const advanceAction of advanceActions) {
            if (!advanceAction.canExecute()) {
                console.log(
                    `Abandoning advance action! ${advanceAction.getName()}`
                );
            } else {
                await advanceAction.execute();
                await testScene(narration.getCurrentScene(), narration);
            }
        }
    };

    const testCombatScene = async (scene: Scene, narration: Narration) => {
        const survivability = await getSurvivability(scene);
        console.log(`${scene.getTitle()} survability rate: ${survivability}`);
        expect(survivability).toBeGreaterThan(0.3);
        await bypassCombat(scene);
        const combatEngine = new CombatEngine({ scene });
        const advanceActions = combatEngine
            .getPlayerActions()
            .getAdvanceActions();
        await advance(advanceActions, narration);
    };

    const getSurvivability = async (scene: Scene) => {
        const simulations = 100;
        let victories = 0;
        for (let i = 0; i < simulations; i++) {
            const isVictory = await isPlayerVictoriousInCombat(scene);
            if (isVictory) {
                victories++;
            }
        }
        return victories / simulations;
    };

    const isPlayerVictoriousInCombat = async (scene: Scene) => {
        const combatScene = cloneScene(scene);
        const player = combatScene.getPlayer();
        const playerAi = buildPlayerAi(player);
        const combatEngine = new CombatEngine({ scene: combatScene });
        while (player.isAlive() && combatScene.isCombat()) {
            await simulateTurn(combatEngine, playerAi, combatScene);
        }
        return player.isAlive();
    };

    const buildPlayerAi = (player: Actor) => {
        const ai = new AI({
            name: 'AI',
            health: player.getHealth(),
            inventory: player.getInventory(),
            skillSet: player.getSkillSet(),
        });
        ((ai as unknown) as any).id = player.getId(); // This allows us to bypass the fact that the AI itself is not in the scene
        return ai;
    };

    const simulateTurn = async (
        combatEngine: CombatEngine,
        playerAi: AI,
        scene: Scene
    ) => {
        if (combatEngine.getActorCurrentTurn().equals(playerAi)) {
            await simulatePlayerTurn(combatEngine, playerAi, scene);
        } else {
            await combatEngine.executeNextOponentAction();
        }
    };

    const simulatePlayerTurn = async (
        combatEngine: CombatEngine,
        playerAi: AI,
        scene: Scene
    ) => {
        const nextAction = playerAi.getNextAction(scene);
        await combatEngine.executePlayerAction(nextAction);
    };

    const bypassCombat = async (scene: Scene) => {
        jest.spyOn(scene, 'getActors').mockReturnValue([]);
    };
});
