import {
    Actor,
    Ammunition,
    Health,
    Inventory,
    Skill,
    SkillLevel,
    SkillName,
} from '../../../models';
import { club, revolver } from '../../weapons';

const theVagabondInventory = new Inventory('the vagabond');
theVagabondInventory.items.push(revolver);
theVagabondInventory.items.push(
    new Ammunition(revolver.ammunition!.name, 6, 50)
);
theVagabondInventory.items.push(club);
const theVagabond = new Actor(
    'the vagabond',
    new Health(4, 5),
    theVagabondInventory,
    [],
    [
        new Skill(SkillName.distanceCombat, SkillLevel.mediocre),
        new Skill(SkillName.closeCombat, SkillLevel.good),
        new Skill(SkillName.charisma, SkillLevel.good),
    ]
);

export default theVagabond;
