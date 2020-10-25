import Actor from '../../core/Actor';
import AlysBuilder from './AlysBuilder';

describe('AlysBuilder', () => {
    it('does not fail to initialize Alys', () => {
        const alysBuilder = new AlysBuilder();
        const alys = alysBuilder.getAlys();
        expect(alys).toBeDefined();
    });
});
