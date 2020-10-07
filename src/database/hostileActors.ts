import { generateAmmunition } from '../generators/ammunitions';
import { getActorChallengeRate } from '../mechanics/challengeRate';
import {
    Actor,
    ActorStatus,
    Health,
    Inventory,
    Skill,
    SkillLevel,
    SkillName,
} from '../models';
import { club, derringer, knife, revolver, rifle, shotgun } from './weapons';

export const duellist = new Actor(
    'duellist',
    new Health(2, 2),
    new Inventory('duellist', [revolver]),
    [ActorStatus.hostile],
    [new Skill(SkillName.distanceCombat, SkillLevel.master)]
);
duellist.inventory.items.push(
    generateAmmunition(
        revolver.ammunition!.name,
        getActorChallengeRate(duellist)
    )
);

export const marauder = new Actor(
    'marauder',
    new Health(4, 4),
    new Inventory('marauder', [knife]),
    [ActorStatus.hostile],
    [new Skill(SkillName.closeCombat, SkillLevel.mediocre)]
);

export const goon = new Actor(
    'goon',
    new Health(2, 2),
    new Inventory('goon', [club]),
    [ActorStatus.hostile],
    [new Skill(SkillName.closeCombat, SkillLevel.mediocre)]
);

export const robber = new Actor(
    'robber',
    new Health(2, 2),
    new Inventory('robber', [derringer]),
    [ActorStatus.hostile],
    [new Skill(SkillName.distanceCombat, SkillLevel.mediocre)]
);
robber.inventory.items.push(
    generateAmmunition(revolver.ammunition!.name, getActorChallengeRate(robber))
);

export const highwayman = new Actor(
    'highwayman',
    new Health(3, 3),
    new Inventory('highwayman', [rifle]),
    [ActorStatus.hostile],
    [new Skill(SkillName.distanceCombat, SkillLevel.good)]
);
highwayman.inventory.items.push(
    generateAmmunition(
        rifle.ammunition!.name,
        getActorChallengeRate(highwayman)
    )
);

export const lunatic = new Actor(
    'lunatic',
    new Health(1, 1),
    new Inventory('lunatic', [shotgun, knife]),
    [ActorStatus.hostile, ActorStatus.wild],
    [
        new Skill(SkillName.distanceCombat, SkillLevel.mediocre),
        new Skill(SkillName.closeCombat, SkillLevel.good),
    ]
);
lunatic.inventory.items.push(
    generateAmmunition(shotgun.ammunition!.name, getActorChallengeRate(lunatic))
);

export const brigand = new Actor(
    'brigand',
    new Health(3, 3),
    new Inventory('brigand', [shotgun, knife]),
    [ActorStatus.hostile, ActorStatus.wild],
    [
        new Skill(SkillName.distanceCombat, SkillLevel.mediocre),
        new Skill(SkillName.closeCombat, SkillLevel.good),
    ]
);
brigand.inventory.items.push(
    generateAmmunition(shotgun.ammunition!.name, getActorChallengeRate(brigand))
);

export const nightReaver = new Actor(
    'night reaver',
    new Health(5, 5),
    new Inventory('night reaver', [shotgun, rifle, knife]),
    [ActorStatus.hostile, ActorStatus.wild],
    [
        new Skill(SkillName.distanceCombat, SkillLevel.good),
        new Skill(SkillName.closeCombat, SkillLevel.good),
    ]
);
nightReaver.inventory.items.push(
    generateAmmunition(
        shotgun.ammunition!.name,
        getActorChallengeRate(nightReaver)
    ),
    generateAmmunition(
        rifle.ammunition!.name,
        getActorChallengeRate(nightReaver)
    )
);
