import { v4 as uuidv4 } from 'uuid';
import { SceneGenerator } from './world/scenes';

export class Item {
    id: string;
    name: string;

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
    }
}

export class Inventory {
    id: string;
    name: string;
    items: Item[];

    constructor(name: string, items: Item[] = []) {
        this.id = uuidv4();
        this.name = name;
        this.items = items;
    }

    removeItem(id: string) {
        this.items = this.items.filter((item) => item.id !== id);
    }
}

export class Ammunition extends Item {
    quantity: number;
    maxAmmunition: number;

    constructor(name: string, quantity: number, maxAmmunition: number) {
        super(name);
        this.quantity = quantity;
        this.maxAmmunition = maxAmmunition;
    }

    modifyAmmunition(delta: number) {
        this.quantity += delta;
        this.quantity = Math.max(0, this.quantity);
        this.quantity = Math.min(this.maxAmmunition, this.quantity);
    }

    isSpent(): boolean {
        return this.quantity === 0;
    }
}

export class Weapon extends Item {
    static outOfAmmunitionErrorKey = 'out-of-ammunition';

    minDamage: number;
    maxDamage: number;
    skillName: SkillName;
    ammunition?: Ammunition;

    constructor(
        name: string,
        minDamage: number,
        maxDamage: number,
        skillName: SkillName,
        ammunition?: Ammunition
    ) {
        super(name);
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
        this.skillName = skillName;
        this.ammunition = ammunition;
    }
}

export enum AttackOutcomeStatus {
    missed,
    outOfAmmo,
    hit,
    oponentDead,
}

export interface AttackOutcome {
    status: AttackOutcomeStatus;
    damage?: number;
}

export enum ActorStatus {
    hostile,
    wild,
}

export const getActorStatus = (string: string): ActorStatus => {
    switch (string) {
        case 'hostile': {
            return ActorStatus.hostile;
        }
        default: {
            return ActorStatus.wild;
        }
    }
};

export class Health {
    currentHitpoints: number;
    maxHitpoints: number;

    constructor(currentHitpoints: number, maxHitpoints: number) {
        this.maxHitpoints = maxHitpoints;
        this.currentHitpoints = currentHitpoints;
    }

    isAlive() {
        return this.currentHitpoints > 0;
    }

    modifyHitpoints(delta: number) {
        this.currentHitpoints += delta;
        this.currentHitpoints = Math.min(
            this.currentHitpoints,
            this.maxHitpoints
        );
        this.currentHitpoints = Math.max(this.currentHitpoints, 0);
    }
}

export class Actor {
    id: string;
    name: string;
    health: Health;
    inventory: Inventory;
    status: ActorStatus[];
    skills: Skill[];

    constructor(
        name: string,
        health: Health,
        inventory: Inventory,
        status: ActorStatus[] = [],
        skills: Skill[] = []
    ) {
        this.id = uuidv4();
        this.name = name;
        this.health = health;
        this.inventory = inventory;
        this.status = status;
        this.skills = skills;
    }

    isAlive(): boolean {
        return this.health.isAlive();
    }

    is(status: ActorStatus): boolean {
        return this.status.indexOf(status) >= 0;
    }

    set(status: ActorStatus) {
        if (!this.is(status)) {
            this.status.push(status);
        }
    }

    remove(status: ActorStatus) {
        this.status = this.status.filter((s) => s !== status);
    }

    getSkill(name: SkillName): Skill {
        return this.skills.find((skill) => skill.name === name)!;
    }
}

export class Scene {
    id: string;
    name: string;
    actors: Actor[];
    containers: Inventory[];
    scenary: string[];

    constructor(
        name: string,
        actors: Actor[] = [],
        containers: Inventory[] = [],
        scenary: string[] = []
    ) {
        this.id = uuidv4();
        this.name = name;
        this.actors = actors;
        this.containers = containers;
        this.scenary = scenary;
    }
}

export enum SkillName {
    pacify,
    distanceCombat,
    closeCombat,
}

export const allSkills = [
    SkillName.pacify,
    SkillName.distanceCombat,
    SkillName.closeCombat,
];

export const getSkillName = (string: string): SkillName => {
    switch (string) {
        case 'pacify': {
            return SkillName.pacify;
        }
        case 'distanceCombat': {
            return SkillName.distanceCombat;
        }
        default: {
            return SkillName.closeCombat;
        }
    }
};

export enum SkillLevel {
    poor,
    mediocre,
    good,
    master,
}

export class Skill {
    name: SkillName;
    level: SkillLevel;

    constructor(name: SkillName, level: SkillLevel) {
        this.name = name;
        this.level = level;
    }
}

export abstract class Action<OutcomeType> {
    player: Actor;
    constructor(player: Actor) {
        this.player = player;
    }
    abstract getName(): string;
}

export class AttackAction extends Action<AttackOutcome> {
    weapon: Weapon;
    oponent: Actor;

    constructor(player: Actor, weapon: Weapon, oponent: Actor) {
        super(player);
        this.weapon = weapon;
        this.oponent = oponent;
    }

    getName() {
        return `Attack ${this.oponent.name}`;
    }
}

export class ReloadAction extends Action<boolean> {
    weapon: Weapon;
    ammunition: Ammunition;

    constructor(player: Actor, weapon: Weapon, ammunition: Ammunition) {
        super(player);
        this.weapon = weapon;
        this.ammunition = ammunition;
    }

    getName() {
        return `Reload ${this.ammunition.name} into ${this.weapon.name}`;
    }
}

export class PacifyAction extends Action<boolean> {
    oponent: Actor;

    constructor(player: Actor, oponent: Actor) {
        super(player);
        this.oponent = oponent;
    }

    getName() {
        return `Pacify ${this.oponent.name}`;
    }
}

export class LootAction extends Action<void> {
    inventory: Inventory;

    constructor(player: Actor, inventory: Inventory) {
        super(player);
        this.inventory = inventory;
    }

    getName() {
        return `Loot ${this.inventory.name}`;
    }
}

export class LeaveAction extends Action<Scene> {
    sceneGenerator: SceneGenerator;

    constructor(player: Actor, sceneGenerator: SceneGenerator) {
        super(player);
        this.sceneGenerator = sceneGenerator;
    }

    getName() {
        return 'Leave';
    }
}
