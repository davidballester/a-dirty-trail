import { Actor, ActorStatus, SkillName } from '../models';
import { isSkillSuccessful } from './skill';

export const pacify = (actor: Actor, oponent: Actor): boolean => {
    if (oponent.is(ActorStatus.wild)) {
        return false;
    }
    if (isSkillSuccessful(actor.getSkill(SkillName.pacify))) {
        oponent.remove(ActorStatus.hostile);
        return true;
    }
    return false;
};
