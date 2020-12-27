import AttackAction from '../actions/AttackAction';
import Actor from '../core/Actor';
import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import Skill from '../core/Skill';
import SkillSet from '../core/SkillSet';
import Weapon from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';
import CombatSceneEngine from './CombatSceneEngine';

describe('combat simulation', () => {
    let combatSceneEngine: CombatSceneEngine;
    let roland: Actor;
    beforeEach(() => {
        roland = new Actor({
            name: 'Roland',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({
                weapons: [
                    new Weapon({
                        name: 'knife',
                        type: 'knife',
                        skill: 'stab',
                        damage: new Damage({ min: 1, max: 1 }),
                    }),
                    new Firearm({
                        name: 'revolver',
                        type: 'revolver',
                        skill: 'aim',
                        damage: new Damage({ min: 2, max: 3 }),
                        ammunition: new WeaponAmmunition({
                            type: 'bullets',
                            current: 6,
                            max: 6,
                        }),
                    }),
                ],
                ammunitionsByType: {
                    bullets: 12,
                },
            }),
            skillSet: new SkillSet({
                skills: [
                    new Skill({ name: 'stab', probabilityOfSuccess: 0.5 }),
                    new Skill({ name: 'aim', probabilityOfSuccess: 0.9 }),
                ],
            }),
        });
        const slowMutants = new Array(5).fill(undefined).map(
            (_, index) =>
                new NonPlayableActor({
                    name: `Slow mutant ${index}`,
                    health: new Health({ current: 2, max: 2 }),
                    inventory: new Inventory({
                        weapons: [
                            new Weapon({
                                name: 'claws',
                                type: 'claws',
                                canBeLooted: false,
                                skill: 'claw',
                                damage: new Damage({ min: 1, max: 2 }),
                            }),
                        ],
                    }),
                    skillSet: new SkillSet({
                        skills: [
                            new Skill({
                                name: 'claw',
                                probabilityOfSuccess: 0.5,
                            }),
                        ],
                    }),
                })
        );
        const scene = new Scene({
            id: 'combat',
            player: roland,
            title: 'Combat',
            actors: slowMutants,
            actions: [],
        });
        combatSceneEngine = new CombatSceneEngine({ scene });
    });

    it('does not fail', () => {
        while (!combatSceneEngine.isCombatOver()) {
            if (!combatSceneEngine.isPlayerTurn()) {
                combatSceneEngine.executeNextOponentAction();
            } else {
                const playerActions = combatSceneEngine.getPlayerActions();
                const attackActions = playerActions.getActionsOfType(
                    AttackAction.TYPE
                );
                const attackAction =
                    attackActions[
                        Math.floor(Math.random() * attackActions.length)
                    ];
                combatSceneEngine.executePlayerAction(attackAction);
            }
        }
    });
});
