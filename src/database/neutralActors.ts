import { getActorChallengeRate } from '../mechanics/challengeRate';
import {
    Actor,
    Health,
    Inventory,
    Skill,
    SkillLevel,
    SkillName,
} from '../models';
import { knife, revolver, rifle } from './weapons';

export const farmer = new Actor(
    'farmer',
    new Health(2, 2),
    new Inventory('farmer', [rifle]),
    [],
    [new Skill(SkillName.distanceCombat, SkillLevel.mediocre)]
);

export const traveler = new Actor(
    'traveler',
    new Health(2, 2),
    new Inventory('traveler', [revolver]),
    [],
    [new Skill(SkillName.distanceCombat, SkillLevel.mediocre)]
);

export const pilgrim = new Actor(
    'pilgrim',
    new Health(1, 1),
    new Inventory('pilgrim', [knife]),
    [],
    [new Skill(SkillName.closeCombat, SkillLevel.poor)]
);

export const gambler = new Actor(
    'gambler',
    new Health(2, 2),
    new Inventory('gambler', [revolver]),
    [],
    [new Skill(SkillName.distanceCombat, SkillLevel.mediocre)]
);

export const villager = new Actor(
    'villager',
    new Health(2, 2),
    new Inventory('villager', [revolver]),
    [],
    [new Skill(SkillName.distanceCombat, SkillLevel.mediocre)]
);

console.log('farmer', getActorChallengeRate(farmer));
console.log('traveler', getActorChallengeRate(traveler));
console.log('pilgrim', getActorChallengeRate(pilgrim));
console.log('gambler', getActorChallengeRate(gambler));
console.log('villager', getActorChallengeRate(villager));
