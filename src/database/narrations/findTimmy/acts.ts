import { getActorChallengeRate } from '../../../mechanics/challengeRate';
import { Actor } from '../../../models';
import { Goon, Robber } from '../../hostileActors';
import { Act } from '../models';

const acts = [
    {
        id: 'startup',
        actScenes: [
            {
                name: 'After the storm',
                setup: [
                    'The morning after the storm, the vagabond woke up in debris field that used to be their camp. They was alone, and Timmy was gone. They gathered their surviving belongings and set out to find Timmy.',
                ],
                linkToNextAct: 'Go after Timmy',
            },
        ],
    },
    {
        id: 'ambush',
        actScenes: [
            {
                name: 'A muddy path',
                setup: [
                    'Mountains loomed on the horizon. Beneath their feet, the vagabond just saw muddy puddles. Not far away, a wounded traveler lay against a tree trunk.',
                    '"Go away.", the traveler said',
                ],
                linksToActScenes: [
                    {
                        name: 'Avoid the traveler',
                        actSceneName: 'Better safe than sorry',
                    },
                    {
                        name: 'Approach the traveler',
                        actSceneName: 'Ambush!',
                    },
                ],
            },
            {
                name: 'Better safe than sorry',
                setup: [
                    'Times were tough. Whatever had happened to the traveler, the vagabond was not going to figure it out. They took a detour and pressed on.',
                ],
                linkToNextAct: 'Go after Timmy',
            },
            {
                name: 'Ambush!',
                setup: [
                    'As the vagabond approached the tree, the traveler shouted out.',
                    '"Don\'t, it\'s a trap!"',
                    'Two figures came out of the thicket with hungry smiles on their faces.',
                ],
                linksToActScenes: [
                    {
                        name: 'Approach the traveler',
                        actSceneName: 'The wounded traveler',
                    },
                ],
                actors: (player: Actor) => {
                    const firstGoon = new Goon();
                    const secondGoon = new Goon();
                    const robber = new Robber();
                    if (
                        getActorChallengeRate(player) -
                            (getActorChallengeRate(robber) +
                                getActorChallengeRate(firstGoon)) <
                        0
                    ) {
                        return [firstGoon, secondGoon];
                    }
                    return [robber, firstGoon];
                },
            },
            {
                name: 'The wounded traveler',
                setup: [
                    'The traveler was in a very bad shape.',
                    '"Nicely done." he said, pointing at the goons.',
                    '"You won\'t make it." the vagabond said, and the traveler shrugged.',
                    '"Tough luck."',
                    'The vagabond asked the traveler about Timmy.',
                    '"Up north." he said and the vagabond nodded. They gave him a sip of water and bid the traveler farewell.',
                ],
                linkToNextAct: 'Press on',
            },
        ],
    },
] as Act[];

export default acts;
