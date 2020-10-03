import { SceneGenerator } from '../world/scenes';
import { Actor } from './actor';
import { Ammunition, attack, AttackOutcome, Weapon } from './attack';
import { Inventory, takeItems } from './inventory';
import { pacify } from './pacify';
import { Scene } from './scene';

export abstract class Action<OutcomeType> {
    player: Actor;
    constructor(player: Actor) {
        this.player = player;
    }
    abstract getName(): string;
    abstract execute(): OutcomeType;
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

    execute(): AttackOutcome {
        return attack(this.player, this.weapon, this.oponent);
    }
}

export class ReloadAction extends Action<boolean> {
    weapon: Weapon;
    ammunition: Ammunition;
    inventory: Inventory;

    constructor(
        player: Actor,
        weapon: Weapon,
        ammunition: Ammunition,
        inventory: Inventory
    ) {
        super(player);
        this.weapon = weapon;
        this.ammunition = ammunition;
        this.inventory = inventory;
    }

    getName() {
        return `Reload ${this.ammunition.name} into ${this.weapon.name}`;
    }

    execute(): boolean {
        const success = this.weapon.reload(this.ammunition);
        if (success) {
            this.inventory.items = this.inventory.items.filter(
                (item) => !(item instanceof Ammunition) || !item.isSpent()
            );
        }
        return success;
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

    execute(): boolean {
        return pacify(this.player, this.oponent);
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

    execute(): void {
        return takeItems(this.inventory, this.player.inventory);
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

    execute(): Scene {
        return this.sceneGenerator();
    }
}
