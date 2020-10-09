import { generateAmmunition } from './ammunitions';
import { getActorChallengeRate } from '../mechanics/challengeRate';
import {
    ActorStatus,
    Health,
    Inventory,
    NonPlayableActor,
    Skill,
    SkillLevel,
    SkillName,
} from '../models';
import { club, derringer, knife, revolver, rifle, shotgun } from './weapons';

// CR: 2.62
export class Duellist extends NonPlayableActor {
    constructor() {
        super(
            'duellist',
            'offensive',
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
export class Marauder extends NonPlayableActor {
    constructor() {
        super(
            'marauder',
            'defensive',
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
export class Goon extends NonPlayableActor {
    constructor() {
        super(
            'goon',
            'offensive',
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
export class Robber extends NonPlayableActor {
    constructor() {
        super(
            'robber',
            'defensive',
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
export class Highwayman extends NonPlayableActor {
    constructor() {
        super(
            'highwayman',
            'defensive',
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
export class Lunatic extends NonPlayableActor {
    constructor() {
        super(
            'lunatic',
            'offensive',
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
export class Brigand extends NonPlayableActor {
    constructor() {
        super(
            'brigand',
            'defensive',
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
export class NightReaver extends NonPlayableActor {
    constructor() {
        super(
            'night reaver',
            'offensive',
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
