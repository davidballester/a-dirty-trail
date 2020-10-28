import NarrationsCatalogue from './NarrationsCatalogue';
import Narration from '../core/Narration';
import tutorial from './tutorial';
jest.mock('./tutorial', () => ({
    __esModule: true,
    id: 'tutorial',
}));
jest.mock('../core/Narration');

describe('NarrationsCatalogue', () => {
    describe('getNarration', () => {
        let narrationsCatalogue: NarrationsCatalogue;
        let narrationMock: jest.Mock;
        let narration: Narration;
        let initialize: jest.SpyInstance;
        beforeEach(() => {
            initialize = jest.fn();
            narration = ({
                initialize,
            } as unknown) as Narration;
            narrationMock = (Narration as unknown) as jest.Mock;
            narrationMock.mockReturnValue(narration);
            narrationsCatalogue = new NarrationsCatalogue();
        });

        it('throws an error when asked about an unknown narration', () => {
            try {
                narrationsCatalogue.getNarration('foo');
                fail('error expected');
            } catch (err) {}
        });

        it('returns the narration', () => {
            const tutorial = narrationsCatalogue.getNarration('Tutorial');
            expect(tutorial).toEqual(narration);
        });

        it('instantiates the narration with its title', () => {
            narrationsCatalogue.getNarration('Tutorial');
            expect(narrationMock).toHaveBeenCalledWith({ title: 'Tutorial' });
        });

        it('initializes the narration with the scene template', () => {
            narrationsCatalogue.getNarration('Tutorial');
            expect(initialize).toHaveBeenCalledWith(tutorial);
        });
    });

    describe('getNarrationsTitles', () => {
        let narrationsCatalogue: NarrationsCatalogue;
        beforeEach(() => {
            narrationsCatalogue = new NarrationsCatalogue();
        });

        it('returns narration titles', () => {
            const narrationTitles = narrationsCatalogue.getNarrationTitles();
            expect(narrationTitles.length).toBeGreaterThan(0);
        });

        it('each title refers to a known narration', () => {
            const narrationTitles = narrationsCatalogue.getNarrationTitles();
            narrationTitles.forEach((title) => {
                const tutorial = narrationsCatalogue.getNarration(title);
                expect(tutorial).toBeDefined();
            });
        });
    });
});
