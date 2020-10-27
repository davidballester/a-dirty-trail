import NarrationEngine from './NarrationEngine';
import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
jest.mock('../actions/ActionBuilder');

describe('NarrationEngine', () => {
    let janeDoe: Actor;
    let actionsMap: ActionsMap;
    let getAdvanceActions: jest.SpyInstance;
    let narrationEngine: NarrationEngine;
    let scene: Scene;
    let actionBuilderMock: jest.Mock;

    beforeEach(() => {
        actionBuilderMock = (ActionBuilder as unknown) as jest.Mock;
        getAdvanceActions = jest.fn();
        actionsMap = ({
            id: 'actions map',
            getAdvanceActions,
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

    it('initializes the action builder with the scene and player', () => {
        narrationEngine.getPlayerActions();
        expect(actionBuilderMock).toHaveBeenCalledWith({
            scene,
            actor: janeDoe,
        });
    });

    describe('getPlayerActions', () => {
        it('returns the actions map', () => {
            const returnedActionsMap = narrationEngine.getPlayerActions();
            expect(returnedActionsMap).toEqual(actionsMap);
        });
    });

    describe('isNarrationFinished', () => {
        it('returns true if there are no advance actions', () => {
            getAdvanceActions.mockReturnValue([]);
            const isNarrationFinished = narrationEngine.isNarrationFinished();
            expect(isNarrationFinished).toBeTruthy();
        });

        it('returns false if there are advance actions', () => {
            getAdvanceActions.mockReturnValue([{}]);
            const isNarrationFinished = narrationEngine.isNarrationFinished();
            expect(isNarrationFinished).toBeFalsy();
        });
    });
});
