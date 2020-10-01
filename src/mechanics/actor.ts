import { v4 as uuidv4 } from 'uuid';
import { Health } from './health';
import { Inventory } from './inventory';
import { Skill, SkillName } from './skill';

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
