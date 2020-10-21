import Skill from './Skill';
import SkillSet from './SkillSet';

describe('SkillSet', () => {
    it('initializes without errors', () => {
        new SkillSet({});
    });

    describe('getSkill', () => {
        let skillSet: SkillSet;
        let charisma: Skill;
        beforeEach(() => {
            charisma = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
            });
            skillSet = new SkillSet({ skills: [charisma] });
        });

        it('returns the skill in the skill set', () => {
            const skill = skillSet.getSkill('charisma');
            expect(skill).toEqual(charisma);
        });

        it('throws an error if the requested skill is not in the skillset', () => {
            try {
                skillSet.getSkill('combat');
                fail('expected an error');
            } catch (err) {}
        });
    });
});
