const scriptingGrammar = `
Rule
    = renamePlayerRule:RenamePlayerRule  { return renamePlayerRule; }

// Rules
RenamePlayerRule
    = "rename player " newName:NewName { return { type: 'renamePlayer', newName }; }

NewName
    = words:Word+  { return words.join(' '); }
    
// Language
Word
    = letters:$Letter+ __? { return letters; }
Letter
    = [a-z]
    / [A-Z]

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
