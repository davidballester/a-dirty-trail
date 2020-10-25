import NarrationEngine from './NarrationEngine';
import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
jest.mock('../actions/ActionBuilder');

describe('NarrationEngine', () => {
    let janeDoe: Actor;
    let actionsMap: ActionsMap;
    let narrationEngine: NarrationEngine;
    let scene: Scene;
    let actionBuilderMock: jest.Mock;

    beforeEach(() => {
        actionBuilderMock = (ActionBuilder as unknown) as jest.Mock;
        actionsMap = ({
            id: 'actions map',
        } as unknown) as ActionsMap;
        actionBuilderMock.mockImplementation(() => ({
            buildActions: jest.fn().mockReturnValue(actionsMap),
        }));
        janeDoe = ({
            id: 'jane doe',
        } as unknown) as Actor;
        scene = ({
            id: 'scene',
            getPlayer: jest.fn().mockReturnValue(janeDoe),
        } as unknown) as Scene;
        narrationEngine = new NarrationEngine({ scene });
    });

    describe('getPlayerActions', () => {
        it('initializes the action builder with the scene and player', () => {
            narrationEngine.getPlayerActions();
            expect(actionBuilderMock).toHaveBeenCalledWith({
                scene,
                actor: janeDoe,
            });
        });

        it('returns the actions map', () => {
            const returnedActionsMap = narrationEngine.getPlayerActions();
            expect(returnedActionsMap).toEqual(actionsMap);
        });
    });
});
