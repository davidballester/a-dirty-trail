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

    describe('equals', () => {
        let thingWithId: ThingWithId;
        beforeEach(() => {
            thingWithId = new ThingWithId();
        });

        it('returns true for itself', () => {
            const isEqual = thingWithId.equals(thingWithId);
            expect(isEqual).toBe(true);
        });

        it('returns true for another object with the same ID', () => {
            const anotherThingWithSameId = ({
                getId: () => thingWithId.getId(),
            } as unknown) as ThingWithId;
            const isEqual = thingWithId.equals(anotherThingWithSameId);
            expect(isEqual).toBe(true);
        });

        it('returns false for another object with different ID', () => {
            const anotherThingWithId = new ThingWithId();
            const isEqual = thingWithId.equals(anotherThingWithId);
            expect(isEqual).toBe(false);
        });
    });
});
