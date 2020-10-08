import { Actor, ActorStatus, SkillName } from '../models';
import { isOpposedSkillCheckSuccessful } from './skill';

export const pacify = (actor: Actor, oponent: Actor): boolean => {
    if (oponent.is(ActorStatus.wild)) {
        return false;
    }
    if (
        isOpposedSkillCheckSuccessful(
            actor.getSkill(SkillName.charisma),
            oponent.getSkill(SkillName.charisma)
        )
    ) {
        oponent.remove(ActorStatus.hostile);
        return true;
    }
    return false;
};
