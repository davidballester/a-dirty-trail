import { generateAmmunition } from './ammunitions';
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

// CR: 2.62
export class Duellist extends Actor {
    constructor() {
        super(
            'duellist',
            new Health(2, 2),
            new Inventory('duellist', [revolver]),
            [ActorStatus.hostile],
            [
                new Skill(SkillName.distanceCombat, SkillLevel.master),
                new Skill(SkillName.charisma, SkillLevel.good),
            ]
        );
        this.inventory.items.push(
            generateAmmunition(
                revolver.ammunition!.name,
                getActorChallengeRate(this)
            )
        );
    }
}

// CR: 2.5
export class Marauder extends Actor {
    constructor() {
        super(
            'marauder',
            new Health(4, 4),
            new Inventory('marauder', [knife]),
            [ActorStatus.hostile],
            [
                new Skill(SkillName.closeCombat, SkillLevel.mediocre),
                new Skill(SkillName.charisma, SkillLevel.mediocre),
            ]
        );
    }
}

// CR: 1.25
export class Goon extends Actor {
    constructor() {
        super(
            'goon',
            new Health(2, 2),
            new Inventory('goon', [club]),
            [ActorStatus.hostile],
            [
                new Skill(SkillName.closeCombat, SkillLevel.mediocre),
                new Skill(SkillName.charisma, SkillLevel.poor),
            ]
        );
    }
}

// CR: 1.5
export class Robber extends Actor {
    constructor() {
        super(
            'robber',
            new Health(2, 2),
            new Inventory('robber', [derringer]),
            [ActorStatus.hostile],
            [
                new Skill(SkillName.distanceCombat, SkillLevel.mediocre),
                new Skill(SkillName.charisma, SkillLevel.poor),
            ]
        );
        this.inventory.items.push(
            generateAmmunition(
                revolver.ammunition!.name,
                getActorChallengeRate(this)
            )
        );
    }
}

// CR: 3.14
export class Highwayman extends Actor {
    constructor() {
        super(
            'highwayman',
            new Health(3, 3),
            new Inventory('highwayman', [rifle]),
            [ActorStatus.hostile],
            [
                new Skill(SkillName.distanceCombat, SkillLevel.good),
                new Skill(SkillName.charisma, SkillLevel.mediocre),
            ]
        );
        this.inventory.items.push(
            generateAmmunition(
                rifle.ammunition!.name,
                getActorChallengeRate(this)
            )
        );
    }
}

// CR: 1.66
export class Lunatic extends Actor {
    constructor() {
        super(
            'lunatic',
            new Health(1, 1),
            new Inventory('lunatic', [shotgun, knife]),
            [ActorStatus.hostile, ActorStatus.wild],
            [
                new Skill(SkillName.distanceCombat, SkillLevel.mediocre),
                new Skill(SkillName.closeCombat, SkillLevel.good),
            ]
        );
        this.inventory.items.push(
            generateAmmunition(
                shotgun.ammunition!.name,
                getActorChallengeRate(this)
            )
        );
    }
}

// CR: 2.66
export class Brigand extends Actor {
    constructor() {
        super(
            'brigand',
            new Health(3, 3),
            new Inventory('brigand', [shotgun, knife]),
            [ActorStatus.hostile, ActorStatus.wild],
            [
                new Skill(SkillName.distanceCombat, SkillLevel.mediocre),
                new Skill(SkillName.closeCombat, SkillLevel.good),
            ]
        );
        this.inventory.items.push(
            generateAmmunition(
                shotgun.ammunition!.name,
                getActorChallengeRate(this)
            )
        );
    }
}

// CR: 4.25
export class NightReaver extends Actor {
    constructor() {
        super(
            'night reaver',
            new Health(5, 5),
            new Inventory('night reaver', [shotgun, rifle, knife]),
            [ActorStatus.hostile, ActorStatus.wild],
            [
                new Skill(SkillName.distanceCombat, SkillLevel.good),
                new Skill(SkillName.closeCombat, SkillLevel.good),
            ]
        );
        this.inventory.items.push(
            generateAmmunition(
                shotgun.ammunition!.name,
                getActorChallengeRate(this)
            ),
            generateAmmunition(
                rifle.ammunition!.name,
                getActorChallengeRate(this)
            )
        );
    }
}
