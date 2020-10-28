import NonPlayableActorBuilder from './NonPlayableActorBuilder';
import SceneTemplate from './SceneTemplate';
import { v4 as uuidv4 } from 'uuid';
import NonPlayableActor from '../core/NonPlayableActor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import Firearm from '../core/Firearm';
import Damage from '../core/Damage';
import WeaponAmmunition from '../core/WeaponAmmunition';
import SkillSet from '../core/SkillSet';
import Skill from '../core/Skill';
jest.mock('uuid');

describe(NonPlayableActorBuilder.name, () => {
    let nonPlayableActorBuilder: NonPlayableActorBuilder;
    let sceneTemplate: SceneTemplate;
    beforeEach(() => {
        const uuidv4Mock = (uuidv4 as unknown) as jest.Mock;
        uuidv4Mock.mockReturnValue(undefined);
        sceneTemplate = ({
            metadata: {
                actors: {
                    'Scarred brigand': {
                        health: '1-2',
                        inventory: {
                            ammunitions: {
                                'big bullets': 4,
                            },
                            weapons: {
                                'One-shot rifle': {
                                    type: 'rifle',
                                    damage: '1-2',
                                    skill: 'aim',
                                    ammunitionType: 'big bullets',
                                    ammunition: '0-1',
                                },
                            },
                        },
                        skills: {
                            aim: 0.4,
                        },
                    },
                },
            },
        } as unknown) as SceneTemplate;
        nonPlayableActorBuilder = new NonPlayableActorBuilder({
            sceneTemplate,
        });
    });

    describe('build', () => {
        it('builds a non playable actor', () => {
            const actors = nonPlayableActorBuilder.build();
            expect(actors).toEqual([
                new NonPlayableActor({
                    name: 'Scarred brigand',
                    health: new Health({ current: 1, max: 2 }),
                    inventory: new Inventory({
                        ammunitionsByType: { 'big bullets': 4 },
                        weapons: [
                            new Firearm({
                                name: 'One-shot rifle',
                                type: 'rifle',
                                damage: new Damage({ min: 1, max: 2 }),
                                skill: 'aim',
                                ammunition: new WeaponAmmunition({
                                    type: 'big bullets',
                                    current: 0,
                                    max: 1,
                                }),
                            }),
                        ],
                    }),
                    skillSet: new SkillSet({
                        skills: [
                            new Skill({
                                name: 'aim',
                                probabilityOfSuccess: 0.4,
                            }),
                        ],
                    }),
                }),
            ]);
        });
    });
});
