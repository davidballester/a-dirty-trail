import { v4 as uuidv4 } from 'uuid';

export class Item {
    id: string;
    name: string;
    untransferable: boolean;

    constructor(name: string, untransferable = false) {
        this.id = uuidv4();
        this.name = name;
        this.untransferable = untransferable;
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

    removeUntransferableItems() {
        this.items = this.items.filter((item) => !item.untransferable);
    }

    getWeapons() {
        return this.items.filter((item) => item instanceof Weapon) as Weapon[];
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
    minDamage: number;
    maxDamage: number;
    skillName: SkillName;
    ammunition?: Ammunition;

    constructor(
        name: string,
        minDamage: number,
        maxDamage: number,
        skillName: SkillName,
        ammunition?: Ammunition,
        untransferable = false
    ) {
        super(name, untransferable);
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

export const getActorStatus = (string: string) => {
    switch (string) {
        case 'hostile': {
            return ActorStatus.hostile;
        }
        case 'wild': {
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

export type CombatStategry = 'offensive' | 'defensive';
export class NonPlayableActor extends Actor {
    combatStrategy: CombatStategry;
    constructor(
        name: string,
        combatStategry: CombatStategry,
        health: Health,
        inventory: Inventory,
        status: ActorStatus[] = [],
        skills: Skill[] = []
    ) {
        super(name, health, inventory, status, skills);
        this.combatStrategy = combatStategry;
    }
}

export class Scene {
    id: string;
    name: string;
    setup: string[];
    actors: NonPlayableActor[];
    containers: Inventory[];
    actions: Action[];

    constructor({
        name,
        setup,
        actors = [],
        containers = [],
        actions = [],
    }: {
        name: string;
        setup: string[];
        actors?: NonPlayableActor[];
        containers?: Inventory[];
        actions?: Action[];
    }) {
        this.id = uuidv4();
        this.name = name;
        this.setup = setup;
        this.actors = actors;
        this.containers = containers;
        this.actions = actions;
    }

    getHostileActors() {
        return (this.actors || ([] as NonPlayableActor[])).filter((actor) =>
            actor.is(ActorStatus.hostile)
        );
    }
}

export enum SkillName {
    charisma,
    distanceCombat,
    closeCombat,
}

export const allSkills = [
    SkillName.charisma,
    SkillName.distanceCombat,
    SkillName.closeCombat,
];

export const getSkillName = (string: string): SkillName => {
    switch (string) {
        case 'charisma': {
            return SkillName.charisma;
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
    poor = 0.25,
    mediocre = 0.5,
    good = 0.75,
    master = 0.95,
}

export class Skill {
    name: SkillName;
    level: SkillLevel;

    constructor(name: SkillName, level: SkillLevel) {
        this.name = name;
        this.level = level;
    }
}

export abstract class Action {
    id: string;
    player: Actor;
    constructor(player: Actor) {
        this.id = uuidv4();
        this.player = player;
    }
    abstract getName(): string;
}

export class AttackAction extends Action {
    weapon: Weapon;
    oponent: Actor;

    constructor(player: Actor, weapon: Weapon, oponent: Actor) {
        super(player);
        this.weapon = weapon;
        this.oponent = oponent;
    }

    getName() {
        return `Attack ${this.oponent.name} with ${this.weapon.name}`;
    }
}

export class ReloadAction extends Action {
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

export class PacifyAction extends Action {
    oponent: Actor;

    constructor(player: Actor, oponent: Actor) {
        super(player);
        this.oponent = oponent;
    }

    getName() {
        return `Pacify ${this.oponent.name}`;
    }
}

export class LootAction extends Action {
    inventory: Inventory;

    constructor(player: Actor, inventory: Inventory) {
        super(player);
        this.inventory = inventory;
    }

    getName() {
        return `Loot ${this.inventory.name}`;
    }
}

export class AdvanceToSceneAction extends Action {
    name: string;
    nextScene: Scene;

    constructor(player: Actor, name: string, nextScene: Scene) {
        super(player);
        this.name = name;
        this.nextScene = nextScene;
    }

    getName() {
        return this.name;
    }
}

export class AdvanceToActAction extends Action {
    name: string;
    constructor(player: Actor, name: string) {
        super(player);
        this.name = name;
    }
    getName() {
        return this.name;
    }
}

export class ScapeAction extends Action {
    constructor(player: Actor) {
        super(player);
    }
    getName() {
        return 'Scape';
    }
}

export class CustomAction extends Action {
    name: string;
    canExecute: (scene: Scene) => boolean;
    execute: (scene: Scene) => Action;

    constructor(
        player: Actor,
        name: string,
        canExecute: (scene: Scene) => boolean,
        execute: (scene: Scene) => Action
    ) {
        super(player);
        this.name = name;
        this.canExecute = canExecute;
        this.execute = execute;
    }

    getName() {
        return this.name;
    }
}

export class Narration {
    title: string;
    actGenerators: Array<(player: Actor) => Scene>;

    constructor(title, actGenerators) {
        this.title = title;
        this.actGenerators = actGenerators;
    }

    getNextAct(player: Actor) {
        if (this.actGenerators.length === 0) {
            return;
        }
        const [actGenerator] = this.actGenerators.splice(0, 1);
        return actGenerator(player);
    }
}
