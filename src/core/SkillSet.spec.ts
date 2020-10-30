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
            expect(() => skillSet.getSkill('combat')).toThrow();
        });
    });

    describe('getAll', () => {
        let aim: Skill;
        let stab: Skill;
        let skillSet: SkillSet;
        beforeEach(() => {
            aim = new Skill({ name: 'aim', probabilityOfSuccess: 0.47 });
            stab = new Skill({ name: 'stab', probabilityOfSuccess: 0.81 });
            skillSet = new SkillSet({ skills: [aim, stab] });
        });

        it('returns all the skills', () => {
            const returnedSkills = skillSet.getAll();
            expect(returnedSkills).toEqual([aim, stab]);
        });
    });
});
