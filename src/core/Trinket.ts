import ThingWithId from './ThingWithId';

class Trinket extends ThingWithId {
    private name: string;
    private description?: string;
    private skillsModifiers: SkillsModifiers;

    constructor({
        name,
        description,
        skillsModifiers = {},
    }: {
        name: string;
        description?: string;
        skillsModifiers?: SkillsModifiers;
    }) {
        super();
        this.name = name;
        this.description = description;
        this.skillsModifiers = skillsModifiers;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getSkillsModifiers(): SkillsModifiers {
        return this.skillsModifiers;
    }
}

export default Trinket;

export type SkillsModifiers = { [skillName: string]: number };
