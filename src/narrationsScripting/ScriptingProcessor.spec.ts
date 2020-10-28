import { RenamePlayerRule } from './Rules';
import scriptingProcessor from './ScriptingProcessor';

describe('ScriptingProcessor', () => {
    describe('rename player action', () => {
        it('returns a rename player action rule', () => {
            const rule = scriptingProcessor.parse('rename player Roland');
            expect(rule.type).toEqual('renamePlayer');
        });

        it('returns the name of the player', () => {
            const rule = scriptingProcessor.parse(
                'rename player Roland'
            ) as RenamePlayerRule;
            expect(rule.newName).toEqual('Roland');
        });

        it('returns the name of the player when it is composed of multiple words', () => {
            const rule = scriptingProcessor.parse(
                'rename player Roland Deschain'
            ) as RenamePlayerRule;
            expect(rule.newName).toEqual('Roland Deschain');
        });
    });
});
