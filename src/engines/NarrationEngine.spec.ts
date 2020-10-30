import NarrativeSceneEngine from './NarrativeSceneEngine';
import ActionBuilder from '../actions/ActionBuilder';
import ActionsMap from '../core/ActionsMap';
import Scene from '../core/Scene';
import Actor from '../core/Actor';
jest.mock('../actions/ActionBuilder');

describe('NarrativeSceneEngine', () => {
    let janeDoe: Actor;
    let actionsMap: ActionsMap;
    let getAdvanceActions: jest.SpyInstance;
    let narrativeSceneEngine: NarrativeSceneEngine;
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
        narrativeSceneEngine = new NarrativeSceneEngine({ scene });
    });

    it('initializes the action builder with the scene and player', () => {
        narrativeSceneEngine.getPlayerActions();
        expect(actionBuilderMock).toHaveBeenCalledWith({
            scene,
            actor: janeDoe,
        });
    });

    describe('getPlayerActions', () => {
        it('returns the actions map', () => {
            const returnedActionsMap = narrativeSceneEngine.getPlayerActions();
            expect(returnedActionsMap).toEqual(actionsMap);
        });
    });

    describe('isNarrationFinished', () => {
        it('returns true if there are no advance actions', () => {
            getAdvanceActions.mockReturnValue([]);
            const isNarrationFinished = narrativeSceneEngine.isNarrationFinished();
            expect(isNarrationFinished).toBeTruthy();
        });

        it('returns false if there are advance actions', () => {
            getAdvanceActions.mockReturnValue([{}]);
            const isNarrationFinished = narrativeSceneEngine.isNarrationFinished();
            expect(isNarrationFinished).toBeFalsy();
        });
    });
});
