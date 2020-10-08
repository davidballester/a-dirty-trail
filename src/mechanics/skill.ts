import { Skill } from '../models';

export const isSkillSuccessful = (skill: Skill) => {
    const roll = Math.random();
    return roll < skill.level;
};

export const isOpposedSkillCheckSuccessful = (
    skill: Skill,
    opposingSkill: Skill
) => {
    const roll = Math.random();
    return roll < skill.level - opposingSkill.level;
};
