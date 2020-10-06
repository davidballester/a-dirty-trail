import { ActorStatus, Scene } from '../models';

export const canChangeScene = (scene: Scene) =>
    !scene.actors.some((actor) => actor.is(ActorStatus.hostile));
