import Actor from '../core/Actor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import Skill from '../core/Skill';
import SkillSet from '../core/SkillSet';
import ActorTemplateBuilder from './ActorTemplateBuilder';
import { ActorTemplate } from './SceneTemplate';

describe(ActorTemplateBuilder.name, () => {
    let actorTemplate: ActorTemplate;
    beforeEach(() => {
        const actor = new Actor({
            health: new Health({ current: 4, max: 6 }),
            name: 'roland',
            inventory: new Inventory({}),
            skillSet: new SkillSet({
                skills: [
                    new Skill({ name: 'aim', probabilityOfSuccess: 0.99 }),
                ],
            }),
        });
        actor.addFlag('gunslinger');
        const actorTemplateBuilder = new ActorTemplateBuilder({ actor });
        actorTemplate = actorTemplateBuilder.build();
    });

    it('sets the name', () => {
        expect(actorTemplate.name).toEqual('roland');
    });

    it('sets the health', () => {
        expect(actorTemplate.health).toEqual('4-6');
    });

    it('sets the skillset', () => {
        expect(actorTemplate.skills).toEqual({
            aim: 0.99,
        });
    });

    it('sets the flags', () => {
        expect(actorTemplate.flags).toEqual(['gunslinger']);
    });
});
