import Random from './Random';
import Skill from './Skill';

describe('Skill', () => {
    it('initializes without error', () => {
        new Skill({ name: 'charisma', probabilityOfSuccess: 0.5 });
    });

    it('fails if the probability of success is lower than 0', () => {
        expect(
            () => new Skill({ name: 'charisma', probabilityOfSuccess: -0.5 })
        ).toThrow();
    });

    it('fails if the probability of success is higher than 1', () => {
        expect(
            () => new Skill({ name: 'charisma', probabilityOfSuccess: 1.5 })
        ).toThrow();
    });

    describe('getName', () => {
        it('returns the name', () => {
            const skill = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
            });
            const name = skill.getName();
            expect(name).toEqual('charisma');
        });
    });

    describe('getProbabilityOfSuccess | setProbabilityOfSuccess | modifyProbabilityOfSuccess', () => {
        let skill: Skill;
        beforeEach(() => {
            skill = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
            });
        });

        it('returns the probability of success', () => {
            const probabilityOfSuccess = skill.getProbabilityOfSuccess();
            expect(probabilityOfSuccess).toEqual(0.5);
        });

        it('sets the probability of success', () => {
            skill.setProbabilityOfSuccess(0.1);
            const probabilityOfSuccess = skill.getProbabilityOfSuccess();
            expect(probabilityOfSuccess).toEqual(0.1);
        });

        it('returns the modified the probability of success', () => {
            const modifiedProbabilityOfSuccess = skill.modifyProbabilityOfSuccess(
                0.1
            );
            const probabilityOfSuccess = skill.getProbabilityOfSuccess();
            expect(modifiedProbabilityOfSuccess).toEqual(probabilityOfSuccess);
        });

        it('modifies probability of success', () => {
            const modifiedProbabilityOfSuccess = skill.modifyProbabilityOfSuccess(
                0.1
            );
            expect(modifiedProbabilityOfSuccess).toEqual(0.6);
        });

        it('sets the probability of success to 1 if it exceeds 1', () => {
            const modifiedProbabilityOfSuccess = skill.modifyProbabilityOfSuccess(
                5
            );
            expect(modifiedProbabilityOfSuccess).toEqual(1);
        });

        it('sets the probability of success to 0 if it is lower than 0', () => {
            const modifiedProbabilityOfSuccess = skill.modifyProbabilityOfSuccess(
                -5
            );
            expect(modifiedProbabilityOfSuccess).toEqual(0);
        });
    });

    describe('rollSuccessWithModifier', () => {
        let randomGetRandom: jest.SpyInstance;
        let skill: Skill;
        beforeEach(() => {
            randomGetRandom = jest.spyOn(Random, 'getRandom');
            skill = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
                levelUpDelta: 0.1,
            });
        });

        it('succeeds if the random number is lower than the probability of success minus the opposition', () => {
            randomGetRandom.mockReturnValue(0.1);
            const result = skill.rollSuccessWithModifier(-0.1);
            expect(result).toBeTruthy();
        });

        it('levels up if random is higher than skill level', () => {
            randomGetRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.9);
            skill.rollSuccessWithModifier(-0.1);
            expect(skill.getProbabilityOfSuccess()).toEqual(0.6);
        });

        it('does not level up if random is equal to skill level', () => {
            randomGetRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.5);
            skill.rollSuccessWithModifier(-0.1);
            expect(skill.getProbabilityOfSuccess()).toEqual(0.5);
        });

        it('does not level up if random is lower than skill level', () => {
            randomGetRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.4);
            skill.rollSuccessWithModifier(-0.1);
            expect(skill.getProbabilityOfSuccess()).toEqual(0.5);
        });

        it('succeeds if the random number is equal than the probability of success minus the opposition', () => {
            randomGetRandom.mockReturnValue(0.4);
            const result = skill.rollSuccessWithModifier(-0.1);
            expect(result).toBeTruthy();
        });

        it('fails if the random number is higher than the probability of success minus the opposition', () => {
            randomGetRandom.mockReturnValue(0.4);
            const result = skill.rollSuccessWithModifier(-0.2);
            expect(result).toBeFalsy();
        });

        it('does not level up', () => {
            randomGetRandom.mockReturnValueOnce(0.4).mockReturnValueOnce(0.9);
            skill.rollSuccessWithModifier(-0.2);
            expect(skill.getProbabilityOfSuccess()).toEqual(0.5);
        });
    });
});
