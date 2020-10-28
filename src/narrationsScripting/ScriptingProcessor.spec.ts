import { RenamePlayerRule, TakeWeaponRule } from './Rules';
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

    describe('take weapon', () => {
        it('returns a take item rule', () => {
            const rule = scriptingProcessor.parse(
                'take revolver (type:revolver, damage:1-2, skill:aim, ammunitionType:bullets, ammunition:6-6)'
            );
            expect(rule.type).toEqual('takeWeapon');
        });

        it('returns the weapon data', () => {
            const rule = scriptingProcessor.parse(
                'take revolver (type:gun, damage:1-2, skill:aim, ammunitionType:bullets, ammunition:4-6)'
            ) as TakeWeaponRule;
            expect(rule.item).toEqual({
                itemType: 'weapon',
                name: 'revolver',
                type: 'gun',
                minDamage: 1,
                maxDamage: 2,
                skill: 'aim',
                ammunitionType: 'bullets',
                currentAmmunition: 4,
                maxAmmunition: 6,
            });
        });

        it('returns the weapon data with a multi word ammunition type', () => {
            const rule = scriptingProcessor.parse(
                'take revolver (type:gun, damage:1-2, skill:aim, ammunitionType:big bullets, ammunition:4-6)'
            ) as TakeWeaponRule;
            expect(rule.item).toEqual({
                itemType: 'weapon',
                name: 'revolver',
                type: 'gun',
                minDamage: 1,
                maxDamage: 2,
                skill: 'aim',
                ammunitionType: 'big bullets',
                currentAmmunition: 4,
                maxAmmunition: 6,
            });
        });

        it('returns the weapon data without ammunition for a club', () => {
            const rule = scriptingProcessor.parse(
                'take club (type:blunt, damage:0-1, skill:swing)'
            ) as TakeWeaponRule;
            expect(rule.item).toEqual({
                itemType: 'weapon',
                name: 'club',
                type: 'blunt',
                minDamage: 0,
                maxDamage: 1,
                skill: 'swing',
            });
        });

        it('returns a multi word named weapon', () => {
            const rule = scriptingProcessor.parse(
                'take club with spikes (type:blunt, damage:0-1, skill:swing)'
            ) as TakeWeaponRule;
            expect(rule.item).toEqual({
                itemType: 'weapon',
                name: 'club with spikes',
                type: 'blunt',
                minDamage: 0,
                maxDamage: 1,
                skill: 'swing',
            });
        });
    });
});
