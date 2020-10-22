import ThingWithId from './ThingWithId';

describe('ThingWithId', () => {
    it('initializes without errors', () => {
        new ThingWithId();
    });

    describe('getId', () => {
        it('gets an ID', () => {
            const thingWithId = new ThingWithId();
            const id = thingWithId.getId();
            expect(id).toBeTruthy();
        });
    });
});
