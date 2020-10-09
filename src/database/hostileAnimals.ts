import {
    ActorStatus,
    Health,
    Inventory,
    NonPlayableActor,
    Skill,
    SkillLevel,
    SkillName,
    Weapon,
} from '../models';

export class bear extends NonPlayableActor {
    constructor() {
        super(
            'bear',
            'offensive',
            new Health(8, 8),
            new Inventory('bear', [
                new Weapon(
                    'claws',
                    2,
                    3,
                    SkillName.closeCombat,
                    undefined,
                    true
                ),
            ]),
            [ActorStatus.hostile, ActorStatus.wild],
            [new Skill(SkillName.closeCombat, SkillLevel.good)]
        );
    }
}

export class wolf extends NonPlayableActor {
    constructor() {
        super(
            'wolf',
            'defensive',
            new Health(3, 3),
            new Inventory('wolf', [
                new Weapon(
                    'jaws',
                    1,
                    2,
                    SkillName.closeCombat,
                    undefined,
                    true
                ),
            ]),
            [ActorStatus.hostile, ActorStatus.wild],
            [new Skill(SkillName.closeCombat, SkillLevel.good)]
        );
    }
}

export class puma extends NonPlayableActor {
    constructor() {
        super(
            'puma',
            'offensive',
            new Health(3, 3),
            new Inventory('puma', [
                new Weapon(
                    'jaws',
                    1,
                    3,
                    SkillName.closeCombat,
                    undefined,
                    true
                ),
            ]),
            [ActorStatus.hostile, ActorStatus.wild],
            [new Skill(SkillName.closeCombat, SkillLevel.good)]
        );
    }
}
