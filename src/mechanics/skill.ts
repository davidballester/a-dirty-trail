import { Skill } from '../models';

export const isSkillSuccessful = (skill: Skill) => {
    const roll = Math.random();
    return roll < skill.level;
};
