import SceneTemplate, {
    SceneTemplateActor,
    SceneTemplateActorInventory,
    SceneTemplateWeapon,
} from './SceneTemplate';
import NonPlayableActor from '../core/NonPlayableActor';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import Skill from '../core/Skill';
import Weapon from '../core/Weapon';
import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import WeaponAmmunition from '../core/WeaponAmmunition';

class NonPlayableActorBuilder {
    private actors: { [key: string]: SceneTemplateActor };

    constructor({ sceneTemplate }: { sceneTemplate: SceneTemplate }) {
        this.actors = sceneTemplate.metadata.actors || {};
    }

    build(): NonPlayableActor[] {
        return Object.keys(this.actors).map((actorName) =>
            this.buildActor(actorName, this.actors[actorName])
        );
    }

    private buildActor(
        name: string,
        actorTemplate: SceneTemplateActor
    ): NonPlayableActor {
        return new NonPlayableActor({
            name,
            health: this.buildHealth(actorTemplate.health),
            inventory: this.buildInventory(actorTemplate.inventory),
            skillSet: this.buildSkillSet(actorTemplate.skills),
        });
    }

    private buildHealth(rule: string): Health {
        const [current, max] = rule.split('-');
        return new Health({ current: parseInt(current), max: parseInt(max) });
    }

    private buildInventory(
        inventoryTemplate: SceneTemplateActorInventory
    ): Inventory {
        const weapons = this.buildWeapons(inventoryTemplate.weapons);
        return new Inventory({
            ammunitionsByType: inventoryTemplate.ammunitions,
            weapons,
        });
    }

    private buildWeapons(weaponsTemplate: {
        [name: string]: SceneTemplateWeapon;
    }): Weapon[] {
        return Object.keys(weaponsTemplate).map((weaponName) =>
            this.buildWeapon(weaponName, weaponsTemplate[weaponName])
        );
    }

    private buildWeapon(
        name: string,
        weaponTemplate: SceneTemplateWeapon
    ): Weapon {
        const [minDamage, maxDamage] = weaponTemplate.damage.split('-');
        const damage = new Damage({
            min: parseInt(minDamage),
            max: parseInt(maxDamage),
        });
        if (weaponTemplate.ammunitionType && weaponTemplate.ammunition) {
            const [current, max] = weaponTemplate.ammunition.split('-');
            return new Firearm({
                name,
                damage,
                type: weaponTemplate.type,
                skill: weaponTemplate.skill,
                ammunition: new WeaponAmmunition({
                    type: weaponTemplate.ammunitionType,
                    current: parseInt(current),
                    max: parseInt(max),
                }),
            });
        }
        return new Weapon({
            name,
            damage,
            type: weaponTemplate.type,
            skill: weaponTemplate.skill,
        });
    }

    private buildSkillSet(skills: { [name: string]: number }): SkillSet {
        return new SkillSet({
            skills: Object.keys(skills).map(
                (skillName) =>
                    new Skill({
                        name: skillName,
                        probabilityOfSuccess: skills[skillName],
                    })
            ),
        });
    }
}

export default NonPlayableActorBuilder;
