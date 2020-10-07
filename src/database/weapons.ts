import { Ammunition, SkillName, Weapon } from '../models';

// Close combat weapons
export const knife = new Weapon('knife', 1, 1, SkillName.closeCombat);
export const club = new Weapon('club', 0, 1, SkillName.closeCombat);

// Ranged weapons
export const derringer = new Weapon(
    'derringer',
    1,
    2,
    SkillName.distanceCombat,
    new Ammunition('bullets', 2, 2)
);

export const revolver = new Weapon(
    'revolver',
    1,
    3,
    SkillName.distanceCombat,
    new Ammunition('bullets', 6, 6)
);

export const rifle = new Weapon(
    'rifle',
    2,
    3,
    SkillName.distanceCombat,
    new Ammunition('bullets', 7, 7)
);

export const shotgun = new Weapon(
    'shotgun',
    2,
    5,
    SkillName.distanceCombat,
    new Ammunition('shells', 2, 2)
);
