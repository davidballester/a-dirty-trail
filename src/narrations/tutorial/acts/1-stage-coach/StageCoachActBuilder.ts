import AdvanceAction from '../../../../actions/AdvanceAction';
import AdvanceActionWithSideEffect from '../../../../actions/AdvanceActionWithSideEffect';
import Actor from '../../../../core/Actor';
import Damage from '../../../../core/Damage';
import Health from '../../../../core/Health';
import Inventory from '../../../../core/Inventory';
import Narration from '../../../../core/Narration';
import NonPlayableActor from '../../../../core/NonPlayableActor';
import Scene from '../../../../core/Scene';
import Skill from '../../../../core/Skill';
import SkillSet from '../../../../core/SkillSet';
import Weapon from '../../../../core/Weapon';
import WeaponAmmunition from '../../../../core/WeaponAmmunition';
import SceneTextsReader from '../../../SceneTextsReader';
import ActBuilder from '../../ActBuilder';

class StageCoachActBuilder extends ActBuilder {
    static readonly TITLE = 'The stage coach';

    private narration: Narration;

    constructor({ narration }: { narration: Narration }) {
        super();
        this.narration = narration;
    }

    build(player: Actor): Promise<Scene> {
        return this.buildWelcomeScene(player);
    }

    private async buildWelcomeScene(player: Actor): Promise<Scene> {
        const sceneTextsReader = new SceneTextsReader({
            sceneSetupFilePath: './welcome.md',
        });
        const { setup, actionsText } = await sceneTextsReader.getTexts();
        const scene = new Scene({
            title: StageCoachActBuilder.TITLE,
            actors: [],
            player,
            setup,
            actions: [],
        });
        scene.setActions([
            new AdvanceActionWithSideEffect({
                actor: player,
                scene: scene,
                name: actionsText[0],
                narration: this.narration,
                sideEffect: (scene: Scene) => {
                    scene.getPlayer()!.changeName('Alys');
                },
                nextSceneDecider: (scene: Scene) =>
                    this.buildAlysScene(scene.getPlayer()!),
            }),
            new AdvanceActionWithSideEffect({
                actor: player,
                scene: scene,
                name: actionsText[1],
                narration: this.narration,
                sideEffect: (scene: Scene) => {
                    scene.getPlayer()!.changeName('Lady Cartwright');
                },
                nextSceneDecider: (scene: Scene) =>
                    this.buildLadyCartwrightScene(scene.getPlayer()!),
            }),
        ]);
        return scene;
    }

    private async buildAlysScene(player: Actor): Promise<Scene> {
        const sceneTextsReader = new SceneTextsReader({
            sceneSetupFilePath: './alys.md',
            input: {
                playerName: player.getName(),
            },
        });
        const { setup, actionsText } = await sceneTextsReader.getTexts();
        const scene = new Scene({
            title: StageCoachActBuilder.TITLE,
            actors: [],
            player,
            setup,
            actions: [],
        });
        scene.setActions([
            new AdvanceAction({
                actor: player,
                scene: scene,
                name: actionsText[0],
                narration: this.narration,
                nextSceneDecider: (scene: Scene) =>
                    this.buildOutsideTheStageCoach(scene.getPlayer()!),
            }),
        ]);
        return scene;
    }

    private async buildLadyCartwrightScene(player: Actor): Promise<Scene> {
        const sceneTextsReader = new SceneTextsReader({
            sceneSetupFilePath: './ladyCartwright.md',
            input: {
                playerName: player.getName(),
            },
        });
        const { setup, actionsText } = await sceneTextsReader.getTexts();
        const scene = new Scene({
            title: StageCoachActBuilder.TITLE,
            actors: [],
            player,
            setup,
            actions: [],
        });
        scene.setActions([
            new AdvanceActionWithSideEffect({
                actor: player,
                scene: scene,
                name: actionsText[0],
                narration: this.narration,
                sideEffect: (scene: Scene) => {
                    const revolver = this.buildRevolver();
                    scene
                        .getPlayer()!
                        .getInventory()
                        .loot(new Inventory({ weapons: [revolver] }));
                },
                nextSceneDecider: (scene: Scene) =>
                    this.buildOutsideTheStageCoach(scene.getPlayer()!),
            }),
        ]);
        return scene;
    }

    private buildRevolver(): Weapon {
        return new Weapon({
            name: 'revolver',
            type: 'revolver',
            damage: new Damage({ min: 1, max: 2 }),
            skill: 'aim',
            ammunition: new WeaponAmmunition({
                type: 'bullets',
                current: 6,
                max: 6,
            }),
        });
    }

    private async buildOutsideTheStageCoach(player: Actor): Promise<Scene> {
        const sceneTextsReader = new SceneTextsReader({
            sceneSetupFilePath: './outsideTheStageCoach.md',
            input: {
                playerName: player.getName(),
            },
        });
        const { setup, actionsText } = await sceneTextsReader.getTexts();
        const scene = new Scene({
            title: StageCoachActBuilder.TITLE,
            actors: [],
            player,
            setup,
            actions: [],
        });
        scene.setActions([
            new AdvanceAction({
                actor: player,
                scene: scene,
                name: actionsText[0],
                narration: this.narration,
                nextSceneDecider: (scene: Scene) =>
                    this.buildCombat(scene.getPlayer()!),
            }),
        ]);
        return scene;
    }

    private async buildCombat(player: Actor): Promise<Scene> {
        const scene = new Scene({
            title: StageCoachActBuilder.TITLE,
            actors: [this.buildScarredBrigand(), this.buildBrigand()],
            player,
            actions: [],
        });
        scene.setActions([
            new AdvanceAction({
                actor: player,
                scene: scene,
                narration: this.narration,
                nextSceneDecider: (scene: Scene) =>
                    this.buildAfterTheShootout(scene.getPlayer()!),
            }),
        ]);
        return scene;
    }

    private buildScarredBrigand(): NonPlayableActor {
        const rifle = this.buildRifle();
        rifle.getAmmunition()!.modify(-1);
        return new NonPlayableActor({
            name: 'Scarred brigand',
            health: new Health({ current: 2, max: 2 }),
            inventory: new Inventory({
                weapons: [rifle],
                ammunitionsByType: {
                    'big bullets': 4,
                },
            }),
            skillSet: new SkillSet({
                skills: [new Skill({ name: 'aim', probabilityOfSuccess: 0.4 })],
            }),
        });
    }

    private buildRifle(): Weapon {
        return new Weapon({
            name: 'one-shot rifle',
            type: 'rifle',
            damage: new Damage({ min: 2, max: 2 }),
            skill: 'aim',
            ammunition: new WeaponAmmunition({
                type: 'bit bullets',
                current: 1,
                max: 1,
            }),
        });
    }

    private buildBrigand(): NonPlayableActor {
        const rifle = this.buildRifle();
        return new NonPlayableActor({
            name: 'Brigand',
            health: new Health({ current: 2, max: 2 }),
            inventory: new Inventory({
                weapons: [rifle],
                ammunitionsByType: {
                    'Big bullets': 2,
                },
            }),
            skillSet: new SkillSet({
                skills: [new Skill({ name: 'aim', probabilityOfSuccess: 0.3 })],
            }),
        });
    }

    private async buildAfterTheShootout(player: Actor): Promise<Scene> {
        const sceneTextsReader = new SceneTextsReader({
            sceneSetupFilePath: './welcome.md',
            input: {
                playerName: player.getName(),
            },
        });
        const { setup, actionsText } = await sceneTextsReader.getTexts();
        const scene = new Scene({
            title: StageCoachActBuilder.TITLE,
            actors: [],
            player,
            setup,
            actions: [],
        });
        return scene;
    }
}

export default StageCoachActBuilder;
