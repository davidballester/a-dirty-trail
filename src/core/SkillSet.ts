import Skill from './Skill';

class SkillSet {
    private skills: { [name: string]: Skill };

    constructor({ skills = [] }: { skills?: Skill[] }) {
        this.skills = skills.reduce(
            (skillsMap, skill) => ({
                ...skillsMap,
                [skill.getName()]: skill,
            }),
            {}
        );
    }

    getSkill(name: string): Skill {
        const skill = this.skills[name];
        if (!skill) {
            throw new Error('unknown skill');
        }
        return skill;
    }

    getAll(): Skill[] {
        return Object.keys(this.skills).map((skillName) =>
            this.getSkill(skillName)
        );
    }
}

export default SkillSet;
