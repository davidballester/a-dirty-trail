export enum SkillName {
    pacify,
    distanceCombat,
    closeCombat,
}

export const allSkills = [
    SkillName.pacify,
    SkillName.distanceCombat,
    SkillName.closeCombat,
];

export const getSkillName = (string: string): SkillName => {
    switch (string) {
        case 'pacify': {
            return SkillName.pacify;
        }
        case 'distanceCombat': {
            return SkillName.distanceCombat;
        }
        default: {
            return SkillName.closeCombat;
        }
    }
};

export enum SkillLevel {
    poor,
    mediocre,
    good,
    master,
}

export class Skill {
    name: SkillName;
    level: SkillLevel;

    constructor(name: SkillName, level: SkillLevel) {
        this.name = name;
        this.level = level;
    }

    isSuccessful(): boolean {
        const roll = Math.random();
        switch (this.level) {
            case SkillLevel.poor: {
                return roll < 0.05;
            }
            case SkillLevel.mediocre: {
                return roll < 0.3;
            }
            case SkillLevel.good: {
                return roll < 0.6;
            }
            case SkillLevel.master: {
                return roll < 0.9;
            }
        }
    }
}
