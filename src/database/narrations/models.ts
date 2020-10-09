import { Action, Actor, Inventory, NonPlayableActor } from '../../models';

export interface LinkToActScene {
    name: string;
    actSceneName: string;
}

export interface ActScene {
    name: string;
    setup: string[];
    linkToNextAct?: string;
    linksToActScenes?: LinkToActScene[];
    actors?: (player: Actor) => NonPlayableActor[];
    containers?: (player: Actor) => Inventory[];
    customActions?: (player: Actor) => Action[];
}

export interface Act {
    id: string;
    actScenes: ActScene[];
}
