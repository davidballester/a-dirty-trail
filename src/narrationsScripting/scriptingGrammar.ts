const scriptingGrammar = `
Rule
    = renamePlayerRule:RenamePlayerRule  { return renamePlayerRule; }
    / takeItemRule:TakeItemRule { return takeItemRule; }

// Rules
RenamePlayerRule
    = "rename player " newName:NewName { return { type: 'renamePlayer', newName }; }

NewName
    = words:Word+  { return words.join(' '); }

TakeItemRule
    = "take " itemName:ItemName "(" itemCharacteristics:ItemCharacteristics ")" { return { type: 'takeItem', item: { name: itemName, ...itemCharacteristics } }; }

ItemName
    = words:Word+ { return words.join(' '); }

ItemCharacteristics
    = weapon:Weapon { return { itemType: 'weapon', ...weapon }; }

Weapon
    = "type:" type:Word ", " "damage:" minDamage:Number "-" maxDamage:Number ", " "skill:" skill:Word ammunition:WeaponAmmunition? { return { type, minDamage, maxDamage, skill, ...(ammunition || {}) }; }

WeaponAmmunition
    = ", "? "ammunitionType:" ammunitionType:Word+ ", " "ammunition:" currentAmmunition:Number "-" maxAmmunition:Number { return { ammunitionType: ammunitionType.join(' '), currentAmmunition, maxAmmunition }; }
    
// Language
Word
    = letters:$Letter+ __? { return letters; }
Letter
    = [a-z]
    / [A-Z]
Number
    = numbers:[0-9]+ { return parseInt(numbers); }

__
    = (Whitespace / LineTerminatorSequence)*
Whitespace
    = " "
LineTerminatorSequence
    = "\\n"
    / "\\r\\n"
    / "\\r"
`;

export default scriptingGrammar;
