import { when } from 'jest-when';
import SideEffectBuilder from './SideEffectBuilder';
import scriptingProcessor from './ScriptingProcessor';
import { RenamePlayerRule, Rule } from './Rules';
import Actor from '../core/Actor';
import Scene from '../core/Scene';

describe(SideEffectBuilder.name, () => {
    let parse: jest.SpyInstance;
    let rule: Rule;
    let getPlayer: jest.SpyInstance;
    let player: Actor;
    let changeName: jest.SpyInstance;
    let sideEffectBuilder: SideEffectBuilder;
    beforeEach(() => {
        parse = jest.spyOn(scriptingProcessor, 'parse');
        const sideEffectScript = 'my script';
        when(parse)
            .mockImplementation(() => {
                throw new Error('unknown argument');
            })
            .calledWith(sideEffectScript)
            .mockImplementation(() => rule);
        changeName = jest.fn();
        player = ({
            id: 'player',
            changeName,
        } as unknown) as Actor;
        getPlayer = jest.fn().mockReturnValue(player);
        const scene = ({
            getPlayer,
        } as unknown) as Scene;
        sideEffectBuilder = new SideEffectBuilder({ scene, sideEffectScript });
    });

    describe('change name rule', () => {
        beforeEach(() => {
            rule = {
                type: 'renamePlayer',
                newName: 'Roland Deschain',
            } as RenamePlayerRule;
        });

        it('invokes the change name of the player', () => {
            sideEffectBuilder.build();
            expect(changeName).toHaveBeenCalledWith('Roland Deschain');
        });
    });
});
