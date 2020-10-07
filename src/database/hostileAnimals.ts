import {
    Actor,
    ActorStatus,
    Health,
    Inventory,
    Skill,
    SkillLevel,
    SkillName,
    Weapon,
} from '../models';

export const bear = new Actor(
    'bear',
    new Health(8, 8),
    new Inventory('bear', [
        new Weapon('claws', 2, 3, SkillName.closeCombat, undefined, true),
    ]),
    [ActorStatus.hostile, ActorStatus.wild],
    [new Skill(SkillName.closeCombat, SkillLevel.good)]
);

export const wolf = new Actor(
    'wolf',
    new Health(3, 3),
    new Inventory('wolf', [
        new Weapon('jaws', 1, 2, SkillName.closeCombat, undefined, true),
    ]),
    [ActorStatus.hostile, ActorStatus.wild],
    [new Skill(SkillName.closeCombat, SkillLevel.good)]
);

export const puma = new Actor(
    'puma',
    new Health(3, 3),
    new Inventory('puma', [
        new Weapon('jaws', 1, 3, SkillName.closeCombat, undefined, true),
    ]),
    [ActorStatus.hostile, ActorStatus.wild],
    [new Skill(SkillName.closeCombat, SkillLevel.good)]
);
