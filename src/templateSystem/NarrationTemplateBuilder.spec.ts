import Actor from '../core/Actor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import Narration from '../core/Narration';
import Scene from '../core/Scene';
import SkillSet from '../core/SkillSet';
import { NarrationTemplate } from './NarrationTemplate';
import NarrationTemplateBuilder from './NarrationTemplateBuilder';

describe(NarrationTemplateBuilder.name, () => {
    let narrationTemplate: NarrationTemplate;
    beforeEach(() => {
        const player = new Actor({
            name: 'Roland',
            health: new Health({ current: 4, max: 6 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        const scene = new Scene({
            id: 'foo',
            actions: [],
            actors: [],
            player,
            title: 'The desert',
            setup:
                'The man in black fled across the desert and the gunslinger followed.',
        });
        const narration = new Narration({ title: 'The gunslinger' });
        narration.setCurrentScene(scene);
        const narrationTemplateBuilder = new NarrationTemplateBuilder({
            narration,
        });
        narrationTemplate = narrationTemplateBuilder.build();
    });

    it('sets the title', () => {
        expect(narrationTemplate.title).toEqual('The gunslinger');
    });

    it('sets the scene title', () => {
        expect(narrationTemplate.currentSceneTitle).toEqual('The desert');
    });
});
