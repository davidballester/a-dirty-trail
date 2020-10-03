import { v4 as uuidv4 } from 'uuid';
import { Actor, ActorStatus } from './actor';
import { Inventory } from './inventory';

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

export const canChangeScene = (scene: Scene) =>
    !scene.actors.some((actor) => actor.is(ActorStatus.hostile));
