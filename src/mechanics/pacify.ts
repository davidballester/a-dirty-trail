import { Actor, ActorStatus } from './actor';
import { SkillName } from './skill';

export const pacify = (actor: Actor, oponent: Actor): boolean => {
    if (oponent.is(ActorStatus.wild)) {
        return false;
    }
    if (actor.getSkill(SkillName.pacify).isSuccessful()) {
        oponent.remove(ActorStatus.hostile);
        return true;
    }
    return false;
};
