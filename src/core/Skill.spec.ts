import { getNameOfDeclaration } from 'typescript';
import Skill from './Skill';

describe('Skill', () => {
    it('initializes without error', () => {
        new Skill({ name: 'charisma', probabilityOfSuccess: 0.5 });
    });

    it('fails if the probability of success is lower than 0', () => {
        try {
            new Skill({ name: 'charisma', probabilityOfSuccess: -0.5 });
            fail('expected an error');
        } catch (err) {}
    });

    it('fails if the probability of success is higher than 1', () => {
        try {
            new Skill({ name: 'charisma', probabilityOfSuccess: 1.5 });
            fail('expected an error');
        } catch (err) {}
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

    describe('getProbabilityOfSuccess', () => {
        it('returns the name', () => {
            const skill = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
            });
            const probabilityOfSuccess = skill.getProbabilityOfSuccess();
            expect(probabilityOfSuccess).toEqual(0.5);
        });
    });

    describe('rollSuccess', () => {
        let mathRandom: jest.SpyInstance;
        let skill: Skill;
        beforeEach(() => {
            mathRandom = jest.spyOn(Math, 'random');
            skill = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
            });
        });

        it('succeeds if the random number is lower than the probability of success', () => {
            mathRandom.mockReturnValue(0.4);
            const result = skill.rollSuccess();
            expect(result).toBeTruthy();
        });

        it('succeeds if the random number is equal than the probability of success', () => {
            mathRandom.mockReturnValue(0.5);
            const result = skill.rollSuccess();
            expect(result).toBeTruthy();
        });

        it('fails if the random number is higher than the probability of success', () => {
            mathRandom.mockReturnValue(0.6);
            const result = skill.rollSuccess();
            expect(result).toBeFalsy();
        });
    });

    describe('rollSuccessWithOpposition', () => {
        let mathRandom: jest.SpyInstance;
        let skill: Skill;
        beforeEach(() => {
            mathRandom = jest.spyOn(Math, 'random');
            skill = new Skill({
                name: 'charisma',
                probabilityOfSuccess: 0.5,
            });
        });

        it('succeeds if the random number is lower than the probability of success minus the opposition', () => {
            mathRandom.mockReturnValue(0.1);
            const result = skill.rollSuccessWithOpposition(0.1);
            expect(result).toBeTruthy();
        });

        it('succeeds if the random number is equal than the probability of success minus the opposition', () => {
            mathRandom.mockReturnValue(0.4);
            const result = skill.rollSuccessWithOpposition(0.1);
            expect(result).toBeTruthy();
        });

        it('fails if the random number is higher than the probability of success minus the opposition', () => {
            mathRandom.mockReturnValue(0.4);
            const result = skill.rollSuccessWithOpposition(0.2);
            expect(result).toBeFalsy();
        });
    });
});
