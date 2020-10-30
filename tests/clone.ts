import Actor from '../src/core/Actor';
import Damage from '../src/core/Damage';
import Firearm from '../src/core/Firearm';
import Health from '../src/core/Health';
import Inventory from '../src/core/Inventory';
import NonPlayableActor from '../src/core/NonPlayableActor';
import Scene from '../src/core/Scene';
import Trinket from '../src/core/Trinket';
import Weapon from '../src/core/Weapon';
import WeaponAmmunition from '../src/core/WeaponAmmunition';

export const cloneScene = (scene: Scene): Scene => {
    return new Scene({
        player: cloneActor(scene.getPlayer()),
        actions: scene.getActions(),
        actors: scene.getActors().map(cloneNonPlayableActor),
        title: scene.getTitle(),
        setup: scene.getSetup(),
    });
};

const cloneActor = (actor: Actor) => {
    return new Actor({
        name: actor.getName(),
        health: cloneHealth(actor.getHealth()),
        inventory: cloneInventory(actor.getInventory()),
        skillSet: actor.getSkillSet(),
    });
};

const cloneHealth = (health: Health) => {
    return new Health({
        current: health.getCurrent(),
        max: health.getMax(),
    });
};

const cloneInventory = (inventory: Inventory) => {
    return new Inventory({
        weapons: inventory.getWeapons().map(cloneWeapon),
        ammunitionsByType: {
            ...inventory.getAmmunitionsByType(),
        },
        trinkets: inventory.getTrinkets().map(cloneTrinket),
    });
};

const cloneWeapon = (weapon: Weapon) => {
    if (weapon instanceof Firearm) {
        return cloneFirearm(weapon);
    }
    return new Weapon({
        name: weapon.getName(),
        damage: cloneDamage(weapon.getDamage()),
        skill: weapon.getSkill(),
        type: weapon.getType(),
    });
};

const cloneFirearm = (firearm: Firearm) => {
    return new Firearm({
        name: firearm.getName(),
        damage: cloneDamage(firearm.getDamage()),
        skill: firearm.getSkill(),
        type: firearm.getType(),
        ammunition: cloneAmmunition(firearm.getAmmunition()),
    });
};

const cloneDamage = (damage: Damage) => {
    return new Damage({
        min: damage.getMin(),
        max: damage.getMax(),
    });
};

const cloneAmmunition = (weaponAmmunition: WeaponAmmunition) => {
    return new WeaponAmmunition({
        type: weaponAmmunition.getType(),
        current: weaponAmmunition.getCurrent(),
        max: weaponAmmunition.getMax(),
    });
};

const cloneTrinket = (trinket: Trinket) => {
    return new Trinket({ name: trinket.getName() });
};

const cloneNonPlayableActor = (nonPlayableActor: NonPlayableActor) => {
    return new NonPlayableActor({
        name: nonPlayableActor.getName(),
        health: cloneHealth(nonPlayableActor.getHealth()),
        inventory: cloneInventory(nonPlayableActor.getInventory()),
        skillSet: nonPlayableActor.getSkillSet(),
    });
};
