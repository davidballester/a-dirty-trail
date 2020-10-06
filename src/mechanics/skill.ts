import { Skill, SkillLevel } from '../models';

export const isSkillSuccessful = (skill: Skill) => {
    const roll = Math.random();
    switch (skill.level) {
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
};
