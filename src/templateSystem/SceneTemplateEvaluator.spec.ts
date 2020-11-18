import Actor from '../core/Actor';
import Flags from '../core/Flags';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import SkillSet from '../core/SkillSet';
import Trinket from '../core/Trinket';
import SceneTemplateEvaluator from './SceneTemplateEvaluator';

describe(SceneTemplateEvaluator.name, () => {
    let template: string;
    let player: Actor;
    let sceneTemplateEvaluator: SceneTemplateEvaluator;

    describe('variables', () => {
        let response: string;
        beforeEach(() => {
            template = 'Hello, {{playerName}}, and welcome.';
            player = new Actor({
                name: 'Jane Doe',
                health: new Health({ current: 5, max: 5 }),
                inventory: new Inventory({}),
                skillSet: new SkillSet({}),
            });
            sceneTemplateEvaluator = new SceneTemplateEvaluator({
                template,
                player,
            });
            response = sceneTemplateEvaluator.evaluate();
        });

        it('replaces the player name', () => {
            expect(response).toEqual('Hello, Jane Doe, and welcome.');
        });
    });

    describe('if-has-trinket helper', () => {
        beforeEach(() => {
            template = `What do you have in there? {{#if-has-trinket "watch"}}Something useful!{{else}}Not much.{{/if-has-trinket}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({
                        trinkets: [new Trinket({ name: 'watch' })],
                    }),
                    skillSet: new SkillSet({}),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual(
                    'What do you have in there? Something useful!'
                );
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual(
                    'What do you have in there? Not much.'
                );
            });
        });
    });

    describe('if-has-not-trinket helper', () => {
        beforeEach(() => {
            template = `What time is it? {{#if-has-not-trinket "watch"}}You don't know, do you?{{else}}Thanks, Mr. O'Clock.{{/if-has-not-trinket}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual(
                    "What time is it? You don't know, do you?"
                );
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({
                        trinkets: [new Trinket({ name: 'watch' })],
                    }),
                    skillSet: new SkillSet({}),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual(
                    "What time is it? Thanks, Mr. O'Clock."
                );
            });
        });
    });

    describe('if-has-flag helper', () => {
        beforeEach(() => {
            template = `You have the eyes of a {{#if-has-flag "gentle"}}nun.{{else}}killer.{{/if-has-flag}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ gentle: 1 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual('You have the eyes of a nun.');
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ gentle: 0 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual('You have the eyes of a killer.');
            });
        });
    });

    describe('if-has-not-flag helper', () => {
        beforeEach(() => {
            template = `{{#if-has-not-flag "coins"}}No coin, no party.{{else}}Bring it!{{/if-has-not-flag}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ coins: -5 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual('No coin, no party.');
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ coins: 5 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual('Bring it!');
            });
        });
    });

    describe('if-flag-greater-than helper', () => {
        beforeEach(() => {
            template = `{{#if-flag-greater-than "coins" 5}}You rich chap.{{else}}You poor fellow.{{/if-flag-greater-than}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ coins: 8 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual('You rich chap.');
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ coins: 3 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual('You poor fellow.');
            });
        });
    });

    describe('if-flag-lower-than helper', () => {
        beforeEach(() => {
            template = `{{#if-flag-lower-than "coins" 5}}You poor fellow.{{else}}You rich chap.{{/if-flag-lower-than}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ coins: 3 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual('You poor fellow.');
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ coins: 8 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual('You rich chap.');
            });
        });
    });

    describe('if-flag-equal helper', () => {
        beforeEach(() => {
            template = `Do you have the shards? {{#if-flag-equal "shards" 3}}You do!{{else}}Go out there and find them!{{/if-flag-equal}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ shards: 3 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual('Do you have the shards? You do!');
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ shards: 2 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual(
                    'Do you have the shards? Go out there and find them!'
                );
            });
        });
    });

    describe('if-flag-different helper', () => {
        beforeEach(() => {
            template = `{{#if-flag-different "shards" 3}}Some of these must be fake!{{else}}Perfect!{{/if-flag-different}}`;
        });

        describe('condition met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ shards: 5 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the if block', () => {
                expect(response).toEqual('Some of these must be fake!');
            });
        });

        describe('condition not met', () => {
            let response: string;
            beforeEach(() => {
                player = new Actor({
                    name: 'Jane Doe',
                    health: new Health({ current: 5, max: 5 }),
                    inventory: new Inventory({}),
                    skillSet: new SkillSet({}),
                    flags: new Flags({ shards: 3 }),
                });
                sceneTemplateEvaluator = new SceneTemplateEvaluator({
                    template,
                    player,
                });
                response = sceneTemplateEvaluator.evaluate();
            });

            it('resolves the else block', () => {
                expect(response).toEqual('Perfect!');
            });
        });
    });
});
