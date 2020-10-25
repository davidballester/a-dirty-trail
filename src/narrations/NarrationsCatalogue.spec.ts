import NarrationsCatalogue from './NarrationsCatalogue';

describe('NarrationsCatalogue', () => {
    let narrationsCatalogue: NarrationsCatalogue;
    beforeEach(() => {
        narrationsCatalogue = new NarrationsCatalogue();
    });

    describe('getNarration', () => {
        it('throws an error when asked about an unknown narration', () => {
            try {
                narrationsCatalogue.getNarration('foo');
                fail('error expected');
            } catch (err) {}
        });

        it('returns a narration', () => {
            const tutorial = narrationsCatalogue.getNarration('Tutorial');
            expect(tutorial).toBeDefined();
        });
    });

    describe('getNarrationsTitles', () => {
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
